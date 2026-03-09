/**
 * patterns/process.js — Nummerierte Schritte
 */

import { esc } from "./escape.js"

export function renderProcess(section, layout) {
  const d     = section.data  || {}
  const items = section.items || []
  const bg    = esc(section.settings?.background || "default")
  const pt    = esc(section.settings?.paddingTop    || "lg")
  const pb    = esc(section.settings?.paddingBottom || "lg")

  return `<section class="section section--process bg--${bg} section--pt-${pt} section--pb-${pb}" id="${esc(section.id)}">
  <div class="container">
    ${d.label ? `<p class="eyebrow">${esc(d.label)}</p>`          : ""}
    ${d.title ? `<h2 class="section__title">${esc(d.title)}</h2>` : ""}
    ${items.length > 0 ? `<ol class="process-steps">
      ${items.map((item, idx) => `
      <li class="process-step">
        <span class="process-step__number">${esc(item.step ?? idx + 1)}</span>
        <div class="process-step__content">
          ${item.title ? `<h3 class="process-step__title">${esc(item.title)}</h3>` : ""}
          ${item.body  ? `<p class="process-step__body">${esc(item.body)}</p>`     : ""}
        </div>
      </li>`).join("")}
    </ol>` : ""}
  </div>
</section>`
}
