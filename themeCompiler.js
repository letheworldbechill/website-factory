/**
 * design/themeCompiler.js
 *
 * Erzeugt aus einem Theme-Objekt (nach parse()) einen vollständigen CSS-Block.
 * Unterstützt beide Systeme: fresh tokens (swiss/editorial/glass/signature)
 * und clear4-* Presets.
 */

// ── Preset Token-Tabellen ─────────────────────────────────────────────────────

const PRESETS = {
  swiss: {
    primary:     "#1a365d",
    accent:      "#38a169",
    bg:          "#ffffff",
    bgAlt:       "#f7f8fa",
    surface:     "#ffffff",
    text:        "#0a0a0a",
    textLight:   "#3f3f46",
    textMuted:   "#71717a",
    border:      "#e4e4e7",
    fontDisplay: "Instrument Sans, system-ui, sans-serif",
    fontBody:    "Instrument Sans, system-ui, sans-serif",
  },
  editorial: {
    primary:     "#111827",
    accent:      "#b45309",
    bg:          "#fafaf9",
    bgAlt:       "#f0ede8",
    surface:     "#ffffff",
    text:        "#111827",
    textLight:   "#374151",
    textMuted:   "#9ca3af",
    border:      "#d1d5db",
    fontDisplay: "Playfair Display, Georgia, serif",
    fontBody:    "Inter, system-ui, sans-serif",
  },
  glass: {
    primary:     "#6366f1",
    accent:      "#8b5cf6",
    bg:          "#0f0f23",
    bgAlt:       "#1a1a3e",
    surface:     "rgba(255,255,255,0.06)",
    text:        "#f8fafc",
    textLight:   "#cbd5e1",
    textMuted:   "#64748b",
    border:      "rgba(255,255,255,0.12)",
    fontDisplay: "Inter, system-ui, sans-serif",
    fontBody:    "Inter, system-ui, sans-serif",
  },
  signature: {
    primary:     "#0f766e",
    accent:      "#c9a227",
    bg:          "#f5f5f4",
    bgAlt:       "#ececea",
    surface:     "#ffffff",
    text:        "#1f2937",
    textLight:   "#4b5563",
    textMuted:   "#9ca3af",
    border:      "#e0e0de",
    fontDisplay: "Inter, system-ui, sans-serif",
    fontBody:    "Inter, system-ui, sans-serif",
  },
  "clear4-default": {
    primary:     "#0f766e",
    accent:      "#c9a227",
    bg:          "#f5f5f4",
    bgAlt:       "#ececea",
    surface:     "#ffffff",
    text:        "#1f2937",
    textLight:   "#4b5563",
    textMuted:   "#9ca3af",
    border:      "#e0e0de",
    fontDisplay: "Inter, system-ui, sans-serif",
    fontBody:    "Inter, system-ui, sans-serif",
  },
  "clear4-handwerk": {
    primary:     "#b47836",
    accent:      "#e0b37b",
    bg:          "#f5eee3",
    bgAlt:       "#ede4d4",
    surface:     "#ffffff",
    text:        "#2c2419",
    textLight:   "rgba(44,36,25,0.85)",
    textMuted:   "rgba(44,36,25,0.66)",
    border:      "rgba(56,44,30,0.18)",
    fontDisplay: "Inter, system-ui, sans-serif",
    fontBody:    "Inter, system-ui, sans-serif",
  },
  "clear4-landwirtschaft": {
    primary:     "#799b3b",
    accent:      "#c59d4e",
    bg:          "#f4f3ea",
    bgAlt:       "#eae9dc",
    surface:     "#ffffff",
    text:        "#253421",
    textLight:   "rgba(37,52,33,0.88)",
    textMuted:   "rgba(37,52,33,0.55)",
    border:      "rgba(51,63,39,0.18)",
    fontDisplay: "Inter, system-ui, sans-serif",
    fontBody:    "Inter, system-ui, sans-serif",
  },
  "clear4-premium": {
    primary:     "#0f766e",
    accent:      "#c9a227",
    bg:          "#fbfbfc",
    bgAlt:       "#f0f0f2",
    surface:     "#ffffff",
    text:        "#0b1220",
    textLight:   "rgba(11,18,32,0.78)",
    textMuted:   "rgba(11,18,32,0.50)",
    border:      "rgba(2,6,23,0.10)",
    fontDisplay: "Inter, system-ui, sans-serif",
    fontBody:    "Inter, system-ui, sans-serif",
  },
  "clear4-dark": {
    primary:     "#5eead4",
    accent:      "#fbbf24",
    bg:          "#0f0f0f",
    bgAlt:       "#1a1a1a",
    surface:     "#1f1f1f",
    text:        "#f5f5f5",
    textLight:   "rgba(245,245,245,0.80)",
    textMuted:   "rgba(245,245,245,0.55)",
    border:      "rgba(255,255,255,0.10)",
    fontDisplay: "Inter, system-ui, sans-serif",
    fontBody:    "Inter, system-ui, sans-serif",
  },
}

