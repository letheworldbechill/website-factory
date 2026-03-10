import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { parse } from "../engine/parser.js"

const minimal = { site: { name: "Test Co", industry: "generic" } }

describe("parse()", () => {
  it("throws on null input", () => {
    assert.throws(() => parse(null), /Input muss ein Objekt/)
  })

  it("throws on non-object input", () => {
    assert.throws(() => parse("string"), /Input muss ein Objekt/)
  })

  it("throws when site.name is missing", () => {
    assert.throws(() => parse({ site: { industry: "generic" } }), /site\.name/)
  })

  it("throws when site.industry is missing", () => {
    assert.throws(() => parse({ site: { name: "Test" } }), /site\.industry/)
  })

  it("parses minimal input successfully", () => {
    const result = parse(minimal)
    assert.equal(result.site.name, "Test Co")
    assert.equal(result.site.industry, "generic")
  })

  it("applies site defaults", () => {
    const result = parse(minimal)
    assert.equal(result.site.language, "de-CH")
    assert.equal(result.site.pageType, "landing")
    assert.equal(result.site.complexity, 5)
  })

  it("applies theme defaults", () => {
    const result = parse(minimal)
    assert.equal(result.theme.preset, "swiss")
    assert.equal(result.theme.density, "balanced")
    assert.equal(result.theme.spacingScale, 1.0)
  })

  it("generates default home page when pages empty", () => {
    const result = parse(minimal)
    assert.equal(result.pages.length, 1)
    assert.equal(result.pages[0].id, "home")
    assert.equal(result.pages[0].slug, "/")
  })

  it("preserves user-provided pages", () => {
    const input = {
      ...minimal,
      pages: [
        { id: "about", title: "About Us", sections: [] }
      ]
    }
    const result = parse(input)
    assert.equal(result.pages.length, 1)
    assert.equal(result.pages[0].id, "about")
    assert.equal(result.pages[0].slug, "/about")
  })

  it("generates fallback page IDs", () => {
    const input = {
      ...minimal,
      pages: [
        { title: "First" },
        { title: "Second" },
      ]
    }
    const result = parse(input)
    assert.equal(result.pages[0].id, "home")
    assert.equal(result.pages[1].id, "page-2")
  })

  it("parses sections with defaults", () => {
    const input = {
      ...minimal,
      pages: [{
        id: "home",
        sections: [{ type: "hero", data: { title: "Welcome" } }]
      }]
    }
    const result = parse(input)
    const hero = result.pages[0].sections[0]
    assert.equal(hero.type, "hero")
    assert.equal(hero.data.title, "Welcome")
    assert.equal(hero.enabled, true)
    assert.ok(hero.id) // auto-generated
  })

  it("defaults section type to custom", () => {
    const input = {
      ...minimal,
      pages: [{ id: "home", sections: [{ data: {} }] }]
    }
    const result = parse(input)
    assert.equal(result.pages[0].sections[0].type, "custom")
  })

  it("parses SEO with titleTemplate substitution", () => {
    const input = {
      ...minimal,
      seo: { titleTemplate: "%s - My Site" }
    }
    const result = parse(input)
    assert.equal(result.seo.titleTemplate, "%s - My Site")
  })

  it("parses legal with company fallback", () => {
    const result = parse(minimal)
    assert.equal(result.legal.companyName, "Test Co")
  })

  it("parses contact defaults", () => {
    const result = parse(minimal)
    assert.equal(result.site.contact.country, "CH")
    assert.equal(result.site.contact.email, "")
  })

  it("preserves user theme overrides", () => {
    const input = {
      ...minimal,
      theme: { preset: "glass", density: "compact" }
    }
    const result = parse(input)
    assert.equal(result.theme.preset, "glass")
    assert.equal(result.theme.density, "compact")
  })

  it("handles sections with enabled=false", () => {
    const input = {
      ...minimal,
      pages: [{ id: "home", sections: [{ type: "hero", enabled: false }] }]
    }
    const result = parse(input)
    assert.equal(result.pages[0].sections[0].enabled, false)
  })
})
