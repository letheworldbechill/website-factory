/**
 * engine/sectionComposer.js
 *
 * Erzeugt aus einer Liste von Section-Typ-Strings vollständige Section-Objekte.
 * Jede Section bekommt ID, areas, data, items und settings aus den Defaults.
 */

import { DEFAULT_AREAS, DEFAULT_DATA, DEFAULT_SETTINGS, DEFAULT_ITEMS, INDUSTRY_CONTENT } from "./defaults.js"
import { sectionId } from "./ids.js"

/**
 * Erzeugt Section-Objekte aus einer Liste von Typ-Strings.
 *
 * @param {string[]} sectionTypes - z.B. ["hero", "trust", "services", "cta", "footer"]
 * @param {string}   [industry]  - Branche für branchenspezifische Inhalte
 * @returns {object[]}            - Vollständige Section-Objekte
 */
export function composeSections(sectionTypes, industry) {
  const ic = (industry && INDUSTRY_CONTENT[industry]) || {}

  return sectionTypes.map(type => {
    // Merge: default data ← industry-specific data overrides
    const baseData     = DEFAULT_DATA[type]  || {}
    const industryData = ic[type]            || {}
    const data         = { ...baseData, ...industryData }

    // Items: industry-specific → default → empty
    const industryItems = ic._items?.[type]
    const items         = industryItems || DEFAULT_ITEMS[type] || []

    return {
      id:       sectionId(type),
      type,
      enabled:  true,
      areas:    { ...(DEFAULT_AREAS[type]    || { content: 1 }) },
      pattern:  undefined,
      data,
      items:    items.map(i => ({ ...i })),
      settings: { ...(DEFAULT_SETTINGS[type] || { background: "default", paddingTop: "lg", paddingBottom: "lg" }) },
    }
  })
}

/**
 * Erzeugt eine einzelne Section für einen Typ.
 * Nützlich wenn der Page Composer eine neue Section zu einer bestehenden Page hinzufügt.
 */
export function composeSection(type, industry) {
  return composeSections([type], industry)[0]
}
