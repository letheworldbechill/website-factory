/**
 * patterns/text.js
 */

import { esc } from "../engine/escape.js"

export function renderText(section, layout) {
  const d  = section.data || {}
  const bg = esc(section.settings?.background || "default")
  const pt = esc(section.settings?.paddingTop    || "lg")
  const pb = esc(section.settings?.paddingBottom || "lg")

  return `<section class="section section--text bg--${bg} section--pt-${pt} section--pb-${pb}" id="${esc(section.id)}">
  <div class="container">
    ${d.label    ? `<p class="eyebrow">${esc(d.label)}</p>`                     : ""}
    ${d.title    ? `<h2 class="section__title">${esc(d.title)}</h2>`            : ""}
    ${d.subtitle ? `<p class="section__subtitle">${esc(d.subtitle)}</p>`        : ""}
    ${d.body     ? `<div class="prose">${esc(d.body)}</div>`                    : ""}
  </div>
</section>`
}
