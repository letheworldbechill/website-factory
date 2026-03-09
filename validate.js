/**
 * website-factory/schema/validate.js
 *
 * Schnell-Validator: prüft eine DSL-Datei gegen alle Schemas.
 * Kein Build-System nötig. Läuft direkt mit Node.js >= 18:
 *
 *   node schema/validate.js dsl/examples/landing-treuhand.json
 */

import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dir = dirname(fileURLToPath(import.meta.url))

// ── $ref-Auflösung ────────────────────────────────────────────────────────────

/**
 * Löst einen $ref-String auf.
 * Gibt { schema, rootSchema } zurück — rootSchema ist immer das Schema,
 * in dem $defs gesucht werden müssen.
 *
 * BUG-1 (fix): Externes Schema setzt eigenes rootSchema, damit interne
 * #/$defs-Refs korrekt aufgelöst werden.
 */
function resolveRef(ref, currentRootSchema) {
  if (ref.startsWith("#/")) {
    const parts = ref.slice(2).split("/")
    let node = currentRootSchema
    for (const p of parts) node = node?.[p]
    if (!node) throw new Error(`$ref '${ref}' nicht gefunden in aktuellem Schema`)
    return { schema: node, rootSchema: currentRootSchema }
  }
  const refFile = resolve(__dir, ref.replace("https://website-factory/schema/", ""))
  const loaded = JSON.parse(readFileSync(refFile, "utf8"))
  // BUG-1 fix: externes Schema ist sein eigenes rootSchema
  return { schema: loaded, rootSchema: loaded }
}

// ── Format-Validierung ────────────────────────────────────────────────────────

// BUG-3 fix: Minimale Format-Checks für die im Schema verwendeten Formate.
const FORMAT_CHECKS = {
  "email":         (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  "uri":           (v) => { try { new URL(v); return true } catch { return false } },
  "uri-reference": (v) => v.length > 0,
  "hostname":      (v) => /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v),
}

// ── Kern-Validator ────────────────────────────────────────────────────────────

function validate(schema, data, path = "#", rootSchema = null) {
  rootSchema = rootSchema || schema
  const errors = []

  if (schema.$ref) {
    const { schema: refSchema, rootSchema: refRoot } = resolveRef(schema.$ref, rootSchema)
    return validate(refSchema, data, path, refRoot)
  }

  if (schema.type === "object") {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      errors.push(`${path}: erwartet object, erhalten ${Array.isArray(data) ? "array" : typeof data}`)
      return errors
    }
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in data)) errors.push(`${path}: Pflichtfeld '${key}' fehlt`)
      }
    }
    if (schema.properties) {
      for (const [key, subSchema] of Object.entries(schema.properties)) {
        if (key in data) {
          errors.push(...validate(subSchema, data[key], `${path}.${key}`, rootSchema))
        }
      }
    }
    if (schema.additionalProperties === false && schema.properties) {
      const allowed = new Set(Object.keys(schema.properties))
      for (const key of Object.keys(data)) {
        if (!allowed.has(key)) errors.push(`${path}: unbekanntes Feld '${key}'`)
      }
    }
  }

  if (schema.type === "array") {
    if (!Array.isArray(data)) {
      errors.push(`${path}: erwartet array, erhalten ${typeof data}`)
      return errors
    }
    if (schema.minItems && data.length < schema.minItems) {
      errors.push(`${path}: mindestens ${schema.minItems} Einträge erwartet, ${data.length} vorhanden`)
    }
    if (schema.items) {
      data.forEach((item, i) => {
        errors.push(...validate(schema.items, item, `${path}[${i}]`, rootSchema))
      })
    }
  }

  if (schema.type === "string") {
    if (typeof data !== "string") {
      errors.push(`${path}: erwartet string, erhalten ${typeof data}`)
      return errors
    }
    if (schema.enum && !schema.enum.includes(data)) {
      errors.push(`${path}: '${data}' nicht erlaubt. Erlaubt: ${schema.enum.join(", ")}`)
    }
    if (schema.minLength && data.length < schema.minLength) {
      errors.push(`${path}: mindestens ${schema.minLength} Zeichen erwartet`)
    }
    if (schema.maxLength && data.length > schema.maxLength) {
      errors.push(`${path}: maximal ${schema.maxLength} Zeichen erlaubt (${data.length} vorhanden)`)
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(data)) {
      errors.push(`${path}: '${data}' entspricht nicht Muster ${schema.pattern}`)
    }
    // BUG-3 fix: Format-Prüfung
    if (schema.format && FORMAT_CHECKS[schema.format]) {
      if (!FORMAT_CHECKS[schema.format](data)) {
        errors.push(`${path}: '${data}' ist kein gültiges Format '${schema.format}'`)
      }
    }
  }

  if (schema.type === "integer" || schema.type === "number") {
    if (typeof data !== "number") {
      errors.push(`${path}: erwartet ${schema.type}, erhalten ${typeof data}`)
      return errors
    }
    // BUG-2 fix: Ganzzahl-Check
    if (schema.type === "integer" && !Number.isInteger(data)) {
      errors.push(`${path}: erwartet ganzzahligen Wert, erhalten ${data}`)
      return errors
    }
    if (schema.enum && !schema.enum.includes(data)) {
      errors.push(`${path}: ${data} nicht erlaubt. Erlaubt: ${schema.enum.join(", ")}`)
    }
    if (schema.minimum !== undefined && data < schema.minimum) {
      errors.push(`${path}: Minimalwert ${schema.minimum}, erhalten ${data}`)
    }
    if (schema.maximum !== undefined && data > schema.maximum) {
      errors.push(`${path}: Maximalwert ${schema.maximum}, erhalten ${data}`)
    }
  }

  if (schema.type === "boolean" && typeof data !== "boolean") {
    errors.push(`${path}: erwartet boolean, erhalten ${typeof data}`)
  }

  return errors
}

// ── Main ──────────────────────────────────────────────────────────────────────

const inputFile = process.argv[2]
if (!inputFile) {
  console.error("Usage: node schema/validate.js <dsl-file.json>")
  process.exit(1)
}

const dslPath    = resolve(process.cwd(), inputFile)
const schemaPath = resolve(__dir, "site.schema.json")

let dsl, schema
try {
  dsl    = JSON.parse(readFileSync(dslPath, "utf8"))
  schema = JSON.parse(readFileSync(schemaPath, "utf8"))
} catch (e) {
  console.error(`❌ Fehler beim Lesen: ${e.message}`)
  process.exit(1)
}

let errors
try {
  errors = validate(schema, dsl)
} catch (e) {
  console.error(`❌ Validierungs-Fehler: ${e.message}`)
  process.exit(1)
}

if (errors.length === 0) {
  console.log(`✅ ${inputFile} ist valid.`)
  console.log(`   Site:     ${dsl.site?.name}`)
  console.log(`   Industry: ${dsl.site?.industry}`)
  console.log(`   Theme:    ${dsl.theme?.preset}`)
  console.log(`   Pages:    ${dsl.pages?.length}`)
  const totalSections = dsl.pages?.reduce((n, p) => n + (p.sections?.length || 0), 0)
  console.log(`   Sections: ${totalSections}`)
} else {
  console.error(`❌ ${errors.length} Fehler in ${inputFile}:\n`)
  errors.forEach(e => console.error(`  • ${e}`))
  process.exit(1)
}
