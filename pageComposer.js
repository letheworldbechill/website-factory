/**
 * engine/pageComposer.js
 *
 * Bestimmt welche Section-Typen eine Seite enthält.
 * Basiert auf pageType × industry × complexity.
 *
 * Gibt eine geordnete Liste von Section-Typ-Strings zurück —
 * der Section Composer baut daraus konkrete Section-Objekte.
 */

import { validateSequence } from "./graph.js"

// ── Page Type Basis-Mengen ────────────────────────────────────────────────────

const PAGE_TYPES = {
  landing:   ["hero", "services", "cta", "footer"],
  sales:     ["hero", "benefits", "testimonials", "faq", "cta", "footer"],
  company:   ["hero", "services", "team", "contact", "footer"],
  portfolio: ["hero", "gallery", "testimonials", "contact", "footer"],
  onepage:   ["hero", "services", "process", "testimonials", "cta", "footer"],
}

// ── Industry Extensions ───────────────────────────────────────────────────────

const INDUSTRY_EXTENSIONS = {
  treuhand:    ["trust", "process", "faq"],
  kanzlei:     ["authority", "faq"],
  it:          ["benefits", "testimonials"],
  saas:        ["authority", "pricing", "faq"],
  restaurant:  ["gallery", "testimonials"],
  handwerk:    ["trust", "process", "gallery"],
  immobilien:  ["gallery", "testimonials"],
  medizin:     ["trust", "team", "faq"],
  coaching:    ["authority", "process", "testimonials"],
  bildung:     ["process", "team", "faq"],
  generic:     [],
}

// ── Complexity Map (Fibonacci) ────────────────────────────────────────────────

const COMPLEXITY = {
  1: ["hero", "cta", "footer"],
  3: ["hero", "services", "cta", "footer"],
  5: ["hero", "trust", "services", "testimonials", "cta", "footer"],
  8: ["hero", "trust", "authority", "services", "process", "testimonials", "faq", "cta", "footer"],
}

// ── Reihenfolge ───────────────────────────────────────────────────────────────

// Kanonische Reihenfolge aller Section-Typen.
// Wird genutzt um die gemergte Menge zu sortieren.
const CANONICAL_ORDER = [
  "header",
  "hero",
  "trust",
  "authority",
  "services",
  "benefits",
  "process",
  "team",
  "gallery",
  "testimonials",
  "pricing",   // nach testimonials, vor faq — korrekte Sales-Reihenfolge
  "faq",
  "contact",
  "cta",
  "footer",
]

// ── Composer ──────────────────────────────────────────────────────────────────

/**
 * Gibt eine geordnete Liste von Section-Typ-Strings zurück.
 *
 * @param {object} site - site-Objekt aus der DSL (nach dem Parser)
 * @returns {string[]}  - z.B. ["hero", "trust", "services", "faq", "cta", "footer"]
 */
export function composePage(site) {
  const base       = COMPLEXITY[site.complexity] || COMPLEXITY[5]
  const extensions = INDUSTRY_EXTENSIONS[site.industry] || []

  // Merged Set: alle Typen aus Complexity + Industry Extensions
  const merged = new Set(base)
  extensions.forEach(s => merged.add(s))

  // Sortieren nach kanonischer Reihenfolge
  const sorted = CANONICAL_ORDER.filter(type => merged.has(type))

  // Graph-Validierung (Warnungen, keine Fehler — Reihenfolge ist bereits kanonisch)
  const violations = validateSequence(sorted)
  if (violations.length > 0) {
    console.warn("pageComposer: Graph-Verstösse in generierter Reihenfolge:", violations)
  }

  return sorted
}

/**
 * Gibt die Basis-Sections für einen pageType zurück (ohne industry/complexity).
 * Nützlich für Tests und Previews.
 */
export function basePageSections(pageType) {
  return PAGE_TYPES[pageType] || PAGE_TYPES.landing
}

/**
 * Gibt die Industry-Extensions für eine Branche zurück.
 */
export function industryExtensions(industry) {
  return INDUSTRY_EXTENSIONS[industry] || []
}
