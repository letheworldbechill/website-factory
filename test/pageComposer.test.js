import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { composePage, basePageSections, industryExtensions } from "../engine/pageComposer.js"

describe("composePage()", () => {
  it("returns sections for default complexity 5", () => {
    const result = composePage({ complexity: 5, industry: "generic" })
    assert.ok(result.includes("hero"))
    assert.ok(result.includes("footer"))
    assert.ok(result.includes("header"))
  })

  it("complexity 1 returns minimal set", () => {
    const result = composePage({ complexity: 1, industry: "generic" })
    assert.deepEqual(result, ["header", "hero", "cta", "footer"])
  })

  it("complexity 8 returns full set", () => {
    const result = composePage({ complexity: 8, industry: "generic" })
    assert.ok(result.includes("authority"))
    assert.ok(result.includes("process"))
    assert.ok(result.includes("faq"))
  })

  it("unknown complexity falls back to 5", () => {
    const result = composePage({ complexity: 99, industry: "generic" })
    const default5 = composePage({ complexity: 5, industry: "generic" })
    assert.deepEqual(result, default5)
  })

  it("adds industry extensions for treuhand", () => {
    const result = composePage({ complexity: 1, industry: "treuhand" })
    assert.ok(result.includes("trust"))
    assert.ok(result.includes("process"))
    assert.ok(result.includes("faq"))
  })

  it("results are in canonical order", () => {
    const result = composePage({ complexity: 8, industry: "treuhand" })
    const heroIdx = result.indexOf("hero")
    const footerIdx = result.indexOf("footer")
    const ctaIdx = result.indexOf("cta")
    assert.ok(heroIdx < ctaIdx)
    assert.ok(ctaIdx < footerIdx)
  })

  it("no duplicate entries", () => {
    const result = composePage({ complexity: 8, industry: "treuhand" })
    const set = new Set(result)
    assert.equal(result.length, set.size)
  })

  it("unknown industry adds no extensions", () => {
    const result = composePage({ complexity: 1, industry: "unknown" })
    const generic = composePage({ complexity: 1, industry: "generic" })
    assert.deepEqual(result, generic)
  })
})

describe("basePageSections()", () => {
  it("returns landing sections", () => {
    const result = basePageSections("landing")
    assert.ok(result.includes("hero"))
    assert.ok(result.includes("footer"))
  })

  it("returns sales sections", () => {
    const result = basePageSections("sales")
    assert.ok(result.includes("testimonials"))
    assert.ok(result.includes("faq"))
  })

  it("unknown pageType falls back to landing", () => {
    const result = basePageSections("unknown")
    assert.deepEqual(result, basePageSections("landing"))
  })
})

describe("industryExtensions()", () => {
  it("returns extensions for treuhand", () => {
    const result = industryExtensions("treuhand")
    assert.deepEqual(result, ["trust", "process", "faq"])
  })

  it("returns empty for generic", () => {
    assert.deepEqual(industryExtensions("generic"), [])
  })

  it("returns empty for unknown industry", () => {
    assert.deepEqual(industryExtensions("unknown"), [])
  })
})
