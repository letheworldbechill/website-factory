/**
 * engine/graph.js
 *
 * Gerichteter Graph der erlaubten Section-Übergänge.
 * Erzwingt einen sinnvollen Story-Flow ohne starre Templates.
 *
 * G = (V, E) wobei V = Section-Typen, E = erlaubte Nachfolger
 *
 * DESIGNPRINZIP: Der Graph muss alle realen industry×complexity Kombinationen
 * abdecken, die pageComposer.js erzeugen kann. Jede Kante die pageComposer
 * braucht muss hier vorhanden sein.
 */

export const GRAPH = {
  header:       ["hero"],
  hero:         ["trust", "authority", "services", "benefits", "process", "gallery", "cta"],
  trust:        ["authority", "services", "benefits", "process", "team"],
  authority:    ["services", "benefits", "process", "pricing", "faq"],
  services:     ["process", "testimonials", "benefits", "pricing", "team", "gallery", "faq", "cta"],
  benefits:     ["process", "testimonials", "pricing", "faq", "cta"],
  process:      ["testimonials", "team", "gallery", "faq", "cta"],
  team:         ["testimonials", "gallery", "contact", "faq", "cta"],
  gallery:      ["testimonials", "cta"],
  testimonials: ["faq", "cta", "contact", "pricing"],
  faq:          ["cta", "contact"],
  pricing:      ["faq", "cta"],
  contact:      ["footer"],
  cta:          ["footer", "contact"],
  footer:       [],  // Endknoten
  custom:       [],  // Endknoten — custom kann überall stehen
}

/**
 * Prüft ob ein Übergang von source → target erlaubt ist.
 */
export function isValidTransition(source, target) {
  return GRAPH[source]?.includes(target) ?? false
}

/**
 * Prüft ob eine Section-Reihenfolge graph-konform ist.
 * Gibt ein Array der Verstösse zurück (leer = valide).
 *
 * @param {string[]} sequence - z.B. ["hero", "trust", "services", "cta", "footer"]
 * @returns {string[]}        - Verstösse
 */
export function validateSequence(sequence) {
  const violations = []

  for (let i = 0; i < sequence.length - 1; i++) {
    const from = sequence[i]
    const to   = sequence[i + 1]

    if (!(from in GRAPH)) {
      violations.push(`Unbekannter Section-Typ: '${from}'`)
      continue
    }

    // header und custom sind permissiv — dürfen überall stehen
    if (from === "header" || from === "custom" || to === "custom") continue

    if (!isValidTransition(from, to)) {
      violations.push(`Ungültiger Übergang: '${from}' → '${to}'`)
    }
  }

  return violations
}

/**
 * Gibt alle bekannten Section-Typen zurück.
 */
export function allSectionTypes() {
  return Object.keys(GRAPH)
}
