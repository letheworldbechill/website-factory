# Builder Features → Compiler Migration Overview

Comprehensive inventory of every feature in the monolithic editor (`index.html`) mapped against the current compiler engine, with implementation status and priority for migration.

---

## 1. Section Types

The builder supports 15+ renderable section types. The compiler engine recognizes 16 types in its graph but only has dedicated pattern renderers for 10.

| Section Type | Builder (index.html) | Compiler Pattern | Status | Notes |
|---|---|---|---|---|
| **Hero** | Split layout, gradient orbs, 2× CTA buttons, image | `patterns/hero.js` — split layout, label, title, subtitle, 2× CTA, image | **Partial** | Builder has animated orb background, glass effects; compiler renders static only |
| **Trust Bar** | Horizontal stat bar, primary background, 4 items | `patterns/trust.js` — flex layout, stat+label pairs | **Done** | Functionally equivalent |
| **Authority Strip** | Badge chips with icons | Aliased to `text` pattern | **Missing** | No dedicated renderer; needs own pattern |
| **Services** | 3-column card grid, icons, hover-lift | `patterns/cards.js` — 2–4 card grid, icon/image/title/body/link | **Partial** | Builder has hover animations; compiler is static |
| **Benefits** | Vertical list with circular icons | Aliased to `text` pattern | **Missing** | Needs dedicated list pattern or cards variant |
| **Process/Steps** | Numbered 2-column cards | `patterns/process.js` — numbered circles + content | **Done** | Equivalent |
| **Team** | Circular avatars 140px, name/role/bio | Aliased to `cards` pattern | **Partial** | Rendered as generic cards, no avatar styling |
| **Gallery** | Responsive grid, 4:3 aspect ratio | Aliased to `cards` pattern | **Partial** | No aspect-ratio enforcement, no lightbox |
| **Testimonials** | Star ratings, author avatar, card grid | `patterns/testimonials.js` — stars, author, role, card grid | **Done** | Equivalent |
| **FAQ** | `<details>/<summary>` accordion | `patterns/faq.js` — `<dl>/<dt>/<dd>` structure | **Different** | Builder uses details/summary (interactive); compiler uses dl/dt/dd (static) |
| **CTA** | Full-width primary bg, gradient orbs, 2× buttons | `patterns/cta.js` — brand bg, 2× buttons, centered | **Partial** | Missing orb effects |
| **Footer** | 4-column grid, social links, legal links, copyright | `patterns/footer.js` — company info + legal + copyright | **Partial** | Missing social links, 4-column grid layout |
| **Proof Table** | Comparison table with rows/columns | No renderer | **Missing** | Not in patterns/ at all |
| **Pricing** | Plan cards with features | Recognized in defaults, aliased to `cards` | **Partial** | No pricing-specific layout (feature lists, recommended badge) |
| **Contact** | Contact info section | Aliased to `text` | **Missing** | No form, no map, no structured contact layout |
| **Split Section** | Text left / content right, reversible | Aliased to `cards` | **Missing** | No true 2-column split with reverse option |
| **Sticky CTA** | Bottom-fixed call-to-action bar | Not supported | **Missing** | Requires position:fixed + JS scroll detection |
| **Cookie Banner** | Sticky bottom, preference modal, toggles | Not supported | **Missing** | Needs JS for consent logic |
| **Header/Nav** | Sticky header, logo, nav links, mobile hamburger, dark toggle | Not in patterns/ | **Missing** | Critical gap — builder generates full nav header |

---

## 2. Style Presets

| Preset | Builder | Compiler (`themeCompiler.js`) | Status |
|---|---|---|---|
| **Signature** (Clean Premium) | ✅ | ✅ `signature` | **Done** |
| **Swiss Minimal** | ✅ | ✅ `swiss` | **Done** |
| **Luxury Noir** | ✅ Dark editorial | ❌ Not in fresh presets | **Missing** |
| **Glass Aurora** | ✅ Glassmorphism, gradient orbs | ✅ `glass` | **Partial** — CSS vars present, but no orb/grain rendering |
| **Editorial Serif** | ✅ Serif headlines, consulting aesthetic | ✅ `editorial` | **Done** |
| **Commerce Blue** | ✅ Conversion-focused, sharp radii | ❌ Not present | **Missing** |
| **CLEAR-4 / Gasserwerk** | ✅ Premium neutrals, 4px grid | ✅ `clear4-default` + 5 variants | **Done** |

