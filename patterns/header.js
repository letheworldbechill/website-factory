/**
 * patterns/header.js
 *
 * Fixed header with glass effect, auto-generated nav, hamburger mobile menu.
 */

import { esc, escUrl } from "../engine/escape.js"

// Section types that belong in auto-generated navigation
const NAV_TYPES = [
  "services", "benefits", "process", "team",
  "gallery", "testimonials", "pricing", "faq", "contact",
]

// German fallback labels for section types
const SECTION_LABELS = {
  services:     "Leistungen",
  benefits:     "Vorteile",
  process:      "Ablauf",
  team:         "Team",
  gallery:      "Galerie",
  testimonials: "Kundenstimmen",
  pricing:      "Preise",
  faq:          "FAQ",
  contact:      "Kontakt",
}

/**
 * Resolves navigation items — explicit or auto-generated from sibling sections.
 */
function resolveNavItems(section, config) {
  const explicit = section.data?.navItems
  if (Array.isArray(explicit) && explicit.length > 0) {
    return explicit.map(item => {
      if (typeof item === "string") {
        const id = item.toLowerCase().replace(/\s+/g, "-")
        return { label: item, href: `#${id}` }
      }
      return { label: item.label || item, href: item.href || `#${(item.label || "").toLowerCase().replace(/\s+/g, "-")}` }
    })
  }

  // Auto-generate from page sections
  const sections = config._pageSections || []
  return sections
    .filter(s => NAV_TYPES.includes(s.type) && s.enabled !== false)
    .map(s => ({
      label: s.data?.label || s.data?.title || SECTION_LABELS[s.type] || s.type,
      href: `#${s.id}`,
    }))
}

/**
 * Derives logo initials from a brand name.
 * "Müller Treuhand AG" → "MT"
 */
function deriveInitials(name) {
  if (!name) return "?"
  const words = name.trim().split(/\s+/).filter(w => !/^(AG|GmbH|SA|Ltd|Inc|Co|KG)$/i.test(w))
  return words.slice(0, 2).map(w => w[0].toUpperCase()).join("")
}

export function renderHeader(section, layout, config) {
  const d         = section.data || {}
  const brandName = config.site?.name || d.title || "Unternehmen"
  const navItems  = resolveNavItems(section, config)
  const preset    = config.theme?.preset || ""
  const isDark    = preset === "glass" || preset === "clear4-dark"

  // Logo
  let logoHtml
  if (d.logoImage) {
    logoHtml = `<img src="${escUrl(d.logoImage)}" alt="${esc(brandName)}" class="site-header__logo-img">`
  } else {
    const initials = d.logoText || deriveInitials(brandName)
    logoHtml = `<span class="site-header__logo-initials">${esc(initials)}</span>`
  }

  // Nav links
  const navLinksHtml = navItems.map(item =>
    `<a href="${escUrl(item.href)}" class="site-header__nav-link">${esc(item.label)}</a>`
  ).join("\n        ")

  // CTA button
  const ctaHtml = d.ctaText
    ? `<a href="${escUrl(d.ctaUrl || "#kontakt")}" class="btn btn--primary btn--sm">${esc(d.ctaText)}</a>`
    : ""

  // Mobile nav links
  const mobileLinksHtml = navItems.map(item =>
    `<a href="${escUrl(item.href)}" class="site-header__mobile-link">${esc(item.label)}</a>`
  ).join("\n        ")

  const mobileCtaHtml = d.ctaText
    ? `<a href="${escUrl(d.ctaUrl || "#kontakt")}" class="btn btn--primary" style="margin-top:auto">${esc(d.ctaText)}</a>`
    : ""

  return `<header class="site-header${isDark ? " site-header--dark" : ""}" id="${esc(section.id)}">
  <div class="site-header__inner container">
    <a href="#" class="site-header__brand">
      <span class="site-header__logo">${logoHtml}</span>
      <span class="site-header__name">${esc(brandName)}</span>
    </a>
    <nav class="site-header__nav" aria-label="Hauptnavigation">
      ${navLinksHtml}
    </nav>
    <div class="site-header__actions">
      ${ctaHtml}
      <button class="site-header__toggle" aria-label="Menü öffnen" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="site-header__mobile-nav" aria-hidden="true">
    <nav class="site-header__mobile-nav-inner">
      ${mobileLinksHtml}
      ${mobileCtaHtml}
    </nav>
  </div>
</header>`
}

/**
 * Returns a <script> block for header interactivity:
 * scroll hide/show, hamburger toggle, smooth scroll offset, focus management.
 */
export function compileHeaderScript() {
  return `<script>
(function(){
  var hdr = document.querySelector('.site-header');
  if (!hdr) return;
  var toggle = hdr.querySelector('.site-header__toggle');
  var mobileNav = hdr.querySelector('.site-header__mobile-nav');
  var lastY = 0;
  var ticking = false;

  /* Scroll: hide on down, show on up, shadow after 10px */
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var y = window.scrollY;
      if (y > lastY && y > 80) hdr.classList.add('site-header--hidden');
      else hdr.classList.remove('site-header--hidden');
      hdr.classList.toggle('site-header--scrolled', y > 10);
      lastY = y;
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});

  /* Hamburger toggle */
  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    hdr.classList.add('site-header--open');
    document.body.style.overflow = 'hidden';
    var firstLink = mobileNav.querySelector('a');
    if (firstLink) firstLink.focus();
  }
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    hdr.classList.remove('site-header--open');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', function(){
    var open = toggle.getAttribute('aria-expanded') === 'true';
    open ? closeMenu() : openMenu();
  });

  /* Close on link click */
  mobileNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });

  /* Close on Escape */
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && hdr.classList.contains('site-header--open')) closeMenu();
  });

  /* Smooth scroll offset for fixed header */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = this.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      var offset = hdr.offsetHeight + 16;
      var top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({top: top, behavior: 'smooth'});
    });
  });
})();
</script>`
}
