import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { validateDSL } from "../engine/validator.js"

function makeDSL(overrides = {}) {
  return {
    site: { name: "Test", industry: "generic" },
    theme: { preset: "swiss" },
    pages: [{
      id: "home",
      sections: [
        { id: "hero-1", type: "hero", enabled: true, data: { title: "Hello" } },
        { id: "cta-1", type: "cta", enabled: true, data: { ctaPrimary: "Click" } },
        { id: "footer-1", type: "footer", enabled: true, data: {} },
      ]
    }],
    ...overrides,
  }
}

describe("validateDSL()", () => {
  it("valid DSL returns valid=true", () => {
    const result = validateDSL(makeDSL())
    assert.equal(result.valid, true)
    assert.equal(result.errors.length, 0)
  })

  it("missing site is an error", () => {
    const result = validateDSL({ theme: {}, pages: [{ id: "home", sections: [] }] })
    assert.equal(result.valid, false)
    assert.ok(result.errors.some(e => e.includes("site")))
  })

  it("missing theme is an error", () => {
    const result = validateDSL({ site: { name: "T", industry: "x" }, pages: [{ id: "home", sections: [] }] })
    assert.equal(result.valid, false)
    assert.ok(result.errors.some(e => e.includes("theme")))
  })

  it("empty pages is an error", () => {
    const result = validateDSL({ site: { name: "T", industry: "x" }, theme: {}, pages: [] })
    assert.equal(result.valid, false)
    assert.ok(result.errors.some(e => e.includes("pages")))
  })

  it("early return on top-level errors", () => {
    const result = validateDSL({})
    assert.equal(result.valid, false)
    // Should not crash
  })

  it("detects duplicate page IDs", () => {
    const dsl = makeDSL({
      pages: [
        { id: "home", sections: [] },
        { id: "home", sections: [] },
      ]
    })
    const result = validateDSL(dsl)
    assert.equal(result.valid, false)
    assert.ok(result.errors.some(e => e.includes("Doppelte Page-ID")))
  })

  it("detects duplicate section IDs within a page", () => {
    const dsl = makeDSL({
      pages: [{
        id: "home",
        sections: [
          { id: "s1", type: "hero", data: { title: "x" } },
          { id: "s1", type: "cta", data: { ctaPrimary: "y" } },
        ]
      }]
    })
    const result = validateDSL(dsl)
    assert.equal(result.valid, false)
    assert.ok(result.errors.some(e => e.includes("Doppelte Section-ID")))
  })

  it("detects unknown section types", () => {
    const dsl = makeDSL({
      pages: [{
        id: "home",
        sections: [
          { id: "s1", type: "banana", data: {} },
        ]
      }]
    })
    const result = validateDSL(dsl)
    assert.equal(result.valid, false)
    assert.ok(result.errors.some(e => e.includes("Unbekannter Typ")))
  })

  it("warns on missing hero title", () => {
    const dsl = makeDSL({
      pages: [{
        id: "home",
        sections: [
          { id: "hero-1", type: "hero", data: {} },
        ]
      }]
    })
    const result = validateDSL(dsl)
    assert.ok(result.warnings.some(w => w.includes("hero.data.title")))
  })

  it("warns on missing cta.ctaPrimary", () => {
    const dsl = makeDSL({
      pages: [{
        id: "home",
        sections: [
          { id: "cta-1", type: "cta", data: {} },
        ]
      }]
    })
    const result = validateDSL(dsl)
    assert.ok(result.warnings.some(w => w.includes("ctaPrimary")))
  })

  it("graph violations are warnings not errors", () => {
    const dsl = makeDSL({
      pages: [{
        id: "home",
        sections: [
          { id: "f1", type: "footer", enabled: true, data: {} },
          { id: "h1", type: "hero", enabled: true, data: { title: "x" } },
        ]
      }]
    })
    const result = validateDSL(dsl)
    assert.ok(result.warnings.length > 0)
    // Graph violations are warnings, so valid can still be true
  })

  it("disabled sections are excluded from graph check", () => {
    const dsl = makeDSL({
      pages: [{
        id: "home",
        sections: [
          { id: "f1", type: "footer", enabled: false, data: {} },
          { id: "h1", type: "hero", enabled: true, data: { title: "x" } },
        ]
      }]
    })
    const result = validateDSL(dsl)
    // Only hero is enabled, so no transition to check
    const graphWarnings = result.warnings.filter(w => w.includes("Übergang"))
    assert.equal(graphWarnings.length, 0)
  })

  it("missing site.name is an error", () => {
    const dsl = makeDSL({ site: { industry: "generic" } })
    const result = validateDSL(dsl)
    assert.ok(result.errors.some(e => e.includes("site.name")))
  })
})
