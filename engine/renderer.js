/**
 * engine/renderer.js
 *
 * Verbindet Pattern Selector, Layout Composer und Pattern-Renderer.
 * Gibt für eine Section den fertigen HTML-String zurück.
 */

import { selectPattern }   from "./patternSelector.js"
import { composeLayout }   from "./layoutComposer.js"
import { esc }             from "./escape.js"

import { renderHero }         from "../patterns/hero.js"
import { renderText }         from "../patterns/text.js"
import { renderCards }        from "../patterns/cards.js"
import { renderFaq }          from "../patterns/faq.js"
import { renderCta }          from "../patterns/cta.js"
import { renderTrust }        from "../patterns/trust.js"
import { renderProcess }      from "../patterns/process.js"
import { renderTestimonials } from "../patterns/testimonials.js"
import { renderFooter }       from "../patterns/footer.js"

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
    return `<!-- section ${esc(section.id)} (${esc(section.type)}): kein Renderer -->`
  }

  return fn(section, layout, config)
}
