/**
 * patterns/trust.js — KPI-Zahlen / Kennzahlen-Leiste
 */

import { esc } from "./escape.js"

export function renderTrust(section, layout) {
  const d     = section.data  || {}
  const items = section.items || []
  const bg    = esc(section.settings?.background || "alt")
  const align = esc(section.settings?.textAlign  || "center")
  const pt    = esc(section.settings?.paddingTop    || "md")
  const pb    = esc(section.settings?.paddingBottom || "md")

  return `<section class="section section--trust bg--${bg} section--pt-${pt} section--pb-${pb}" id="${esc(section.id)}">
  <div class="container">
    ${d.title ? `<p class="section__label text--${align}">${esc(d.title)}</p>` : ""}
    ${items.length > 0 ? `<div class="trust-grid">
      ${items.map(item => `
      <div class="trust-item">
        <span class="trust-item__stat">${esc(item.stat)}</span>
        <span class="trust-item__label">${esc(item.statLabel || item.label)}</span>
      </div>`).join("")}
    </div>` : ""}
  </div>
</section>`
}
