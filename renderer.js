/**
 * engine/renderer.js
 *
 * Verbindet Pattern Selector, Layout Composer und Pattern-Renderer.
 * Gibt für eine Section den fertigen HTML-String zurück.
 */

import { selectPattern }   from "./patternSelector.js"
import { composeLayout }   from "./layoutComposer.js"

import { renderHero }         from "./hero.js"
import { renderText }         from "./text.js"
import { renderCards }        from "./cards.js"
import { renderFaq }          from "./faq.js"
import { renderCta }          from "./cta.js"
import { renderTrust }        from "./trust.js"
import { renderProcess }      from "./process.js"
import { renderTestimonials } from "./testimonials.js"
import { renderFooter }       from "./footer.js"

// Pattern → Render-Funktion
const RENDER_MAP = {
  hero:         renderHero,
  text:         renderText,
  cards:        renderCards,
  faq:          renderFaq,
  cta:          renderCta,
  trust:        renderTrust,
  process:      renderProcess,
  testimonials: renderTestimonials,
  footer:       renderFooter,
  // Aliase
  split:        renderCards,
  grid:         renderCards,
  list:         renderText,
  gallery:      renderCards,
  contact:      renderText,
  header:       renderText,
}

/**
 * Rendert eine einzelne Section zu HTML.
 *
 * @param {object} section - Section-Objekt
 * @param {object} config  - Vollständige DSL (für footer: legal, site)
 * @returns {string}       - HTML-String
 */
export function renderSection(section, config = {}) {
  if (section.enabled === false) return ""

  const pattern = selectPattern(section)
  const layout  = composeLayout(section)
  const fn      = RENDER_MAP[pattern]

  if (!fn) {
    console.warn(`renderer: Kein Renderer für Pattern '${pattern}' (Section '${section.id}')`)
    return `<!-- section ${section.id} (${section.type}): kein Renderer -->`
  }

  return fn(section, layout, config)
}
