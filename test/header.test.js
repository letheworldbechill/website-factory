import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { renderHeader, compileHeaderScript } from "../patterns/header.js"

const baseSection = { id: "hdr-1", type: "header", data: {}, items: [], areas: { content: 1 } }
const baseConfig = { site: { name: "Test AG" }, theme: { preset: "swiss" }, _pageSections: [] }

describe("renderHeader()", () => {
  it("renders site name", () => {
    const html = renderHeader(baseSection, {}, baseConfig)
    assert.ok(html.includes("Test AG"))
  })

  it("derives initials from brand name", () => {
    const html = renderHeader(baseSection, {}, baseConfig)
    // "Test AG" → "T" (AG is filtered out)
    assert.ok(html.includes("site-header__logo-initials"))
  })

  it("uses logo image when provided", () => {
    const section = { ...baseSection, data: { logoImage: "https://example.com/logo.png" } }
    const html = renderHeader(section, {}, baseConfig)
    assert.ok(html.includes("site-header__logo-img"))
    assert.ok(html.includes("example.com"))
  })

  it("auto-generates nav from page sections", () => {
    const config = {
      ...baseConfig,
      _pageSections: [
        { id: "svc-1", type: "services", enabled: true, data: { label: "Services" } },
        { id: "faq-1", type: "faq", enabled: true, data: {} },
      ]
    }
    const html = renderHeader(baseSection, {}, config)
    assert.ok(html.includes("Services"))
    assert.ok(html.includes("FAQ"))
    assert.ok(html.includes("#svc-1"))
    assert.ok(html.includes("#faq-1"))
  })

  it("uses explicit navItems when provided", () => {
    const section = {
      ...baseSection,
      data: { navItems: [{ label: "Home", href: "#home" }, { label: "About", href: "#about" }] }
    }
    const html = renderHeader(section, {}, baseConfig)
    assert.ok(html.includes("Home"))
    assert.ok(html.includes("About"))
    assert.ok(html.includes("#home"))
  })

  it("supports string navItems", () => {
    const section = {
      ...baseSection,
      data: { navItems: ["Services", "FAQ"] }
    }
    const html = renderHeader(section, {}, baseConfig)
    assert.ok(html.includes("Services"))
    assert.ok(html.includes("#services"))
  })

  it("adds dark class for glass preset", () => {
    const config = { ...baseConfig, theme: { preset: "glass" } }
    const html = renderHeader(baseSection, {}, config)
    assert.ok(html.includes("site-header--dark"))
  })

  it("adds dark class for clear4-dark preset", () => {
    const config = { ...baseConfig, theme: { preset: "clear4-dark" } }
    const html = renderHeader(baseSection, {}, config)
    assert.ok(html.includes("site-header--dark"))
  })

  it("no dark class for swiss preset", () => {
    const html = renderHeader(baseSection, {}, baseConfig)
    assert.ok(!html.includes("site-header--dark"))
  })

  it("renders CTA button when ctaText provided", () => {
    const section = { ...baseSection, data: { ctaText: "Contact Us", ctaUrl: "#contact" } }
    const html = renderHeader(section, {}, baseConfig)
    assert.ok(html.includes("Contact Us"))
    assert.ok(html.includes("btn--primary"))
  })

  it("includes mobile nav", () => {
    const html = renderHeader(baseSection, {}, baseConfig)
    assert.ok(html.includes("site-header__mobile-nav"))
    assert.ok(html.includes("site-header__toggle"))
  })

  it("escapes XSS in site name", () => {
    const config = { ...baseConfig, site: { name: '<img onerror="alert(1)">' } }
    const html = renderHeader(baseSection, {}, config)
    assert.ok(!html.includes('onerror="alert'))
  })

  it("skips disabled sections in auto-nav", () => {
    const config = {
      ...baseConfig,
      _pageSections: [
        { id: "svc-1", type: "services", enabled: false, data: {} },
        { id: "faq-1", type: "faq", enabled: true, data: {} },
      ]
    }
    const html = renderHeader(baseSection, {}, config)
    assert.ok(!html.includes("#svc-1"))
    assert.ok(html.includes("#faq-1"))
  })
})

describe("compileHeaderScript()", () => {
  it("returns a script tag", () => {
    const script = compileHeaderScript()
    assert.ok(script.includes("<script>"))
    assert.ok(script.includes("</script>"))
  })

  it("includes scroll handler", () => {
    const script = compileHeaderScript()
    assert.ok(script.includes("scroll"))
  })

  it("includes hamburger toggle", () => {
    const script = compileHeaderScript()
    assert.ok(script.includes("toggle"))
    assert.ok(script.includes("aria-expanded"))
  })

  it("includes Escape key handler", () => {
    const script = compileHeaderScript()
    assert.ok(script.includes("Escape"))
  })
})