---

## 3. Color System

| Feature | Builder | Compiler | Status |
|---|---|---|---|
| 10 predefined palettes (Petrol&Amber, Navy&Gold, etc.) | ✅ | ❌ | **Missing** — compiler uses preset-level colors only |
| Custom primary + accent hex input | ✅ | ✅ Parser accepts `primaryColor`/`accentColor` | **Done** (data layer) |
| Color token generation (hover, active, bg, glow, muted) | ✅ 30+ tokens | ✅ ~12 tokens | **Partial** — compiler generates fewer derived tokens |
| Logo color extraction | ✅ | ✅ `auto-style-engine.js` `pickPrimaryAccent()` | **Done** — but not integrated into compiler pipeline |
| Color stacks (pre-made combos) | ✅ | ✅ `autoStyleEngine()` supports `colorStack` | **Done** (data layer) |
| Dark/light mode derived tokens | ✅ Full token swap | ✅ `glass` preset is dark-only | **Partial** — no dynamic toggle, no per-preset dark variant |
| Semantic colors (warning, danger, info, success) | ✅ | ❌ | **Missing** |

---

## 4. Typography

| Feature | Builder | Compiler | Status |
|---|---|---|---|
| Font stack selection (8 options) | ✅ System, Serif, Mono, Spark, Instrument, DM Sans, DM Serif, Inter | ✅ 3 slots (display, body, mono) per preset | **Partial** — presets map to fonts, but not all 8 builder stacks available |
| Google Fonts loading | ✅ Dynamic `<link>` injection | ❌ No font loading in output | **Missing** — critical for non-system fonts |
| Clamp-based responsive sizing | ✅ `clamp()` with `--sp-scale` | ✅ 8 font-size tokens with responsive values | **Partial** — different scaling approach |
| Font scale (xs through 5xl) | ✅ 8 sizes | ✅ 8 sizes | **Done** |

---

## 5. Visual Effects (FX)

| Feature | Builder | Compiler | Status |
|---|---|---|---|
| **Gradient Orbs** | ✅ Animated radial gradients, 3 intensities, 34s/44s animation | ❌ | **Missing** — needs CSS keyframes + HTML elements |
| **Grain Texture** | ✅ SVG fractal noise overlay, 3 intensities | ❌ | **Missing** — needs inline SVG filter |
| **Glassmorphism** | ✅ `backdrop-filter: blur(20px)`, translucent bg | Partially in `glass` preset CSS | **Partial** — vars exist but not applied to card classes |
| **Hover Lift** | ✅ `translateY(-2px)` + shadow on cards | ❌ | **Missing** — needs :hover CSS rules |
| **Scroll Animations** | ✅ Header hide/show on scroll | ❌ | **Missing** — needs JS |
| **Reduced Motion** | ✅ `prefers-reduced-motion` disables all | ❌ | **Missing** — needs media query in theme CSS |
| FX intensity control | ✅ subtle/medium/intense | ✅ in `auto-style-engine.js` (data only) | **Partial** — engine decides intensity but compiler doesn't render it |

---

## 6. Layout & Spacing

| Feature | Builder | Compiler | Status |
|---|---|---|---|
| Fibonacci spacing ladder (8px base) | ✅ 7 steps: 8/13/21/34/55/89/144px | ✅ 4px grid × density multiplier | **Different** — compiler uses 4px grid, builder uses 8px Fibonacci |
| Density modes (compact/balanced/airy) | ✅ `--sp-scale` multiplier | ✅ multiplier in `themeCompiler.js` | **Done** (different base) |
| Section padding (sm/md/lg/xl) | ✅ Mapped to `--sp-*` | ✅ `--pad-*` tokens | **Done** |
| 12-column grid | ✅ | ❌ | **Missing** — compiler uses simpler layout types |
| Hero grid (7fr 5fr) | ✅ | ✅ In `patterns/hero.js` inline styles | **Done** |
| Responsive breakpoints | ✅ 600/768/900/1024px | ✅ 640/768px | **Partial** — compiler has fewer breakpoints |
| Radius scale (xs→full) | ✅ 7 levels | ✅ 4 levels (sm/md/lg/pill) + 5 styles | **Done** |

