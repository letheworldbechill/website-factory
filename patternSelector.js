/**
 * engine/patternSelector.js
 *
 * Wählt das UI-Pattern für eine Section.
 * Reihenfolge: expliziter Override → fester Typ → Item-Anzahl-Regel.
 */

// Section-Typen mit festem Pattern (unabhängig von Item-Anzahl)
const FIXED_PATTERNS = {
  header:       "header",
  hero:         "hero",
  trust:        "trust",
  authority:    "text",
  process:      "process",
  faq:          "faq",
  cta:          "cta",
  footer:       "footer",
  contact:      "contact",
  gallery:      "gallery",
  testimonials: "testimonials",
}

// Section-Typen die item-basiert ihr Pattern wählen
// (kein Eintrag in FIXED_PATTERNS → fällt durch zur Item-Anzahl-Regel)
// services, benefits, pricing, team, custom → je nach items: text | cards | grid | list

/**
 * Gibt das Pattern für eine Section zurück.
 *
 * @param {object} section - Section-Objekt (muss type und optional items haben)
 * @returns {string}       - Pattern-Bezeichner
 */
export function selectPattern(section) {
  // 1. Expliziter Override in der DSL
  if (section.pattern) return section.pattern

  // 2. Fester Typ
  if (FIXED_PATTERNS[section.type]) return FIXED_PATTERNS[section.type]

  // 3. Item-Anzahl-Regel
  const count = section.items?.length || 0

  // BUG-8 Fix: Sections wie services/benefits/pricing/team erwarten eine Card-Struktur
  // auch wenn noch keine Items befüllt sind (Skeleton-Rendering). 'text' wäre irreführend.
  const isItemSection = ["services", "benefits", "pricing", "team"].includes(section.type)
  if (count === 0) return isItemSection ? "cards" : "text"
  if (count === 2) return "split"
  if (count <= 4) return "cards"
  if (count <= 8) return "grid"
  return "list"
}
