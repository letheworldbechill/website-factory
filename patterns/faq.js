/**
 * patterns/faq.js
 */

import { esc } from "../engine/escape.js"

export function renderFaq(section, layout) {
  const d     = section.data  || {}
  const items = section.items || []
  const bg    = esc(section.settings?.background || "default")
  const pt    = esc(section.settings?.paddingTop    || "lg")
  const pb    = esc(section.settings?.paddingBottom || "lg")

  // BUG-10 Fix: 'i' entfernt — nicht verwendet
  return `<section class="section section--faq bg--${bg} section--pt-${pt} section--pb-${pb}" id="${esc(section.id)}">
  <div class="container container--sm">
    ${d.label ? `<p class="eyebrow">${esc(d.label)}</p>`          : ""}
    ${d.title ? `<h2 class="section__title">${esc(d.title)}</h2>` : ""}
    ${items.length > 0 ? `<dl class="faq">
      ${items.map(item => `
      <div class="faq__item">
        <dt class="faq__question">${esc(item.question || item.title)}</dt>
        <dd class="faq__answer">${esc(item.answer   || item.body)}</dd>
      </div>`).join("")}
    </dl>` : ""}
  </div>
</section>`
}
