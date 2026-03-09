/**
 * patterns/footer.js
 */

import { esc, escUrl } from "./escape.js"

export function renderFooter(section, layout, config) {
  const d     = section.data || {}
  const legal = config?.legal || {}
  const site  = config?.site  || {}
  const year  = new Date().getFullYear()
  const pt    = esc(section.settings?.paddingTop    || "lg")
  const pb    = esc(section.settings?.paddingBottom || "lg")

  const name    = d.title || site.name || ""
  const address = legal.companyAddress
    || [site.contact?.address, site.contact?.city].filter(Boolean).join(", ")

  return `<footer class="section section--footer bg--dark section--pt-${pt} section--pb-${pb}" id="${esc(section.id)}">
  <div class="container">
    <div class="footer__inner">
      <div class="footer__brand">
        <p class="footer__name">${esc(name)}</p>
        ${address          ? `<p class="footer__address">${esc(address)}</p>` : ""}
        ${site.contact?.phone ? `<p class="footer__phone"><a href="tel:${escUrl(site.contact.phone)}">${esc(site.contact.phone)}</a></p>` : ""}
        ${site.contact?.email ? `<p class="footer__email"><a href="mailto:${escUrl(site.contact.email)}">${esc(site.contact.email)}</a></p>` : ""}
      </div>
      <nav class="footer__legal" aria-label="Rechtliches">
        ${legal.imprintUrl ? `<a href="${escUrl(legal.imprintUrl)}">Impressum</a>`   : ""}
        ${legal.privacyUrl ? `<a href="${escUrl(legal.privacyUrl)}">Datenschutz</a>` : ""}
        ${legal.agbUrl     ? `<a href="${escUrl(legal.agbUrl)}">AGB</a>`             : ""}
      </nav>
    </div>
    <p class="footer__copy">© ${year} ${esc(name)}</p>
  </div>
</footer>`
}
