/**
 * patterns/hero.js
 */

import { esc, escUrl } from "./escape.js"

export function renderHero(section, layout) {
  const d       = section.data || {}
  const hasCols = layout.areaNames.length > 1
  const bg      = esc(section.settings?.background   || "default")
  const ptClass = `section--pt-${esc(section.settings?.paddingTop  || "xl")}`
  const pbClass = `section--pb-${esc(section.settings?.paddingBottom || "xl")}`

  return `<section class="section section--hero bg--${bg} ${ptClass} ${pbClass}" id="${esc(section.id)}">
  <div class="container">
    <div class="${hasCols ? "layout-split" : "layout-stack"}"${hasCols ? ` style="${esc(layout.style)}"` : ""}>
      <div class="hero__content">
        ${d.label    ? `<p class="eyebrow">${esc(d.label)}</p>` : ""}
        <h1 class="hero__title">${esc(d.title)}</h1>
        ${d.subtitle ? `<p class="hero__subtitle">${esc(d.subtitle)}</p>` : ""}
        ${(d.ctaPrimary || d.ctaSecondary) ? `
        <div class="btn-group">
          ${d.ctaPrimary   ? `<a href="${escUrl(d.ctaPrimaryUrl)}"   class="btn btn--primary">${esc(d.ctaPrimary)}</a>`   : ""}
          ${d.ctaSecondary ? `<a href="${escUrl(d.ctaSecondaryUrl)}" class="btn btn--secondary">${esc(d.ctaSecondary)}</a>` : ""}
        </div>` : ""}
      </div>
      ${hasCols && d.image ? `<div class="hero__image"><img src="${escUrl(d.image)}" alt="${esc(d.imageAlt || d.title)}" loading="eager"></div>` : ""}
    </div>
  </div>
</section>`
}
