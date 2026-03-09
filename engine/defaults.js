/**
 * engine/defaults.js
 *
 * Default-Werte für alle Section-Typen.
 * Parser und Section Composer benutzen diese als Fallback.
 */

// ── Default Areas (Fibonacci-Gewichte) ───────────────────────────────────────

export const DEFAULT_AREAS = {
  header:       { content: 1 },
  hero:         { content: 8, image: 5 },
  trust:        { content: 1 },
  authority:    { content: 1 },
  services:     { grid: 3 },
  benefits:     { list: 3 },
  process:      { grid: 2 },
  team:         { grid: 3 },
  gallery:      { grid: 5 },
  testimonials: { grid: 3 },
  faq:          { content: 1 },
  cta:          { content: 1 },
  footer:       { content: 1 },
  contact:      { content: 1 },
  pricing:      { grid: 3 },
  custom:       { content: 1 },
}

// ── Default Data (leere Platzhalter) ─────────────────────────────────────────

export const DEFAULT_DATA = {
  header:       { title: "" },
  hero:         { title: "", subtitle: "", ctaPrimary: "", ctaPrimaryUrl: "#kontakt" },
  trust:        { title: "" },
  authority:    { title: "", body: "" },
  services:     { label: "Leistungen", title: "", subtitle: "" },
  benefits:     { label: "Vorteile",   title: "", subtitle: "" },
  process:      { label: "Ablauf",     title: "" },
  team:         { label: "Team",       title: "" },
  gallery:      { label: "Galerie",    title: "" },
  testimonials: { label: "Stimmen",   title: "" },
  faq:          { label: "FAQ",        title: "" },
  cta:          { title: "", subtitle: "", ctaPrimary: "", ctaPrimaryUrl: "#kontakt" },
  footer:       { title: "" },
  contact:      { label: "Kontakt",    title: "" },
  pricing:      { label: "Preise",     title: "" },
  custom:       {},
}

// ── Default Settings ──────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS = {
  header:       { background: "default", paddingTop: "none",  paddingBottom: "none" },
  hero:         { background: "default", paddingTop: "xl",    paddingBottom: "xl"   },
  trust:        { background: "alt",     paddingTop: "md",    paddingBottom: "md",   textAlign: "center" },
  authority:    { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  services:     { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  benefits:     { background: "alt",     paddingTop: "lg",    paddingBottom: "lg"   },
  process:      { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  team:         { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  gallery:      { background: "alt",     paddingTop: "lg",    paddingBottom: "lg"   },
  testimonials: { background: "alt",     paddingTop: "lg",    paddingBottom: "lg"   },
  faq:          { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  cta:          { background: "brand",   paddingTop: "xl",    paddingBottom: "xl",   textAlign: "center" },
  footer:       { background: "dark",    paddingTop: "lg",    paddingBottom: "lg"   },
  contact:      { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  pricing:      { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  custom:       { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
}
