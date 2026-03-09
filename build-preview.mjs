/**
 * preview/build-preview.mjs
 * node preview/build-preview.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join }  from "path"

const __dir = dirname(fileURLToPath(import.meta.url))
const root  = join(__dir, "..")

// ── Engine-Bundle ─────────────────────────────────────────────────────────────

const ENGINE_FILES = [
  "engine/escape.js","engine/ids.js","engine/defaults.js","engine/graph.js",
  "engine/parser.js","engine/pageComposer.js","engine/sectionComposer.js",
  "engine/patternSelector.js","engine/layoutComposer.js",
  "patterns/trust.js","patterns/process.js","patterns/testimonials.js",
  "patterns/faq.js","patterns/cta.js","patterns/footer.js",
  "patterns/hero.js","patterns/text.js","patterns/cards.js",
  "engine/validator.js","engine/renderer.js","design/themeCompiler.js","engine/compiler.js",
]

let engineBundle = "// Website Factory Engine Bundle — auto-generated\n"
for (const f of ENGINE_FILES) {
  let src = readFileSync(join(root, f), "utf8")
  src = src.replace(/^import\s+\{[^}]+\}\s+from\s+['"]\.\.?\/[^'"]+['"]\s*;?\n/gm, "")
  engineBundle += src.trim() + "\n\n"
}

const exampleDSL = readFileSync(join(root, "dsl/examples/landing-treuhand.json"), "utf8")

// ── Build ──────────────────────────────────────────────────────────────────────

const html = buildHTML(engineBundle, exampleDSL)
mkdirSync(join(root, "preview"), { recursive: true })
writeFileSync(join(root, "preview/index.html"), html)
console.log("✅ preview/index.html geschrieben —", html.length, "chars")

// ── HTML ───────────────────────────────────────────────────────────────────────

function buildHTML(bundle, exampleDSL) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Website Factory — Preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; }
body { font-family: "DM Mono", monospace; background: #0c0c0f; color: #e2e2e6; }

.shell {
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-rows: 48px 1fr;
  height: 100vh;
}

/* ── Topbar ── */
.topbar {
  grid-column: 1 / -1;
  display: flex; align-items: center; gap: 16px;
  padding: 0 16px;
  background: #111116;
  border-bottom: 1px solid #1e1e28;
  z-index: 20;
}
.topbar__logo { font-family: "Syne", sans-serif; font-size: 13px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #fff; white-space: nowrap; }
.topbar__logo span { color: #7c6af7; }
.topbar__sep  { width: 1px; height: 20px; background: #1e1e28; }
.topbar__status { font-size: 11px; color: #5a5a7a; margin-left: auto; padding: 3px 8px; border: 1px solid #1e1e28; border-radius: 4px; }
.topbar__status.ok  { color: #4ade80; border-color: rgba(74,222,128,.3); }
.topbar__status.err { color: #f87171; border-color: rgba(248,113,113,.3); }

/* ── Sidebar ── */
.sidebar {
  background: #111116;
  border-right: 1px solid #1e1e28;
  display: flex; flex-direction: column;
  overflow: hidden;            /* outer: no scroll */
}
.sidebar__scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
.sidebar__scroll::-webkit-scrollbar { width: 4px; }
.sidebar__scroll::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 2px; }

/* ── Sidebar footer (actions) — always visible ── */
/* BUG-I fix: actions outside scroll area, always at bottom */
.sidebar__footer {
  flex-shrink: 0;
  border-top: 1px solid #1e1e28;
  padding: 10px 16px 14px;
  display: flex; flex-direction: column; gap: 6px;
  background: #111116;
}
.shortcut-hint { font-size: 9px; color: #3a3a5a; text-align: center; padding-bottom: 6px; }
kbd { background: #1e1e28; border-radius: 2px; padding: 1px 4px; color: #5a5a7a; font-size: 9px; }

.sec-header { padding: 10px 16px 4px; font-size: 9px; font-weight: 500; letter-spacing: .18em; text-transform: uppercase; color: #3a3a5a; }
.ctrl { padding: 3px 16px 8px; display: flex; flex-direction: column; gap: 4px; }
.ctrl label { font-size: 10px; color: #5a5a7a; display: flex; justify-content: space-between; align-items: center; }

select, input[type=text], textarea {
  width: 100%; background: #0c0c0f; border: 1px solid #1e1e28; border-radius: 4px;
  color: #c0c0d8; font-family: "DM Mono", monospace; font-size: 11px;
  padding: 5px 8px; outline: none; transition: border-color .15s;
}
select:focus, input[type=text]:focus, textarea:focus { border-color: #7c6af7; box-shadow: 0 0 0 2px rgba(124,106,247,.15); }
select option { background: #111116; }
textarea { resize: vertical; min-height: 200px; font-size: 10px; line-height: 1.6; }

.chips { display: flex; flex-wrap: wrap; gap: 4px; padding: 3px 16px 8px; }
.chip { padding: 3px 8px; border-radius: 3px; font-size: 10px; border: 1px solid #1e1e28; background: #0c0c0f; color: #5a5a7a; cursor: pointer; transition: all .12s; white-space: nowrap; }
.chip:hover  { border-color: #7c6af7; color: #9090d0; }
.chip.active { background: #7c6af7; border-color: #7c6af7; color: #fff; }

.slider-row { display: flex; align-items: center; gap: 8px; padding: 3px 16px 8px; }
.slider-row label { font-size: 10px; color: #5a5a7a; width: 90px; white-space: nowrap; flex-shrink: 0; }
.slider-row input[type=range] { flex:1; -webkit-appearance:none; height:3px; background:#1e1e28; border-radius:2px; border:none; padding:0; }
.slider-row input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:12px; height:12px; background:#7c6af7; border-radius:50%; cursor:pointer; box-shadow:0 0 0 2px rgba(124,106,247,.3); }
.slider-row .val { font-size: 10px; color: #9090b0; width: 28px; text-align: right; }

.color-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 3px 16px 8px; }
.color-item { display: flex; flex-direction: column; gap: 3px; }
.color-item label { font-size: 10px; color: #5a5a7a; }
.color-item input[type=color] { width:100%; height:28px; padding:2px 4px; background:#0c0c0f; border:1px solid #1e1e28; border-radius:4px; cursor:pointer; }

.mode-tabs { display: flex; padding: 10px 16px 0; }
.mode-tab { flex:1; padding:5px 0; font-size:10px; font-family:"DM Mono",monospace; text-align:center; border:1px solid #1e1e28; background:#0c0c0f; color:#5a5a7a; cursor:pointer; transition:all .12s; }
.mode-tab:first-child { border-radius: 4px 0 0 4px; }
.mode-tab:last-child  { border-radius: 0 4px 4px 0; border-left: none; }
.mode-tab.active { background: #1a1a2e; color: #9090d0; border-color: #7c6af7; }

/* BUG-J fix: error banner visible in both modes */
.error-banner { display:none; margin: 0 16px 8px; padding:8px 10px; background:rgba(248,113,113,.08); border:1px solid rgba(248,113,113,.25); border-radius:4px; font-size:10px; color:#f87171; white-space:pre-wrap; word-break:break-all; }
.error-banner.show { display: block; }

.btn-compile { padding:8px 16px; background:#7c6af7; border:none; border-radius:4px; color:#fff; font-family:"DM Mono",monospace; font-size:11px; font-weight:500; cursor:pointer; transition:all .15s; letter-spacing:.04em; }
.btn-compile:hover  { background:#9482ff; transform:translateY(-1px); box-shadow:0 4px 12px rgba(124,106,247,.4); }
.btn-compile:active { transform:translateY(0); }
.btn-secondary { padding:6px 16px; background:transparent; border:1px solid #1e1e28; border-radius:4px; color:#5a5a7a; font-family:"DM Mono",monospace; font-size:10px; cursor:pointer; transition:all .12s; text-align:center; }
.btn-secondary:hover { border-color:#3a3a5a; color:#9090b0; }

/* ── Preview ── */
.preview-wrap {
  position: relative;
  display: flex; flex-direction: column;
  background: #0a0a0d;
  overflow: hidden;
  min-width: 0;       /* BUG-E fix: flex child doesn't overflow */
}

.preview-toolbar {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  background: #0e0e14;
  border-bottom: 1px solid #1e1e28;
  flex-shrink: 0;
  z-index: 10;
}
.preview-toolbar__traffic { display:flex; gap:5px; }
.dot { width:10px; height:10px; border-radius:50%; }
.dot-r { background:#f87171; opacity:.6; } .dot-y { background:#fbbf24; opacity:.6; } .dot-g { background:#4ade80; opacity:.6; }
.preview-toolbar__viewport { display:flex; gap:2px; margin-left:auto; }
.vp-btn { padding:3px 8px; background:transparent; border:1px solid #1e1e28; border-radius:3px; color:#5a5a7a; font-size:10px; font-family:"DM Mono",monospace; cursor:pointer; transition:all .1s; }
.vp-btn.active, .vp-btn:hover { border-color:#7c6af7; color:#9090d0; }

/* BUG-B fix: iframe fills remaining height via flex, not hardcoded calc */
/* BUG-C fix: spinner layered above iframe with z-index */
.preview-frame-wrap {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 16px;
  position: relative;          /* for spinner absolute positioning */
  background: repeating-linear-gradient(45deg, #0a0a0d 0px, #0a0a0d 10px, #0c0c10 10px, #0c0c10 20px);
}
.preview-frame-wrap::-webkit-scrollbar { width:6px; height:6px; }
.preview-frame-wrap::-webkit-scrollbar-thumb { background:#2a2a3a; border-radius:3px; }

iframe {
  border: none;
  border-radius: 6px;
  box-shadow: 0 0 0 1px #1e1e28, 0 20px 60px rgba(0,0,0,.5);
  background: #fff;
  /* BUG-B fix: height fills the frame-wrap */
  height: 100%;
  min-height: 600px;
  transition: width .3s cubic-bezier(.16,1,.3,1);
  flex-shrink: 0;
}

/* BUG-C fix: spinner above everything in the frame wrap */
.spinner {
  display: none;
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  width: 28px; height: 28px;
  border: 2px solid #1e1e28;
  border-top-color: #7c6af7;
  border-radius: 50%;
  animation: spin .6s linear infinite;
  pointer-events: none;
}
.spinner.show { display: block; }
@keyframes spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
</style>
</head>
<body>

<div class="shell">

  <header class="topbar">
    <div class="topbar__logo">Website<span>Factory</span></div>
    <div class="topbar__sep"></div>
    <div class="topbar__logo" style="font-size:11px;font-weight:600;color:#5a5a7a;">Preview v2</div>
    <div id="statusBadge" class="topbar__status">—</div>
  </header>

  <aside class="sidebar">

    <!-- scrollable content -->
    <div class="sidebar__scroll">

      <div class="mode-tabs">
        <button class="mode-tab active" data-mode="visual" onclick="setMode('visual')">Visual</button>
        <button class="mode-tab"        data-mode="dsl"    onclick="setMode('dsl')">DSL JSON</button>
      </div>

      <!-- ── Visual Panel ── -->
      <div id="visualPanel">

        <div class="sec-header">Site</div>
        <div class="ctrl">
          <label>Name</label>
          <input type="text" id="siteName" value="Muster Treuhand AG" oninput="syncFromVisual()">
        </div>
        <div class="ctrl">
          <label>Branche</label>
          <select id="industry" onchange="syncFromVisual()">
            <option value="treuhand" selected>Treuhand</option>
            <option value="kanzlei">Kanzlei</option>
            <option value="it">IT</option>
            <option value="saas">SaaS</option>
            <option value="handwerk">Handwerk</option>
            <option value="restaurant">Restaurant</option>
            <option value="medizin">Medizin</option>
            <option value="coaching">Coaching</option>
            <option value="bildung">Bildung</option>
            <option value="immobilien">Immobilien</option>
            <option value="generic">Generisch</option>
          </select>
        </div>
        <div class="ctrl">
          <label>Page-Typ</label>
          <select id="pageType" onchange="syncFromVisual()">
            <option value="landing" selected>Landing</option>
            <option value="sales">Sales</option>
            <option value="company">Company</option>
            <option value="portfolio">Portfolio</option>
            <option value="onepage">One-Page</option>
          </select>
        </div>

        <div class="sec-header">Theme</div>
        <div class="chips" id="presetChips">
          <div class="chip active" data-preset="swiss"                 onclick="setPreset(this)">swiss</div>
          <div class="chip"        data-preset="editorial"             onclick="setPreset(this)">editorial</div>
          <div class="chip"        data-preset="glass"                 onclick="setPreset(this)">glass</div>
          <div class="chip"        data-preset="signature"             onclick="setPreset(this)">signature</div>
          <div class="chip"        data-preset="clear4-default"        onclick="setPreset(this)">c4·default</div>
          <div class="chip"        data-preset="clear4-handwerk"       onclick="setPreset(this)">c4·handwerk</div>
          <div class="chip"        data-preset="clear4-landwirtschaft" onclick="setPreset(this)">c4·agri</div>
          <div class="chip"        data-preset="clear4-premium"        onclick="setPreset(this)">c4·premium</div>
          <div class="chip"        data-preset="clear4-dark"           onclick="setPreset(this)">c4·dark</div>
        </div>

        <div class="sec-header">Density &amp; Scale</div>
        <div class="ctrl">
          <label>Density</label>
          <select id="density" onchange="syncFromVisual()">
            <option value="compact">Compact</option>
            <option value="balanced" selected>Balanced</option>
            <option value="airy">Airy</option>
          </select>
        </div>
        <div class="slider-row">
          <label>Spacing</label>
          <input type="range" id="spacingScale" min="0.6" max="1.6" step="0.05" value="1.0"
                 oninput="document.getElementById('spacingVal').textContent=parseFloat(this.value).toFixed(2);syncFromVisual()">
          <span class="val" id="spacingVal">1.00</span>
        </div>
        <div class="ctrl">
          <label>Radius</label>
          <select id="radius" onchange="syncFromVisual()">
            <option value="none">none</option>
            <option value="subtle">subtle</option>
            <option value="default" selected>default</option>
            <option value="round">round</option>
            <option value="pill">pill</option>
          </select>
        </div>

        <div class="sec-header">Brand Colors <span style="color:#3a3a5a;font-size:8px;">(override)</span></div>
        <div class="color-row">
          <div class="color-item"><label>Primary</label><input type="color" id="colorPrimary" value="#1a365d" oninput="syncFromVisual()"></div>
          <div class="color-item"><label>Accent</label><input type="color"  id="colorAccent"  value="#38a169" oninput="syncFromVisual()"></div>
          <div class="color-item"><label>Background</label><input type="color" id="colorBg"   value="#ffffff" oninput="syncFromVisual()"></div>
          <div class="color-item"><label>Text</label><input type="color"    id="colorText"    value="#0a0a0a" oninput="syncFromVisual()"></div>
        </div>

        <div class="sec-header">Complexity</div>
        <div class="chips">
          <div class="chip"        data-c="1" onclick="setComplexity(this)">1 · minimal</div>
          <div class="chip"        data-c="3" onclick="setComplexity(this)">3 · basic</div>
          <div class="chip active" data-c="5" onclick="setComplexity(this)">5 · standard</div>
          <div class="chip"        data-c="8" onclick="setComplexity(this)">8 · full</div>
        </div>

      </div><!-- /visualPanel -->

      <!-- ── DSL Panel ── -->
      <div id="dslPanel" style="display:none;padding:8px 0 0;">
        <div class="ctrl">
          <label>DSL JSON</label>
          <textarea id="dslEditor" spellcheck="false"></textarea>
        </div>
      </div>

      <!-- BUG-J fix: error banner outside panels, always visible -->
      <div id="errorBanner" class="error-banner"></div>

    </div><!-- /sidebar__scroll -->

    <!-- BUG-I fix: actions outside scroll, always pinned -->
    <div class="sidebar__footer">
      <div class="shortcut-hint"><kbd>⌘ Enter</kbd> oder <kbd>Ctrl Enter</kbd> kompilieren</div>
      <button class="btn-compile" onclick="compile()">▶ Kompilieren</button>
      <button class="btn-secondary" onclick="downloadHTML()">↓ HTML exportieren</button>
      <button class="btn-secondary" onclick="copyDSL(this)">⧉ DSL kopieren</button>
      <button class="btn-secondary" onclick="resetToExample()">↺ Beispiel laden</button>
    </div>

  </aside>

  <!-- Preview -->
  <div class="preview-wrap">
    <div class="preview-toolbar">
      <div class="preview-toolbar__traffic">
        <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
      </div>
      <div id="previewUrl" style="font-size:10px;color:#3a3a5a;margin-left:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:300px;">—</div>
      <div class="preview-toolbar__viewport">
        <!-- BUG-E fix: Desktop uses 'fill' not '100%' — handled in JS -->
        <button class="vp-btn active" data-w="fill"  onclick="setViewport(this)">Desktop</button>
        <button class="vp-btn"        data-w="768px" onclick="setViewport(this)">Tablet</button>
        <button class="vp-btn"        data-w="375px" onclick="setViewport(this)">Mobile</button>
      </div>
    </div>

    <div class="preview-frame-wrap" id="frameWrap">
      <div class="spinner" id="spinner"></div>
      <!-- BUG-B fix: no inline height; flex parent handles it -->
      <iframe id="previewFrame" style="width:100%;"></iframe>
    </div>
  </div>

</div><!-- /shell -->

<script type="module">
// ════════════════════════════════════════════════
// ENGINE BUNDLE
// ════════════════════════════════════════════════
${bundle}

// ════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════
const EXAMPLE_DSL = ${exampleDSL};

let currentMode    = "visual"
let currentPreset  = "swiss"
let currentComplex = 5
// BUG-H fix: track whether DSL was manually edited
let dslDirty       = false
let lastHTML       = ""
let lastDSL        = null

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
document.getElementById("dslEditor").value = JSON.stringify(EXAMPLE_DSL, null, 2)
document.getElementById("dslEditor").addEventListener("input", () => { dslDirty = true })
compile()

// ════════════════════════════════════════════════
// MODE SWITCH
// ════════════════════════════════════════════════
window.setMode = function(mode) {
  currentMode = mode
  document.querySelectorAll(".mode-tab").forEach(t => t.classList.toggle("active", t.dataset.mode === mode))
  document.getElementById("visualPanel").style.display = mode === "visual" ? "block" : "none"
  document.getElementById("dslPanel").style.display    = mode === "dsl"    ? "block" : "none"

  // BUG-H fix: only overwrite editor if not manually dirty
  if (mode === "dsl" && !dslDirty) {
    try {
      document.getElementById("dslEditor").value = JSON.stringify(buildDSLFromVisual(), null, 2)
    } catch(e) {}
  }
}

// ════════════════════════════════════════════════
// CHIPS
// ════════════════════════════════════════════════
window.setPreset = function(el) {
  document.querySelectorAll(".chip[data-preset]").forEach(c => c.classList.remove("active"))
  el.classList.add("active")
  currentPreset = el.dataset.preset
  syncFromVisual()
}

window.setComplexity = function(el) {
  document.querySelectorAll(".chip[data-c]").forEach(c => c.classList.remove("active"))
  el.classList.add("active")
  currentComplex = parseInt(el.dataset.c)
  syncFromVisual()
}

// ════════════════════════════════════════════════
// VIEWPORT — BUG-E fix
// ════════════════════════════════════════════════
window.setViewport = function(el) {
  document.querySelectorAll(".vp-btn").forEach(b => b.classList.remove("active"))
  el.classList.add("active")
  const frame = document.getElementById("previewFrame")
  if (el.dataset.w === "fill") {
    frame.style.width    = "100%"
    frame.style.maxWidth = ""
  } else {
    frame.style.width    = el.dataset.w
    frame.style.maxWidth = el.dataset.w
  }
}

// ════════════════════════════════════════════════
// BUILD DSL — BUG-F fix: pages auto-composed when industry/complexity change
// ════════════════════════════════════════════════
function buildDSLFromVisual() {
  const industry   = document.getElementById("industry").value
  const pageType   = document.getElementById("pageType").value
  const complexity = currentComplex

  // If industry or complexity differs from example, drop fixed sections
  // so compiler auto-composes them via composePage()
  const exampleIndustry = EXAMPLE_DSL.site.industry
  const exampleComplex  = EXAMPLE_DSL.site.complexity
  const sameConfig = (industry === exampleIndustry && complexity === exampleComplex && pageType === EXAMPLE_DSL.site.pageType)

  const pages = sameConfig
    ? EXAMPLE_DSL.pages                                    // keep example content
    : [{ id: "home", kind: pageType, title: document.getElementById("siteName").value || "Start" }]  // auto-compose

  return {
    ...EXAMPLE_DSL,
    site: {
      ...EXAMPLE_DSL.site,
      name:       document.getElementById("siteName").value || "Meine Website",
      industry,
      pageType,
      complexity,
    },
    theme: {
      preset:       currentPreset,
      density:      document.getElementById("density").value,
      spacingScale: parseFloat(document.getElementById("spacingScale").value),
      radius:       document.getElementById("radius").value,
      brand: {
        primary: document.getElementById("colorPrimary").value,
        accent:  document.getElementById("colorAccent").value,
        bg:      document.getElementById("colorBg").value,
        text:    document.getElementById("colorText").value,
      }
    },
    pages,
    legal: EXAMPLE_DSL.legal,
    seo:   { ...EXAMPLE_DSL.seo },
  }
}

// ════════════════════════════════════════════════
// SYNC (debounced)
// ════════════════════════════════════════════════
window.syncFromVisual = function() {
  if (currentMode === "dsl" && !dslDirty) {
    try {
      document.getElementById("dslEditor").value = JSON.stringify(buildDSLFromVisual(), null, 2)
    } catch(e) {}
  }
  clearTimeout(window._compileTimer)
  window._compileTimer = setTimeout(compile, 150)
}

// ════════════════════════════════════════════════
// COMPILE — BUG-J fix: errors shown in both modes
// ════════════════════════════════════════════════
window.compile = function() {
  const spinner = document.getElementById("spinner")
  const badge   = document.getElementById("statusBadge")
  const errEl   = document.getElementById("errorBanner")

  spinner.classList.add("show")
  errEl.classList.remove("show")

  try {
    let dsl
    if (currentMode === "dsl") {
      dsl = JSON.parse(document.getElementById("dslEditor").value)
    } else {
      dsl = buildDSLFromVisual()
    }
    lastDSL = dsl

    const t0   = performance.now()
    const html = compileSite(dsl)
    const ms   = (performance.now() - t0).toFixed(0)
    lastHTML   = html

    const frame = document.getElementById("previewFrame")
    const doc   = frame.contentDocument || frame.contentWindow.document
    doc.open(); doc.write(html); doc.close()

    const domain = dsl.site?.domain
      || (dsl.site?.name || "preview").toLowerCase().replace(/\\s+/g, "-") + ".ch"
    document.getElementById("previewUrl").textContent = "https://" + domain

    badge.textContent = ms + "ms"
    badge.className   = "topbar__status ok"

  } catch(err) {
    badge.textContent = "Fehler"
    badge.className   = "topbar__status err"
    // BUG-J fix: show error in both modes
    errEl.textContent = err.message
    errEl.classList.add("show")
    console.error("compile:", err)
  } finally {
    spinner.classList.remove("show")
  }
}

// ════════════════════════════════════════════════
// EXPORT — BUG-G fix: filename from site name/domain
// ════════════════════════════════════════════════
window.downloadHTML = function() {
  if (!lastHTML) return
  const siteName = lastDSL?.site?.domain
    || (lastDSL?.site?.name || "website").toLowerCase().replace(/\\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  const filename = siteName.endsWith(".ch") || siteName.endsWith(".com") ? siteName : siteName + ".html"
  const blob = new Blob([lastHTML], { type: "text/html" })
  const a    = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob), download: filename
  })
  a.click()
  URL.revokeObjectURL(a.href)
}

// BUG-A fix: btn passed explicitly, no event global
window.copyDSL = function(btn) {
  let dsl
  try {
    dsl = currentMode === "dsl"
      ? document.getElementById("dslEditor").value
      : JSON.stringify(buildDSLFromVisual(), null, 2)
  } catch(e) { return }
  navigator.clipboard.writeText(dsl).then(() => {
    const old = btn.textContent
    btn.textContent = "✓ Kopiert"
    setTimeout(() => btn.textContent = old, 1200)
  })
}

// BUG-D fix: resetToExample uses EXAMPLE_DSL.theme.preset
window.resetToExample = function() {
  dslDirty = false
  document.getElementById("dslEditor").value  = JSON.stringify(EXAMPLE_DSL, null, 2)
  document.getElementById("siteName").value   = EXAMPLE_DSL.site.name
  document.getElementById("industry").value   = EXAMPLE_DSL.site.industry
  document.getElementById("pageType").value   = EXAMPLE_DSL.site.pageType
  document.getElementById("density").value    = EXAMPLE_DSL.theme.density    || "balanced"
  document.getElementById("spacingScale").value = String(EXAMPLE_DSL.theme.spacingScale || 1.0)
  document.getElementById("spacingVal").textContent = parseFloat(EXAMPLE_DSL.theme.spacingScale || 1.0).toFixed(2)

  // BUG-D fix: use actual preset from EXAMPLE_DSL
  const preset = EXAMPLE_DSL.theme.preset || "swiss"
  currentPreset = preset
  document.querySelectorAll(".chip[data-preset]").forEach(c =>
    c.classList.toggle("active", c.dataset.preset === preset)
  )

  currentComplex = EXAMPLE_DSL.site.complexity || 5
  document.querySelectorAll(".chip[data-c]").forEach(c =>
    c.classList.toggle("active", parseInt(c.dataset.c) === currentComplex)
  )

  compile()
}

// ════════════════════════════════════════════════
// KEYBOARD
// ════════════════════════════════════════════════
document.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    e.preventDefault()
    compile()
  }
})
</script>

</body>
</html>`
}
