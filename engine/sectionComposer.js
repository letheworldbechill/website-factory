/**
 * engine/sectionComposer.js
 *
 * Erzeugt aus einer Liste von Section-Typ-Strings vollständige Section-Objekte.
 * Jede Section bekommt ID, areas, data, items und settings aus den Defaults.
 */

import { DEFAULT_AREAS, DEFAULT_DATA, DEFAULT_SETTINGS } from "./defaults.js"
import { sectionId } from "./ids.js"

/**
 * Erzeugt Section-Objekte aus einer Liste von Typ-Strings.
 *
 * @param {string[]} sectionTypes - z.B. ["hero", "trust", "services", "cta", "footer"]
 * @returns {object[]}            - Vollständige Section-Objekte
 */
export function composeSections(sectionTypes) {
  return sectionTypes.map(type => ({
    id:       sectionId(type),
    type,
    enabled:  true,
    areas:    { ...(DEFAULT_AREAS[type]    || { content: 1 }) },
    pattern:  undefined,
    data:     { ...(DEFAULT_DATA[type]     || {}) },
    items:    [],
    settings: { ...(DEFAULT_SETTINGS[type] || { background: "default", paddingTop: "lg", paddingBottom: "lg" }) },
  }))
}

/**
 * Erzeugt eine einzelne Section für einen Typ.
 * Nützlich wenn der Page Composer eine neue Section zu einer bestehenden Page hinzufügt.
 */
export function composeSection(type) {
  return composeSections([type])[0]
}
