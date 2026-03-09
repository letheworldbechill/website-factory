/**
 * engine/compiler.js
 *
 * Haupteinstieg der Factory.
 * DSL → vollständiges HTML-Dokument.
 *
 * Ablauf:
 *   1. parse()     → normierte DSL
 *   2. validateDSL → Fehler/Warnungen
 *   3. composePage → Section-Typen
 *   4. sections übernehmen (aus DSL) oder composeSections (auto)
 *   5. renderSection pro Section
 *   6. compileTheme → CSS
 *   7. HTML-Dokument zusammenbauen
 */

import { parse }            from "./parser.js"
import { validateDSL }      from "./validator.js"
import { composePage }      from "./pageComposer.js"
import { composeSections }  from "./sectionComposer.js"
import { renderSection }    from "./renderer.js"
import { compileTheme }     from "../design/themeCompiler.js"
import { esc }              from "./escape.js"

/**
 * Kompiliert eine DSL (roh oder bereits geparst) zu einem HTML-String.
 *
 * @param {object}  input    - Rohe oder geparste DSL
 * @param {object}  [opts]
 * @param {boolean} [opts.strict=false] - Bei true: Fehler werfen statt Warning
 * @returns {string}         - Vollständiges HTML-Dokument
 */
export function compileSite(input, opts = {}) {
  // 1. Parse
  const config = parse(input)

  // 2. Validate
  const { valid, errors, warnings } = validateDSL(config)

  if (warnings.length > 0) {
    warnings.forEach(w => console.warn("compiler warning:", w))
  }
  if (!valid) {
    const msg = "compiler: DSL-Fehler:\n" + errors.map(e => `  • ${e}`).join("\n")
    if (opts.strict) throw new Error(msg)
    console.error(msg)
  }

  // 3. Seiten kompilieren (CSS wird intern in compilePage erzeugt)
  const pages = config.pages.map(page => compilePage(page, config))

  // Bei einer Seite direkt das HTML zurückgeben
  if (pages.length === 1) return pages[0]

  // Mehrere Seiten: Map { pageId → html }
  return Object.fromEntries(config.pages.map((p, i) => [p.id, pages[i]]))
}

// ── Interne Helfer ────────────────────────────────────────────────────────────

function compilePage(page, config) {
  // Sections: aus DSL übernehmen oder auto-generieren
  let sections = page.sections || []

  if (sections.length === 0) {
    const types = composePage(config.site)
    sections = composeSections(types)
  }

  const body = sections
    .map(section => renderSection(section, config))
    .join("\n")

  const meta = compileMeta(page, config)
  const css  = compileTheme(config.theme)
  const lang = esc(config.site.language || "de")

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${meta}
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: var(--font-body); background: var(--c-bg); color: var(--c-text); line-height: 1.5; -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
${css}
</style>
</head>
<body>
${body}
</body>
</html>`
}

function compileMeta(page, config) {
  const seo  = config.seo  || {}
  const site = config.site || {}

  const rawTitle = page.title
    ? (seo.titleTemplate || "%s").replace("%s", page.title)
    : site.name || ""
  const title       = esc(rawTitle)
  const description = esc(page.description || seo.defaultDescription || "")
  const canonical   = seo.canonical
    ? esc(`${seo.canonical}${page.slug === "/" ? "" : page.slug}`)
    : ""
  const ogLocale    = esc(seo.locale || "de_CH")
  const robots      = esc(seo.robots || "index, follow")
  const ogImage     = esc(seo.ogImage || "")

  return [
    `<title>${title}</title>`,
    description ? `<meta name="description" content="${description}">` : "",
    `<meta name="robots" content="${robots}">`,
    canonical   ? `<link rel="canonical" href="${canonical}">` : "",
    `<meta property="og:title" content="${title}">`,
    description ? `<meta property="og:description" content="${description}">` : "",
    ogImage     ? `<meta property="og:image" content="${ogImage}">` : "",
    `<meta property="og:locale" content="${ogLocale}">`,
  ].filter(Boolean).join("\n")
}
