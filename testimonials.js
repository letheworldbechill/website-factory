/**
 * patterns/testimonials.js
 */

import { esc } from "./escape.js"

function stars(rating) {
  const n = Math.min(Math.max(Number(rating) || 5, 1), 5)
  return "★".repeat(n) + "☆".repeat(5 - n)
}

export function renderTestimonials(section, layout) {
  const d     = section.data  || {}
  const items = section.items || []
  const bg    = esc(section.settings?.background || "alt")
  const pt    = esc(section.settings?.paddingTop    || "lg")
  const pb    = esc(section.settings?.paddingBottom || "lg")

  // BUG-5 Fix: mindestens 1 Spalte, auch bei 0 items
  const cols  = items.length === 0 ? 3 : Math.min(items.length, 3)

  return `<section class="section section--testimonials bg--${bg} section--pt-${pt} section--pb-${pb}" id="${esc(section.id)}">
  <div class="container">
    ${d.label ? `<p class="eyebrow">${esc(d.label)}</p>`              : ""}
    ${d.title ? `<h2 class="section__title">${esc(d.title)}</h2>`     : ""}
    ${items.length > 0 ? `<div class="card-grid card-grid--${cols}">
      ${items.map(item => `
      <figure class="testimonial">
        ${item.rating ? `<p class="testimonial__stars" aria-label="${esc(item.rating)} von 5 Sternen">${stars(item.rating)}</p>` : ""}
        <blockquote class="testimonial__body">${esc(item.body)}</blockquote>
        <figcaption class="testimonial__author">
          <strong>${esc(item.name)}</strong>
          ${(item.role || item.company) ? `<span>${esc([item.role, item.company].filter(Boolean).join(", "))}</span>` : ""}
        </figcaption>
      </figure>`).join("")}
    </div>` : ""}
  </div>
</section>`
}
