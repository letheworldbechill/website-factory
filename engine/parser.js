/**
 * engine/parser.js
 *
 * Wandelt beliebig unvollständige Inputs in eine normierte, vollständige
 * DSL-Struktur um. Der Parser ist der einzige Ort, an dem Defaults gesetzt
 * und Kurzformen in Vollformen umgewandelt werden.
 *
 * Regel: Nach dem Parser ist die DSL immer vollständig und gültig.
 */

import { DEFAULT_AREAS, DEFAULT_DATA, DEFAULT_SETTINGS } from "./defaults.js"
import { sectionId } from "./ids.js"

// ── Site-Defaults ─────────────────────────────────────────────────────────────

const SITE_DEFAULTS = {
  language:   "de-CH",
  pageType:   "landing",
  complexity: 5,
}

const THEME_DEFAULTS = {
  preset:       "swiss",
  density:      "balanced",
  spacingScale: 1.0,
}

// ── Haupt-Parser ──────────────────────────────────────────────────────────────

/**
 * Parst einen beliebigen Input in eine vollständige DSL.
 *
 * @param {object} input - Rohe Eingabe (kann unvollständig sein)
 * @returns {object}     - Vollständige, normierte DSL
 */
export function parse(input) {
  if (!input || typeof input !== "object") {
    throw new Error("Parser: Input muss ein Objekt sein")
  }

  return {
    version: "1.0",
    site:    parseSite(input.site || input),
    theme:   parseTheme(input.theme || {}),
    pages:   parsePages(input.pages || [], input.site || input),
    seo:     parseSeo(input.seo || {}, input.site || input),
    tracking: input.tracking || {},
    legal:   parseLegal(input.legal || {}, input.site || input),
    assets:  input.assets || {},
  }
}

// ── Site ──────────────────────────────────────────────────────────────────────

function parseSite(raw) {
  if (!raw.name)     throw new Error("Parser: site.name ist Pflichtfeld")
  if (!raw.industry) throw new Error("Parser: site.industry ist Pflichtfeld")

  return {
    name:       raw.name,
    language:   raw.language   || SITE_DEFAULTS.language,
    industry:   raw.industry,
    pageType:   raw.pageType   || SITE_DEFAULTS.pageType,
    complexity: raw.complexity || SITE_DEFAULTS.complexity,
    domain:     raw.domain     || "",
    tagline:    raw.tagline    || "",
    contact:    parseContact(raw.contact || {}),
  }
}

function parseContact(raw) {
  return {
    email:   raw.email   || "",
    phone:   raw.phone   || "",
    address: raw.address || "",
    city:    raw.city    || "",
    zip:     raw.zip     || "",
    country: raw.country || "CH",
  }
}

// ── Theme ─────────────────────────────────────────────────────────────────────

function parseTheme(raw) {
  return {
    preset:       raw.preset       || THEME_DEFAULTS.preset,
    density:      raw.density      || THEME_DEFAULTS.density,
    spacingScale: raw.spacingScale || THEME_DEFAULTS.spacingScale,
    brand:        raw.brand        || {},
    font:         raw.font         || {},
    radius:       raw.radius       || "default",
    motion:       raw.motion       || "default",
  }
}

// ── Pages ─────────────────────────────────────────────────────────────────────

function parsePages(rawPages, site) {
  // Keine Pages angegeben → eine Standardseite erzeugen
  if (!rawPages || rawPages.length === 0) {
    return [parsePage({ id: "home", kind: site.pageType || "landing" }, 0)]
  }
  return rawPages.map((raw, idx) => parsePage(raw, idx))
}

function parsePage(raw, idx = 0) {
  // BUG-6 Fix: Fehlende id bekommt einen Index-basierten Fallback
  const id = raw.id || (idx === 0 ? "home" : `page-${idx + 1}`)
  return {
    id,
    kind:        raw.kind || "landing",
    title:       raw.title || "",
    description: raw.description || "",
    slug:        raw.slug || (id === "home" ? "/" : `/${id}`),
    nav:         raw.nav || {},
    sections:    (raw.sections || []).map(parseSection),
  }
}

// ── Sections ──────────────────────────────────────────────────────────────────

function parseSection(raw) {
  const type = raw.type || "custom"

  return {
    id:       raw.id       || sectionId(type),
    type,
    enabled:  raw.enabled  !== undefined ? raw.enabled : true,
    areas:    raw.areas    || DEFAULT_AREAS[type] || { content: 1 },
    pattern:  raw.pattern  || undefined,       // undefined = Pattern Selector entscheidet
    data:     mergeData(DEFAULT_DATA[type] || {}, raw.data || {}),
    items:    (raw.items || []).map(parseItem),
    settings: mergeSettings(DEFAULT_SETTINGS[type] || {}, raw.settings || {}),
  }
}

function mergeData(defaults, overrides) {
  return { ...defaults, ...overrides }
}

function mergeSettings(defaults, overrides) {
  return { ...defaults, ...overrides }
}

function parseItem(raw) {
  // Items sind intentionell flexibel — nur id wird garantiert
  return {
    id: raw.id || sectionId("item"),
    ...raw,
  }
}

// ── SEO ───────────────────────────────────────────────────────────────────────

function parseSeo(raw, site) {
  const name = site.name || ""
  return {
    titleTemplate:      raw.titleTemplate      || `%s | ${name}`,
    defaultDescription: raw.defaultDescription || site.tagline || "",
    ogImage:            raw.ogImage            || "",
    canonical:          raw.canonical          || (site.domain ? `https://${site.domain}` : ""),
    locale:             raw.locale             || "de_CH",
    robots:             raw.robots             || "index, follow",
  }
}

// ── Legal ─────────────────────────────────────────────────────────────────────

function parseLegal(raw, site) {
  return {
    cookieBanner:    raw.cookieBanner   || false,
    imprintUrl:      raw.imprintUrl     || "",
    privacyUrl:      raw.privacyUrl     || "",
    agbUrl:          raw.agbUrl         || "",
    companyName:     raw.companyName    || site.name || "",
    companyAddress:  raw.companyAddress || [site.contact?.address, site.contact?.city].filter(Boolean).join(", "),
    vatId:           raw.vatId          || "",
  }
}
