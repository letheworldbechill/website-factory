/**
 * engine/validator.js
 *
 * Semantischer Validator — prüft die DSL nach dem Parser.
 * Ergänzt den Schema-Validator (schema/validate.js) um Laufzeit-Checks:
 * - Sind Section-IDs innerhalb einer Page eindeutig?
 * - Sind Page-IDs eindeutig?
 * - Ist die Section-Reihenfolge graph-konform?
 * - Gibt es leere required-Felder in kritischen Sections?
 */

import { validateSequence } from "./graph.js"

const VALID_SECTION_TYPES = new Set([
  "header", "hero", "trust", "authority", "services", "benefits",
  "process", "team", "gallery", "testimonials", "faq", "cta",
  "footer", "contact", "pricing", "custom",
])

/**
 * Validiert eine vollständige DSL (nach parse()).
 * Gibt { valid: boolean, errors: string[], warnings: string[] } zurück.
 *
 * @param {object} dsl - Geparste DSL
 */
export function validateDSL(dsl) {
  const errors   = []
  const warnings = []

  // ── Top-Level ───────────────────────────────────────────────────────────────
  if (!dsl.site)  errors.push("site fehlt")
  if (!dsl.theme) errors.push("theme fehlt")
  if (!dsl.pages || dsl.pages.length === 0) errors.push("pages ist leer")

  if (errors.length > 0) return { valid: false, errors, warnings }

  // ── Site ────────────────────────────────────────────────────────────────────
  if (!dsl.site.name)     errors.push("site.name fehlt")
  if (!dsl.site.industry) errors.push("site.industry fehlt")

  // ── Pages ───────────────────────────────────────────────────────────────────
  const pageIds = new Set()
  for (const page of dsl.pages) {
    if (!page.id) {
      errors.push("Page ohne id")
      continue
    }
    if (pageIds.has(page.id)) {
      errors.push(`Doppelte Page-ID: '${page.id}'`)
    }
    pageIds.add(page.id)

    // ── Sections ──────────────────────────────────────────────────────────────
    const sectionIds = new Set()
    const enabledTypes = []

    for (const section of page.sections || []) {
      // ID-Eindeutigkeit
      if (!section.id) {
        errors.push(`Page '${page.id}': Section ohne id`)
        continue
      }
      if (sectionIds.has(section.id)) {
        errors.push(`Page '${page.id}': Doppelte Section-ID '${section.id}'`)
      }
      sectionIds.add(section.id)

      // Typ
      if (!VALID_SECTION_TYPES.has(section.type)) {
        errors.push(`Page '${page.id}', Section '${section.id}': Unbekannter Typ '${section.type}'`)
      }

      // Nur enabled Sections in die Graph-Prüfung
      if (section.enabled !== false) {
        enabledTypes.push(section.type)
      }

      // Hero braucht mindestens einen Titel
      if (section.type === "hero" && !section.data?.title) {
        warnings.push(`Section '${section.id}': hero.data.title ist leer`)
      }

      // CTA braucht ctaPrimary
      if (section.type === "cta" && !section.data?.ctaPrimary) {
        warnings.push(`Section '${section.id}': cta.data.ctaPrimary ist leer`)
      }
    }

    // Graph-Reihenfolge prüfen (nur Warnungen, kein harter Fehler)
    const violations = validateSequence(enabledTypes)
    for (const v of violations) {
      warnings.push(`Page '${page.id}': ${v}`)
    }
  }

  return {
    valid:    errors.length === 0,
    errors,
    warnings,
  }
}