---

## 7. Navigation & Header

| Feature | Builder | Compiler | Status |
|---|---|---|---|
| Sticky header with scroll detection | ✅ JS-driven show/hide | ❌ | **Missing** |
| Logo (text or image) in header | ✅ | ❌ No header pattern | **Missing** |
| Nav links to sections | ✅ Anchor links | ❌ | **Missing** |
| Mobile hamburger menu | ✅ Full-screen slide-in | ❌ | **Missing** |
| Dark mode toggle button | ✅ Sun/moon icon, animated | ❌ | **Missing** |
| CTA button in header | ✅ | ❌ | **Missing** |

**Priority: HIGH** — Every generated site needs a header/nav.

---

## 8. Footer (Detailed)

| Feature | Builder | Compiler (`patterns/footer.js`) | Status |
|---|---|---|---|
| Company name + tagline | ✅ | ✅ | **Done** |
| Address, phone, email | ✅ | ✅ via `config.site.contact` | **Done** |
| Legal links (Impressum, Datenschutz, AGB) | ✅ | ✅ via `config.legal` | **Done** |
| Copyright year | ✅ | ✅ Auto-generated | **Done** |
| 4-column grid layout | ✅ | ❌ Single-column | **Missing** |
| Social media links | ✅ | ❌ | **Missing** |
| Footer navigation columns | ✅ Multiple columns with headers + links | ❌ | **Missing** |

---

## 9. SEO & Meta

| Feature | Builder | Compiler (`compiler.js`) | Status |
|---|---|---|---|
| `<title>` tag | ✅ | ✅ With template support | **Done** |
| Meta description | ✅ | ✅ | **Done** |
| Canonical URL | ✅ | ✅ | **Done** |
| OG tags (title, description, image, locale) | ✅ | ✅ | **Done** |
| Robots meta | ✅ | ✅ | **Done** |
| Language attribute | ✅ `de` | ✅ `de-CH` default | **Done** |
| Theme color meta | ✅ `#6366f1` | ❌ | **Missing** |
| Apple mobile web app meta | ✅ | ❌ | **Missing** |
| Manifest link | ✅ | ❌ | **Missing** |
| Structured data (JSON-LD) | ✅ Framework ready | ❌ | **Missing** |
| Favicon links | ✅ | ❌ | **Missing** |

---

## 10. Accessibility

| Feature | Builder | Compiler | Status |
|---|---|---|---|
| Focus-visible outlines | ✅ 2px + glow | ❌ | **Missing** — needs CSS in theme |
| Skip link | ✅ | ❌ | **Missing** — needs `<a>` before main content |
| Touch targets 44px min | ✅ | ❌ | **Missing** — needs button/link sizing rules |
| `prefers-reduced-motion` | ✅ | ❌ | **Missing** — needs media query |
| `prefers-contrast: high` | ✅ | ❌ | **Missing** |
| ARIA attributes | ✅ Semantic | Partial — semantic HTML used | **Partial** |
| Keyboard navigation | ✅ Tab management | ❌ No JS for focus trapping | **Missing** |

---

## 11. PWA & Service Worker

| Feature | Builder | Compiler | Status |
|---|---|---|---|
| manifest.webmanifest | ✅ | ❌ | **Missing** |
| Service Worker registration | ✅ | ❌ | **Missing** |
| Apple mobile web app | ✅ | ❌ | **Missing** |
| Icon generation (192px, apple-touch) | ✅ | ❌ | **Missing** |
| Offline support | ✅ | ❌ | **Missing** |

**Priority: LOW** — PWA is optional for generated landing pages.

---

## 12. Export & Build

| Feature | Builder | Compiler | Status |
|---|---|---|---|
| Standalone HTML generation | ✅ | ✅ | **Done** |
| ZIP download (JSZip + FileSaver) | ✅ | ❌ | **N/A** — this is editor-side, not compiler |
| Inline CSS in output | ✅ | ✅ via `themeCompiler` | **Done** |
| Asset packaging | ✅ Icons, images | ❌ | **Missing** — compiler outputs HTML only |
| Manifest generation | ✅ | ❌ | **Missing** |

---

## 13. Industry Templates

Builder has 16+ templates; compiler has 10 industries.

