/**
 * engine/layoutComposer.js
 *
 * Erzeugt aus den Fibonacci-areas einer Section ein Layout-Objekt.
 * Das Layout-Objekt wird von den Pattern-Renderern in CSS umgewandelt.
 */

// Anzahl Spalten → Layout-Typ
const LAYOUT_TYPES = {
  1: "stack",
  2: "split",
  3: "triple",
}

/**
 * Erzeugt ein Layout-Objekt aus den areas einer Section.
 *
 * @param {object} section - Section mit areas-Objekt
 * @returns {object}       - Layout-Beschreibung
 */
export function composeLayout(section) {
  const areas   = section.areas || { content: 1 }
  const keys    = Object.keys(areas)
  const values  = Object.values(areas)
  const columns = values.map(v => `${v}fr`).join(" ")
  const count   = keys.length

  return {
    display:    "grid",
    columns,
    type:       LAYOUT_TYPES[count] || "grid",
    areaNames:  keys,
    areaValues: values,
    // Inline-Style-String für direkte Nutzung im HTML
    style:      `display:grid;grid-template-columns:${columns};gap:var(--sp-8)`,
  }
}

/**
 * Gibt einen responsiven Wrapper-Style zurück.
 * Auf Mobile kollabiert jedes Grid zu einer Spalte.
 *
 * @param {object} layout - Ergebnis von composeLayout()
 * @returns {string}      - CSS-Klassen-String
 */
export function layoutClass(layout) {
  const map = {
    stack:  "layout-stack",
    split:  "layout-split",
    triple: "layout-triple",
    grid:   "layout-grid",
  }
  return map[layout.type] || "layout-grid"
}
