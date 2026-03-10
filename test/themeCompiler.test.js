import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { compileTheme } from "../design/themeCompiler.js"

const defaultTheme = { preset: "swiss", density: "balanced", spacingScale: 1.0 }

describe("compileTheme()", () => {
  it("returns a CSS string", () => {
    const css = compileTheme(defaultTheme)
    assert.ok(typeof css === "string")
    assert.ok(css.includes(":root"))
  })

  it("includes color variables", () => {
    const css = compileTheme(defaultTheme)
    assert.ok(css.includes("--c-primary"))
    assert.ok(css.includes("--c-accent"))
    assert.ok(css.includes("--c-bg"))
    assert.ok(css.includes("--c-text"))
  })

  it("includes font variables", () => {
    const css = compileTheme(defaultTheme)
    assert.ok(css.includes("--font-display"))
    assert.ok(css.includes("--font-body"))
  })

  it("includes spacing variables", () => {
    const css = compileTheme(defaultTheme)
    assert.ok(css.includes("--sp-1"))
    assert.ok(css.includes("--sp-16"))
  })

  it("includes radius variables", () => {
    const css = compileTheme(defaultTheme)
    assert.ok(css.includes("--r-sm"))
    assert.ok(css.includes("--r-pill"))
  })

  it("uses swiss preset colors by default", () => {
    const css = compileTheme(defaultTheme)
    assert.ok(css.includes("#1a365d")) // swiss primary
  })

  it("uses editorial preset colors", () => {
    const css = compileTheme({ preset: "editorial", density: "balanced" })
    assert.ok(css.includes("#b45309")) // editorial accent
  })

  it("uses glass preset colors", () => {
    const css = compileTheme({ preset: "glass", density: "balanced" })
    assert.ok(css.includes("#6366f1")) // glass primary
  })

  it("unknown preset falls back to swiss", () => {
    const css = compileTheme({ preset: "nonexistent", density: "balanced" })
    assert.ok(css.includes("#1a365d")) // swiss primary
  })

  it("applies brand color overrides", () => {
    const css = compileTheme({ preset: "swiss", density: "balanced", brand: { primary: "#ff0000" } })
    assert.ok(css.includes("#ff0000"))
  })

  it("applies bare font override with system-ui fallback", () => {
    const css = compileTheme({ preset: "swiss", density: "balanced", font: { display: "Roboto" } })
    assert.ok(css.includes("Roboto, system-ui, sans-serif"))
  })

  it("passes through complete font stack without duplicating fallbacks", () => {
    const css = compileTheme({
      preset: "swiss", density: "balanced",
      font: { display: "Playfair Display, Georgia, serif", body: "Inter, system-ui, sans-serif" }
    })
    // Must NOT double-append system-ui
    assert.ok(css.includes("Playfair Display, Georgia, serif"))
    assert.ok(!css.includes("Playfair Display, Georgia, serif, system-ui"))
    assert.ok(css.includes("Inter, system-ui, sans-serif"))
    assert.ok(!css.includes("Inter, system-ui, sans-serif, system-ui"))
  })

  it("compact density scales spacing down", () => {
    const compact = compileTheme({ preset: "swiss", density: "compact", spacingScale: 1.0 })
    const balanced = compileTheme({ preset: "swiss", density: "balanced", spacingScale: 1.0 })
    // sp-4 compact: round(16 * 0.8) = 13px, balanced: 16px
    assert.ok(compact.includes("13px"))
    assert.ok(balanced.includes("16px"))
  })

  it("airy density scales spacing up", () => {
    const airy = compileTheme({ preset: "swiss", density: "airy", spacingScale: 1.0 })
    // sp-4: round(16 * 1.2) = 19px
    assert.ok(airy.includes("19px"))
  })

  it("radius none produces 0 values", () => {
    const css = compileTheme({ preset: "swiss", density: "balanced", radius: "none" })
    assert.ok(css.includes("--r-sm:   0;"))
  })

  it("includes utility classes", () => {
    const css = compileTheme(defaultTheme)
    assert.ok(css.includes(".bg--default"))
    assert.ok(css.includes(".bg--brand"))
    assert.ok(css.includes(".btn--primary"))
    assert.ok(css.includes(".layout-split"))
    assert.ok(css.includes(".card"))
  })

  it("includes responsive media queries", () => {
    const css = compileTheme(defaultTheme)
    assert.ok(css.includes("@media"))
    assert.ok(css.includes("768px"))
  })

  it("includes header styles", () => {
    const css = compileTheme(defaultTheme)
    assert.ok(css.includes(".site-header"))
  })

  it("includes reduced motion", () => {
    const css = compileTheme(defaultTheme)
    assert.ok(css.includes("prefers-reduced-motion"))
  })
})
