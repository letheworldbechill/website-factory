/**
 * engine/compiler.js
 *
 * Haupteinstieg der Factory.
 * DSL → vollständiges HTML-Dokument.
 *
 * Ablauf:
 *   1. parse()          → normierte DSL
 *   2. applyAutoStyle() → industry-aware theme defaults (auto-style-engine)
 *   3. validateDSL      → Fehler/Warnungen
 *   4. composePage      → Section-Typen
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
import { compileHeaderScript } from "../patterns/header.js"
import { autoStyleEngine }  from "../auto-style-engine.js"
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

  // 2. Auto-style: enrich theme with industry-aware defaults
  applyAutoStyle(config, input)

  // 3. Validate
  const { valid, errors, warnings } = validateDSL(config)

  if (warnings.length > 0) {
    warnings.forEach(w => console.warn("compiler warning:", w))
  }
  if (!valid) {
    const msg = "compiler: DSL-Fehler:\n" + errors.map(e => `  • ${e}`).join("\n")
    if (opts.strict) throw new Error(msg)
    console.error(msg)
  }

  // 4. Seiten kompilieren (CSS wird intern in compilePage erzeugt)
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
    sections = composeSections(types, config.site.industry)
  }

  // Pass sibling sections to renderer for header nav auto-generation
  const renderConfig = { ...config, _pageSections: sections }

  const body = sections
    .map(section => renderSection(section, renderConfig))
    .join("\n")

  const meta = compileMeta(page, config)
  const css  = compileTheme(config.theme)
  const lang = esc(config.site.language || "de")

  const hasHeader = sections.some(s => s.type === "header" && s.enabled !== false)
  const headerPadding = hasHeader
    ? "\n:root { --header-h: 64px; }\n@media (max-width: 768px) { :root { --header-h: 56px; } }\nbody { padding-top: var(--header-h); }"
    : ""
  const headerScript = hasHeader ? "\n" + compileHeaderScript() : ""

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
img { max-width: 100%; display: block; }${headerPadding}
${css}
</style>
</head>
<body>
${body}${headerScript}
</body>
</html>`
}

// ── Font-Stack → font-family mapping ─────────────────────────────────────────

const FONT_STACKS = {
  serif:      { display: "Playfair Display, Georgia, serif",      body: "Inter, system-ui, sans-serif" },
  instrument: { display: "Instrument Sans, system-ui, sans-serif", body: "Instrument Sans, system-ui, sans-serif" },
  inter:      { display: "Inter, system-ui, sans-serif",           body: "Inter, system-ui, sans-serif" },
  dmsans:     { display: "DM Sans, system-ui, sans-serif",        body: "DM Sans, system-ui, sans-serif" },
}

/**
 * Enriches config.theme with industry-aware defaults from auto-style-engine.
 * Respects user-provided theme fields (locks) — only fills in gaps.
 */
function applyAutoStyle(config, rawInput) {
  const rawTheme = rawInput?.theme || {}

  // Determine locks: which theme fields the user explicitly provided
  const locks = {
    preset:     Boolean(rawTheme.preset),
    typography: Boolean(rawTheme.font?.display || rawTheme.font?.body),
    density:    Boolean(rawTheme.density),
    colors:     Boolean(rawTheme.brand?.primary || rawTheme.brand?.accent),
    fx:         false,  // FX not yet rendered by compiler — always auto-derive for future use
  }

  // Build context
  const context = {
    locks,
    industryKey:  config.site.industry,
    logoColors:   rawInput?.assets?.logoColors || [],
  }

  const result = autoStyleEngine({}, context)

  // Apply to config.theme (only unlocked fields)
  if (!locks.preset && result.stylePreset) {
    config.theme.preset = result.stylePreset
  }
  if (!locks.density && result.designDensity) {
    config.theme.density = result.designDensity
  }
  if (!locks.colors) {
    if (result.primaryColor) {
      config.theme.brand = config.theme.brand || {}
      config.theme.brand.primary = result.primaryColor
    }
    if (result.accentColor) {
      config.theme.brand = config.theme.brand || {}
      config.theme.brand.accent = result.accentColor
    }
  }
  if (!locks.typography && result.fontStack && FONT_STACKS[result.fontStack]) {
    config.theme.font = config.theme.font || {}
    config.theme.font.display = config.theme.font.display || FONT_STACKS[result.fontStack].display
    config.theme.font.body    = config.theme.font.body    || FONT_STACKS[result.fontStack].body
  }
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
