import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { selectPattern } from "../engine/patternSelector.js"

describe("selectPattern()", () => {
  it("explicit pattern override takes precedence", () => {
    assert.equal(selectPattern({ type: "services", pattern: "grid", items: [] }), "grid")
  })

  it("fixed types return their fixed pattern", () => {
    assert.equal(selectPattern({ type: "hero" }), "hero")
    assert.equal(selectPattern({ type: "header" }), "header")
    assert.equal(selectPattern({ type: "faq" }), "faq")
    assert.equal(selectPattern({ type: "cta" }), "cta")
    assert.equal(selectPattern({ type: "footer" }), "footer")
    assert.equal(selectPattern({ type: "trust" }), "trust")
    assert.equal(selectPattern({ type: "process" }), "process")
    assert.equal(selectPattern({ type: "testimonials" }), "testimonials")
    assert.equal(selectPattern({ type: "contact" }), "contact")
    assert.equal(selectPattern({ type: "gallery" }), "gallery")
    assert.equal(selectPattern({ type: "authority" }), "text")
  })

  // Item-based sections (services, benefits, pricing, team)
  it("0 items on item-section returns cards (skeleton)", () => {
    assert.equal(selectPattern({ type: "services", items: [] }), "cards")
    assert.equal(selectPattern({ type: "benefits", items: [] }), "cards")
    assert.equal(selectPattern({ type: "pricing", items: [] }), "cards")
    assert.equal(selectPattern({ type: "team", items: [] }), "cards")
  })

  it("0 items on non-item section returns text", () => {
    assert.equal(selectPattern({ type: "custom", items: [] }), "text")
  })

  it("2 items returns split", () => {
    assert.equal(selectPattern({ type: "services", items: [{}, {}] }), "split")
  })

  it("3-4 items returns cards", () => {
    assert.equal(selectPattern({ type: "services", items: [{}, {}, {}] }), "cards")
    assert.equal(selectPattern({ type: "services", items: [{}, {}, {}, {}] }), "cards")
  })

  it("5-8 items returns grid", () => {
    assert.equal(selectPattern({ type: "services", items: Array(5).fill({}) }), "grid")
    assert.equal(selectPattern({ type: "services", items: Array(8).fill({}) }), "grid")
  })

  it("9+ items returns list", () => {
    assert.equal(selectPattern({ type: "services", items: Array(9).fill({}) }), "list")
    assert.equal(selectPattern({ type: "services", items: Array(20).fill({}) }), "list")
  })

  it("no items property defaults to 0 count", () => {
    assert.equal(selectPattern({ type: "services" }), "cards")
    assert.equal(selectPattern({ type: "custom" }), "text")
  })
})
