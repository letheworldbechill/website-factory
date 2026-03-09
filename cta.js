/**
 * patterns/cta.js
 */

import { esc, escUrl } from "./escape.js"

export function renderCta(section, layout) {
  const d     = section.data || {}
  const bg    = esc(section.settings?.background || "brand")
  const align = esc(section.settings?.textAlign  || "center")
  const pt    = esc(section.settings?.paddingTop    || "xl")
  const pb    = esc(section.settings?.paddingBottom || "xl")

  return `<section class="section section--cta bg--${bg} section--pt-${pt} section--pb-${pb} text--${align}" id="${esc(section.id)}">
  <div class="container container--sm">
    ${d.label    ? `<p class="eyebrow eyebrow--light">${esc(d.label)}</p>`       : ""}
    ${d.title    ? `<h2 class="section__title">${esc(d.title)}</h2>`             : ""}
    ${d.subtitle ? `<p class="section__subtitle">${esc(d.subtitle)}</p>`         : ""}
    ${(d.ctaPrimary || d.ctaSecondary) ? `
    <div class="btn-group btn-group--center">
      ${d.ctaPrimary   ? `<a href="${escUrl(d.ctaPrimaryUrl)}"   class="btn btn--primary">${esc(d.ctaPrimary)}</a>`                         : ""}
      ${d.ctaSecondary ? `<a href="${escUrl(d.ctaSecondaryUrl)}" class="btn btn--secondary btn--inverted">${esc(d.ctaSecondary)}</a>` : ""}
    </div>` : ""}
  </div>
</section>`
}
