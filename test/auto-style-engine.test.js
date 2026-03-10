import { describe, it } from "node:test"
import assert from "node:assert/strict"
import {
  normalizeHex, hexToRgb, luminance, pickPrimaryAccent,
  buildIndustryPolicy, decideDensity, computeContentStats,
  getIndustryColorFallback, autoStyleEngine, INDUSTRY_POLICIES,
} from "../auto-style-engine.js"

describe("normalizeHex()", () => {
  it("normalizes 3-char hex", () => {
    assert.equal(normalizeHex("#abc"), "#aabbcc")
  })

  it("normalizes 6-char hex", () => {
    assert.equal(normalizeHex("#1a365d"), "#1a365d")
  })

  it("handles without #", () => {
    assert.equal(normalizeHex("abc"), "#aabbcc")
    assert.equal(normalizeHex("1a365d"), "#1a365d")
  })

  it("lowercases", () => {
    assert.equal(normalizeHex("#ABC"), "#aabbcc")
    assert.equal(normalizeHex("#1A365D"), "#1a365d")
  })

  it("returns null for invalid", () => {
    assert.equal(normalizeHex("not-a-color"), null)
    assert.equal(normalizeHex(""), null)
    assert.equal(normalizeHex(null), null)
    assert.equal(normalizeHex(42), null)
  })
})

describe("hexToRgb()", () => {
  it("converts white", () => {
    assert.deepEqual(hexToRgb("#ffffff"), { r: 255, g: 255, b: 255 })
  })

  it("converts black", () => {
    assert.deepEqual(hexToRgb("#000000"), { r: 0, g: 0, b: 0 })
  })

  it("converts colors", () => {
    assert.deepEqual(hexToRgb("#ff0000"), { r: 255, g: 0, b: 0 })
  })

  it("returns null for invalid", () => {
    assert.equal(hexToRgb("invalid"), null)
  })
})

describe("luminance()", () => {
  it("white has high luminance", () => {
    assert.ok(luminance({ r: 255, g: 255, b: 255 }) > 200)
  })

  it("black has zero luminance", () => {
    assert.equal(luminance({ r: 0, g: 0, b: 0 }), 0)
  })

  it("returns NaN for null", () => {
    assert.ok(Number.isNaN(luminance(null)))
  })
})

describe("pickPrimaryAccent()", () => {
  it("returns null for empty array", () => {
    const { primary, accent } = pickPrimaryAccent([])
    assert.equal(primary, null)
    assert.equal(accent, null)
  })

  it("picks darkest as primary, brightest as accent", () => {
    const { primary, accent } = pickPrimaryAccent(["#1a365d", "#ffffff", "#38a169"])
    // #1a365d is darkest non-black
    assert.equal(primary, "#1a365d")
    // #ffffff filtered by isNearWhite but still picked as brightest usable
    assert.ok(accent)
  })

  it("returns same if only one color", () => {
    const { primary, accent } = pickPrimaryAccent(["#336699"])
    assert.equal(primary, "#336699")
    assert.equal(accent, "#336699")
  })

  it("filters invalid colors", () => {
    const { primary, accent } = pickPrimaryAccent(["invalid", "#336699"])
    assert.equal(primary, "#336699")
  })
})

describe("buildIndustryPolicy()", () => {
  it("returns editorial for anwalt", () => {
    const policy = buildIndustryPolicy("anwalt")
    assert.equal(policy.preset, "editorial")
    assert.equal(policy.fontStack, "serif")
  })

  it("returns glass for it", () => {
    const policy = buildIndustryPolicy("it")
    assert.equal(policy.preset, "glass")
    assert.equal(policy.darkMode, true)
  })

  it("returns swiss default for unknown", () => {
    const policy = buildIndustryPolicy("unknown")
    assert.equal(policy.preset, "swiss")
  })

  it("conservative mode downgrades glass to swiss", () => {
    const policy = buildIndustryPolicy("it", "conservative")
    assert.equal(policy.preset, "swiss")
    assert.equal(policy.fx.orbs, false)
  })

  it("bold mode upgrades swiss to glass", () => {
    const policy = buildIndustryPolicy("treuhand", "bold")
    assert.equal(policy.preset, "glass")
    assert.equal(policy.fx.orbs, true)
  })
})

