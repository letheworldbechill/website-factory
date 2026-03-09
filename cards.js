/**
 * patterns/cards.js — 2–4 Items als Karten
 */

import { esc, escUrl } from "../engine/escape.js"

export function renderCards(section, layout) {
  const d     = section.data  || {}
  const items = section.items || []
  const bg    = esc(section.settings?.background || "default")
  const pt    = esc(section.settings?.paddingTop    || "lg")
  const pb    = esc(section.settings?.paddingBottom || "lg")

  // BUG-4 Fix: mindestens 1 Spalte, auch bei 0 items
  const cols  = items.length === 0 ? 3 : items.length === 2 ? 2 : Math.min(items.length, 3)

  return `<section class="section section--cards bg--${bg} section--pt-${pt} section--pb-${pb}" id="${esc(section.id)}">
  <div class="container">
    ${d.label    ? `<p class="eyebrow">${esc(d.label)}</p>`              : ""}
    ${d.title    ? `<h2 class="section__title">${esc(d.title)}</h2>`     : ""}
    ${d.subtitle ? `<p class="section__subtitle">${esc(d.subtitle)}</p>` : ""}
    ${items.length > 0 ? `<div class="card-grid card-grid--${cols}">
      ${items.map(item => `
      <div class="card">
        ${item.icon  ? `<div class="card__icon">${esc(item.icon)}</div>` : ""}
        ${item.image ? `<img class="card__image" src="${escUrl(item.image)}" alt="${esc(item.imageAlt || item.title)}">` : ""}
        ${item.title ? `<h3 class="card__title">${esc(item.title)}</h3>` : ""}
        ${item.body  ? `<p class="card__body">${esc(item.body)}</p>`     : ""}
        ${item.url   ? `<a href="${escUrl(item.url)}" class="card__link">${esc(item.label || "Mehr erfahren")}</a>` : ""}
      </div>`).join("")}
    </div>` : ""}
  </div>
</section>`
}