| Industry | Builder | Compiler (`defaults.js`) | Auto-Style Engine | Status |
|---|---|---|---|---|
| Treuhand | ✅ (3 variants) | ✅ | ✅ | **Done** |
| Anwalt / Kanzlei | ✅ | ✅ (kanzlei) | ✅ | **Done** |
| IT / Digital | ✅ | ✅ | ✅ | **Done** |
| SaaS | ✅ | ✅ | ✅ | **Done** |
| Restaurant / Gastro | ✅ | ✅ | ✅ | **Done** |
| Handwerk | ✅ | ✅ | ❌ (not in auto-style) | **Partial** |
| Fitness | ✅ | ❌ | ✅ | **Partial** |
| Arzt / Medizin | ✅ | ✅ (medizin) | ❌ | **Partial** |
| Immobilien | ✅ | ✅ | ❌ | **Partial** |
| Coiffeur | ✅ | ❌ | ❌ | **Missing** |
| Architektur | ✅ | ❌ | ❌ | **Missing** |
| Finanzberatung | ✅ | ❌ | ✅ | **Partial** |
| Consulting | ✅ | ❌ | ❌ | **Missing** |
| Coaching | ❌ | ✅ | ❌ | **Compiler-only** |
| Bildung | ❌ | ✅ | ❌ | **Compiler-only** |

---

## 14. Auto-Style Engine Integration

The `auto-style-engine.js` is a standalone module NOT currently imported by the compiler pipeline.

| Capability | Auto-Style Engine | Compiler Integration | Status |
|---|---|---|---|
| Industry → preset mapping | ✅ 9 industries | ❌ Not called | **Not wired** |
| Industry → fontStack | ✅ | ❌ Not called | **Not wired** |
| Industry → density default | ✅ | ❌ Not called | **Not wired** |
| Industry → FX policy (orbs/glass/grain) | ✅ | ❌ Not called | **Not wired** |
| Logo color → primary/accent | ✅ `pickPrimaryAccent()` | ❌ Not called | **Not wired** |
| Content stats → density decision | ✅ `decideDensity()` | ❌ Not called | **Not wired** |
| Aggressiveness modes (conservative/balanced/bold) | ✅ | ❌ Not called | **Not wired** |
| User lock overrides | ✅ | ❌ Not called | **Not wired** |

**Priority: HIGH** — This is a key intelligence layer that should feed into the compiler.

---

## 15. JavaScript Runtime Features (in Builder output)

These features require JS in the generated HTML output:

| Feature | Complexity | Priority |
|---|---|---|
| Mobile hamburger toggle | Low — event listener + class toggle | **High** |
| Header scroll show/hide | Medium — scroll listener + throttle | **Medium** |
| Dark mode toggle | Medium — class toggle + localStorage | **Medium** |
| FAQ accordion (details/summary) | Zero JS — native HTML | **High** (just change pattern) |
| Cookie banner consent | High — modal, storage, toggles | **Low** |
| Smooth scroll to sections | Low — `scroll-behavior: smooth` CSS | **High** |

---

## Summary: Top Priority Gaps

### Tier 1 — Required for usable output
1. **Header/Navigation pattern** — every site needs a nav bar
2. **Wire auto-style-engine into compiler** — industry intelligence is ready but unused
3. **Google Fonts loading** — non-system fonts won't render without it
4. **FAQ as `<details>/<summary>`** — free interactivity, no JS needed
5. **Footer social links + multi-column** — current footer is too minimal

### Tier 2 — Required for visual parity with builder
6. **Gradient orbs + grain texture** — signature visual effects
7. **Glassmorphism card styling** — for glass preset
8. **Hover effects on cards** — lift + shadow transitions
9. **Skip link + focus-visible + reduced-motion** — accessibility basics
10. **Mobile hamburger JS** — responsive nav

### Tier 3 — Nice to have
11. Smooth scroll CSS
12. Theme color meta tag
13. Missing industry templates (Coiffeur, Architektur, Consulting)
14. Predefined color palettes (10 combos)
15. Dark mode toggle with localStorage
16. Cookie banner
17. PWA manifest + service worker

### Tier 4 — Editor-only (don't migrate to compiler)
- Drag-and-drop reordering
- Live preview iframe
- Image upload / media library
- Undo/redo
- ZIP export UI
- Code view panel