describe("decideDensity()", () => {
  it("returns compact for many cards with proof", () => {
    const stats = { hasProofTable: true, hasProcess: true, servicesCount: 6, benefitsCount: 4, faqCount: 3 }
    assert.equal(decideDensity(stats, "generic"), "compact")
  })

  it("returns airy for legal industries with long text", () => {
    const stats = { avgTextLength: 250, servicesCount: 0, benefitsCount: 0, faqCount: 0 }
    assert.equal(decideDensity(stats, "anwalt"), "airy")
  })

  it("returns airy for long hero subtitle with few cards", () => {
    const stats = { heroSubtitleLength: 200, servicesCount: 2, benefitsCount: 1, faqCount: 0 }
    assert.equal(decideDensity(stats, "generic"), "airy")
  })

  it("returns fallback for normal content", () => {
    const stats = { servicesCount: 3, benefitsCount: 0, faqCount: 0, avgTextLength: 100, heroSubtitleLength: 50 }
    assert.equal(decideDensity(stats, "generic", "balanced"), "balanced")
  })
})

describe("computeContentStats()", () => {
  it("returns zero stats for empty components", () => {
    const stats = computeContentStats({})
    assert.equal(stats.servicesCount, 0)
    assert.equal(stats.faqCount, 0)
    assert.equal(stats.hasProcess, false)
  })

  it("counts items", () => {
    const stats = computeContentStats({
      services: { items: [{}, {}, {}] },
      faq: { items: [{}, {}] },
    })
    assert.equal(stats.servicesCount, 3)
    assert.equal(stats.faqCount, 2)
  })

  it("detects enabled flags", () => {
    const stats = computeContentStats({
      process: { enabled: true },
      gallery: { enabled: false },
    })
    assert.equal(stats.hasProcess, true)
    assert.equal(stats.hasGallery, false)
  })
})

describe("getIndustryColorFallback()", () => {
  it("returns palette for legal industries", () => {
    const fb = getIndustryColorFallback("anwalt")
    assert.ok(fb.primary)
    assert.ok(fb.accent)
  })

  it("returns palette for IT", () => {
    const fb = getIndustryColorFallback("saas")
    assert.ok(fb.primary)
  })

  it("returns default palette for unknown", () => {
    const fb = getIndustryColorFallback("unknown")
    assert.ok(fb.primary)
  })
})

describe("autoStyleEngine()", () => {
  it("derives preset from industry", () => {
    const result = autoStyleEngine({}, { industryKey: "anwalt" })
    assert.equal(result.stylePreset, "editorial")
    assert.equal(result.fontStack, "serif")
  })

  it("respects locks", () => {
    const result = autoStyleEngine({}, {
      industryKey: "anwalt",
      locks: { preset: true, typography: true }
    })
    assert.equal(result.stylePreset, undefined)
    assert.equal(result.fontStack, undefined)
  })

  it("assigns fallback colors when no logoColors", () => {
    const result = autoStyleEngine({}, { industryKey: "treuhand" })
    assert.ok(result.primaryColor)
    assert.ok(result.accentColor)
  })

  it("picks colors from logoColors", () => {
    const result = autoStyleEngine({}, {
      industryKey: "generic",
      logoColors: ["#1a365d", "#38a169"]
    })
    assert.ok(result.primaryColor)
    assert.ok(result.accentColor)
  })

  it("does not override colors when locked", () => {
    const result = autoStyleEngine({}, {
      industryKey: "generic",
      locks: { colors: true }
    })
    assert.equal(result.primaryColor, undefined)
    assert.equal(result.accentColor, undefined)
  })

  it("deep copies input settings", () => {
    const settings = { existing: "value" }
    const result = autoStyleEngine(settings, { industryKey: "generic" })
    assert.equal(result.existing, "value")
    result.existing = "changed"
    assert.equal(settings.existing, "value") // original unmodified
  })
})
