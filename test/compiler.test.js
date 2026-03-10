import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { compileSite } from "../engine/compiler.js"

const minimal = { site: { name: "Test GmbH", industry: "treuhand" } }

describe("compileSite() — integration", () => {
  it("returns an HTML document for minimal input", () => {
    const html = compileSite(minimal)
    assert.ok(typeof html === "string")
    assert.ok(html.includes("<!DOCTYPE html>"))
    assert.ok(html.includes("</html>"))
  })

  it("contains site name", () => {
    const html = compileSite(minimal)
    assert.ok(html.includes("Test GmbH"))
  })

  it("contains CSS variables", () => {
    const html = compileSite(minimal)
    assert.ok(html.includes("--c-primary"))
    assert.ok(html.includes("--font-body"))
  })

  it("contains header with nav", () => {
    const html = compileSite(minimal)
    assert.ok(html.includes("site-header"))
  })

  it("contains header script", () => {
    const html = compileSite(minimal)
    assert.ok(html.includes("<script>"))
    assert.ok(html.includes("site-header"))
  })

  it("contains hero section", () => {
    const html = compileSite(minimal)
    assert.ok(html.includes("hero"))
  })

  it("contains footer section", () => {
    const html = compileSite(minimal)
    assert.ok(html.includes("footer"))
  })

  it("auto-composes sections when pages have no sections", () => {
    const input = {
      ...minimal,
      pages: [{ id: "home", kind: "landing", title: "Home" }]
    }
    const html = compileSite(input)
    assert.ok(html.includes("hero"))
    assert.ok(html.includes("footer"))
  })

  it("uses provided sections when given", () => {
    const input = {
      ...minimal,
      pages: [{
        id: "home",
        sections: [
          { type: "hero", data: { title: "Custom Hero" }, items: [] },
          { type: "footer", data: {}, items: [] },
        ]
      }]
    }
    const html = compileSite(input)
    assert.ok(html.includes("Custom Hero"))
  })

  it("returns map for multiple pages", () => {
    const input = {
      ...minimal,
      pages: [
        { id: "home", title: "Home" },
        { id: "about", title: "About" },
      ]
    }
    const result = compileSite(input)
    assert.equal(typeof result, "object")
    assert.ok(result.home)
    assert.ok(result.about)
    assert.ok(result.home.includes("<!DOCTYPE html>"))
    assert.ok(result.about.includes("<!DOCTYPE html>"))
  })

  it("strict mode throws on validation errors", () => {
    const input = {
      site: { name: "Test", industry: "generic" },
      pages: [{
        id: "home",
        sections: [{ id: "s1", type: "banana_invalid" }]
      }]
    }
    assert.throws(() => compileSite(input, { strict: true }), /DSL-Fehler/)
  })

  it("applies auto-style for industry", () => {
    const html = compileSite({ site: { name: "Kanzlei Müller", industry: "kanzlei" } })
    // Kanzlei → editorial preset → Playfair Display
    assert.ok(html.includes("Playfair Display"))
  })

  it("produces clean font stacks without duplication", () => {
    const html = compileSite({ site: { name: "X", industry: "kanzlei" } })
    // Kanzlei → serif stack → "Playfair Display, Georgia, serif"
    // Must NOT contain doubled fallbacks
    assert.ok(html.includes("Playfair Display, Georgia, serif"))
    assert.ok(!html.includes("Playfair Display, Georgia, serif, system-ui"))
  })

  it("produces clean sans-serif font stacks without duplication", () => {
    const html = compileSite({ site: { name: "X", industry: "it" } })
    // IT → inter stack → "Inter, system-ui, sans-serif"
    // Must appear exactly once, not doubled
    const css = html.match(/--font-display:\s*([^;]+)/)?.[1]
    assert.ok(css, "CSS should contain --font-display")
    const occurrences = (css.match(/system-ui/g) || []).length
    assert.equal(occurrences, 1, `system-ui should appear once in font-display, got: ${css}`)
  })

  it("respects user theme overrides (locks)", () => {
    const input = {
      site: { name: "Test", industry: "kanzlei" },
      theme: { preset: "glass", brand: { primary: "#ff00ff" } }
    }
    const html = compileSite(input)
    // User locked preset to glass and brand.primary → both preserved
    assert.ok(html.includes("#ff00ff")) // user's custom primary not overridden
  })

  it("generates proper SEO meta tags", () => {
    const input = {
      ...minimal,
      pages: [{ id: "home", title: "Homepage" }],
      seo: { titleTemplate: "%s | Test GmbH" }
    }
    const html = compileSite(input)
    assert.ok(html.includes("<title>Homepage | Test GmbH</title>"))
  })

  it("includes lang attribute from site.language", () => {
    const html = compileSite(minimal)
    assert.ok(html.includes('lang="de-CH"'))
  })

  it("escapes special chars in lang", () => {
    const input = {
      site: { name: "Test", industry: "generic", language: 'de">' }
    }
    const html = compileSite(input)
    assert.ok(!html.includes('lang="de">'))
  })

  it("generates body padding for header", () => {
    const html = compileSite(minimal)
    assert.ok(html.includes("--header-h"))
    assert.ok(html.includes("padding-top"))
  })

  it("includes viewport meta tag", () => {
    const html = compileSite(minimal)
    assert.ok(html.includes('name="viewport"'))
  })

  it("includes charset meta tag", () => {
    const html = compileSite(minimal)
    assert.ok(html.includes('charset="UTF-8"'))
  })

  it("different industries produce different output", () => {
    const treuhand = compileSite({ site: { name: "A", industry: "treuhand" } })
    const saas = compileSite({ site: { name: "A", industry: "saas" } })
    // They should have different theme presets
    assert.notEqual(treuhand, saas)
  })

  it("different complexity levels produce different section counts", () => {
    const simple = compileSite({ site: { name: "A", industry: "generic", complexity: 1 } })
    const full = compileSite({ site: { name: "A", industry: "generic", complexity: 8 } })
    // Full should be much longer due to more sections
    assert.ok(full.length > simple.length)
  })
})