// ── Density → Spacing Multiplikator ──────────────────────────────────────────

const DENSITY_SCALE = { compact: 0.8, balanced: 1.0, airy: 1.2 }

// ── Radius-Map ────────────────────────────────────────────────────────────────

const RADIUS_MAP = {
  none:    { sm: "0",    md: "0",    lg: "0",    pill: "0"     },
  subtle:  { sm: "2px",  md: "4px",  lg: "6px",  pill: "999px" },
  default: { sm: "4px",  md: "8px",  lg: "12px", pill: "999px" },
  round:   { sm: "8px",  md: "16px", lg: "24px", pill: "999px" },
  pill:    { sm: "999px",md: "999px",lg: "999px", pill: "999px" },
}

// ── Compiler ──────────────────────────────────────────────────────────────────

/**
 * Erzeugt einen vollständigen CSS-:root-Block aus dem Theme-Objekt.
 *
 * @param {object} theme - Theme nach parse()
 * @returns {string}     - CSS-String
 */
export function compileTheme(theme) {
  const base    = PRESETS[theme.preset] || PRESETS.swiss
  const density = DENSITY_SCALE[theme.density] || 1.0
  const scale   = (theme.spacingScale || 1.0) * density
  const radii   = RADIUS_MAP[theme.radius || "default"]

  // Brand-Overrides anwenden
  const colors = {
    primary:   theme.brand?.primary  || base.primary,
    accent:    theme.brand?.accent   || base.accent,
    bg:        theme.brand?.bg       || base.bg,
    bgAlt:     base.bgAlt,
    surface:   base.surface,
    text:      theme.brand?.text     || base.text,
    textLight: base.textLight,
    textMuted: base.textMuted,
    border:    base.border,
  }

  // Font-Overrides anwenden
  const fonts = {
    display: theme.font?.display ? `${theme.font.display}, system-ui, sans-serif` : base.fontDisplay,
    body:    theme.font?.body    ? `${theme.font.body}, system-ui, sans-serif`    : base.fontBody,
    mono:    theme.font?.mono    || "ui-monospace, SFMono-Regular, Menlo, monospace",
  }

  // Spacing-Skala (4px-Grid × scale)
  const sp = (n) => `${Math.round(n * scale)}px`

  return `:root {
  /* Colors */
  --c-primary:    ${colors.primary};
  --c-accent:     ${colors.accent};
  --c-bg:         ${colors.bg};
  --c-bg-alt:     ${colors.bgAlt};
  --c-surface:    ${colors.surface};
  --c-text:       ${colors.text};
  --c-text-light: ${colors.textLight};
  --c-text-muted: ${colors.textMuted};
  --c-border:     ${colors.border};

  /* Typography */
  --font-display: ${fonts.display};
  --font-body:    ${fonts.body};
  --font-mono:    ${fonts.mono};

  --fs-xs:   11px;
  --fs-sm:   13px;
  --fs-base: 15px;
  --fs-lg:   17px;
  --fs-xl:   20px;
  --fs-2xl:  24px;
  --fs-3xl:  32px;
  --fs-4xl:  40px;

  --lh-tight:   1.2;
  --lh-normal:  1.5;
  --lh-relaxed: 1.7;

  --tracking-tight:  -0.02em;
  --tracking-normal:  0;
  --tracking-wide:    0.08em;

  /* Spacing (4px-Grid × ${scale.toFixed(2)}) */
  --sp-1:  ${sp(4)};
  --sp-2:  ${sp(8)};
  --sp-3:  ${sp(12)};
  --sp-4:  ${sp(16)};
  --sp-5:  ${sp(20)};
  --sp-6:  ${sp(24)};
  --sp-8:  ${sp(32)};
  --sp-10: ${sp(40)};
  --sp-12: ${sp(48)};
  --sp-16: ${sp(64)};

  /* Section Padding */
  --pt-none: 0;
  --pt-sm:   ${sp(24)};
  --pt-md:   ${sp(40)};
  --pt-lg:   ${sp(64)};
  --pt-xl:   ${sp(96)};

  /* Radius */
  --r-sm:   ${radii.sm};
  --r-md:   ${radii.md};
  --r-lg:   ${radii.lg};
  --r-pill: ${radii.pill};

  /* Shadows */
  --sh-soft:    0 4px 12px rgba(0,0,0,0.06);
  --sh-medium:  0 8px 24px rgba(0,0,0,0.10);
  --sh-deep:    0 18px 45px rgba(0,0,0,0.16);

  /* Transitions */
  --ease-out:       cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast:  150ms;
  --duration-norm:  220ms;

  /* Layout */
  --page-max:  1120px;
  --container: min(var(--page-max), 100% - var(--sp-8) * 2);
}

/* Background utilities */
.bg--default     { background: var(--c-bg); }
.bg--alt         { background: var(--c-bg-alt); }
.bg--brand       { background: var(--c-primary); color: #fff; }
.bg--dark        { background: #111; color: #f5f5f5; }
.bg--transparent { background: transparent; }

/* Section padding utilities */
.section--pt-none { padding-top: var(--pt-none); }
.section--pt-sm   { padding-top: var(--pt-sm);   }
.section--pt-md   { padding-top: var(--pt-md);   }
.section--pt-lg   { padding-top: var(--pt-lg);   }
.section--pt-xl   { padding-top: var(--pt-xl);   }

.section--pb-none { padding-bottom: var(--pt-none); }
.section--pb-sm   { padding-bottom: var(--pt-sm);   }
.section--pb-md   { padding-bottom: var(--pt-md);   }
.section--pb-lg   { padding-bottom: var(--pt-lg);   }
.section--pb-xl   { padding-bottom: var(--pt-xl);   }

/* Text alignment */
.text--left   { text-align: left;   }
.text--center { text-align: center; }
.text--right  { text-align: right;  }

/* Layout */
.container    { width: var(--container); margin-inline: auto; }
.container--sm { max-width: 720px; margin-inline: auto; }

.layout-stack  { display: flex; flex-direction: column; gap: var(--sp-6); }
.layout-split  { display: grid; gap: var(--sp-8); }
.layout-triple { display: grid; gap: var(--sp-6); }
.layout-grid   { display: grid; gap: var(--sp-6); }

@media (min-width: 768px) {
  .layout-split  { grid-template-columns: 8fr 5fr; }
  .layout-triple { grid-template-columns: repeat(3, 1fr); }
  .layout-grid   { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
}

/* Card Grid */
.card-grid   { display: grid; gap: var(--sp-6); }
.card-grid--2 { grid-template-columns: 1fr; }
.card-grid--3 { grid-template-columns: 1fr; }

@media (min-width: 640px)  { .card-grid--2 { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px)  { .card-grid--3 { grid-template-columns: repeat(3, 1fr); } }

/* Trust Grid */
.trust-grid { display: flex; flex-wrap: wrap; gap: var(--sp-6); justify-content: center; }
.trust-item { text-align: center; }
.trust-item__stat  { display: block; font-size: var(--fs-3xl); font-weight: 700; color: var(--c-primary); letter-spacing: var(--tracking-tight); }
.trust-item__label { display: block; font-size: var(--fs-sm); color: var(--c-text-muted); margin-top: var(--sp-1); }

/* Buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: var(--sp-2); padding: var(--sp-3) var(--sp-5); border-radius: var(--r-pill); font-family: var(--font-body); font-size: var(--fs-base); font-weight: 500; border: none; cursor: pointer; text-decoration: none; transition: all var(--duration-fast) var(--ease-out); }
.btn--primary   { background: var(--c-primary); color: #fff; box-shadow: var(--sh-soft); }
.btn--primary:hover   { transform: translateY(-1px); box-shadow: var(--sh-medium); }
.btn--secondary { background: transparent; color: var(--c-text); border: 1px solid var(--c-border); }
.btn--secondary:hover { background: rgba(0,0,0,.04); }
.btn--inverted  { background: rgba(255,255,255,.15); color: #fff; border: 1px solid rgba(255,255,255,.3); }
.btn--inverted:hover  { background: rgba(255,255,255,.25); }
.btn-group { display: flex; flex-wrap: wrap; gap: var(--sp-3); }
.btn-group--center { justify-content: center; }

/* Eyebrow */
.eyebrow { font-size: var(--fs-xs); font-weight: 600; letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--c-primary); margin-bottom: var(--sp-2); }
.eyebrow--light { color: rgba(255,255,255,.75); }

/* Section titles */
.section__title    { font-family: var(--font-display); font-size: var(--fs-3xl); font-weight: 700; letter-spacing: var(--tracking-tight); margin-bottom: var(--sp-3); }
.section__subtitle { font-size: var(--fs-lg); color: var(--c-text-light); line-height: var(--lh-relaxed); margin-bottom: var(--sp-6); max-width: 640px; }
.section__label    { font-size: var(--fs-sm); color: var(--c-text-muted); margin-bottom: var(--sp-3); }

/* Hero */
.hero__title    { font-family: var(--font-display); font-size: clamp(var(--fs-3xl), 5vw, var(--fs-4xl)); font-weight: 700; letter-spacing: var(--tracking-tight); line-height: var(--lh-tight); margin-bottom: var(--sp-4); }
.hero__subtitle { font-size: var(--fs-lg); color: var(--c-text-light); line-height: var(--lh-relaxed); margin-bottom: var(--sp-6); max-width: 560px; }

/* Card */
.card { background: var(--c-surface); border-radius: var(--r-lg); border: 1px solid var(--c-border); padding: var(--sp-5); box-shadow: var(--sh-soft); transition: all var(--duration-fast) var(--ease-out); }
.card:hover { transform: translateY(-2px); box-shadow: var(--sh-medium); }
.card__icon  { font-size: 2em; margin-bottom: var(--sp-3); }
.card__title { font-size: var(--fs-lg); font-weight: 600; margin-bottom: var(--sp-2); }
.card__body  { font-size: var(--fs-base); color: var(--c-text-light); line-height: var(--lh-relaxed); }
.card__link  { display: inline-block; margin-top: var(--sp-3); font-size: var(--fs-sm); font-weight: 500; color: var(--c-primary); }

/* Testimonial */
.testimonial { background: var(--c-surface); border-radius: var(--r-lg); border: 1px solid var(--c-border); padding: var(--sp-5); }
.testimonial__stars  { color: var(--c-accent); font-size: var(--fs-base); margin-bottom: var(--sp-3); }
.testimonial__body   { font-size: var(--fs-base); color: var(--c-text-light); line-height: var(--lh-relaxed); margin-bottom: var(--sp-4); font-style: italic; }
.testimonial__author strong { display: block; font-weight: 600; }
.testimonial__author span   { font-size: var(--fs-sm); color: var(--c-text-muted); }

/* FAQ */
.faq { display: grid; gap: var(--sp-4); }
.faq__item { border-bottom: 1px solid var(--c-border); padding-bottom: var(--sp-4); }
.faq__question { font-weight: 600; font-size: var(--fs-lg); margin-bottom: var(--sp-2); }
.faq__answer   { color: var(--c-text-light); line-height: var(--lh-relaxed); }

/* Process */
.process-steps { display: grid; gap: var(--sp-6); list-style: none; padding: 0; margin: 0; }
.process-step  { display: grid; grid-template-columns: 2.5rem 1fr; gap: var(--sp-4); align-items: start; }
.process-step__number { width: 2.5rem; height: 2.5rem; border-radius: 50%; background: var(--c-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: var(--fs-sm); flex-shrink: 0; }
.process-step__title  { font-weight: 600; font-size: var(--fs-lg); margin-bottom: var(--sp-1); }
.process-step__body   { color: var(--c-text-light); line-height: var(--lh-relaxed); }

/* Footer */
.footer__inner   { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--sp-6); margin-bottom: var(--sp-6); }
.footer__name    { font-weight: 700; font-size: var(--fs-lg); margin-bottom: var(--sp-2); }
.footer__address,.footer__phone,.footer__email { font-size: var(--fs-sm); opacity: .75; }
.footer__email a,.footer__phone a { color: inherit; text-decoration: none; }
.footer__legal   { display: flex; flex-wrap: wrap; gap: var(--sp-4); align-items: flex-start; }
.footer__legal a { font-size: var(--fs-sm); opacity: .75; text-decoration: none; }
.footer__legal a:hover { opacity: 1; }
.footer__copy    { font-size: var(--fs-xs); opacity: .5; border-top: 1px solid rgba(255,255,255,.1); padding-top: var(--sp-4); }

/* Prose */
.prose { line-height: var(--lh-relaxed); color: var(--c-text-light); max-width: 720px; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`
}
