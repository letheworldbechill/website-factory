import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { GRAPH, isValidTransition, validateSequence, allSectionTypes } from "../engine/graph.js"

describe("GRAPH", () => {
  it("footer is terminal (no outgoing edges)", () => {
    assert.deepEqual(GRAPH.footer, [])
  })

  it("header only leads to hero", () => {
    assert.deepEqual(GRAPH.header, ["hero"])
  })

  it("hero has multiple valid targets", () => {
    assert.ok(GRAPH.hero.length > 1)
  })
})

describe("isValidTransition()", () => {
  it("header → hero is valid", () => {
    assert.ok(isValidTransition("header", "hero"))
  })

  it("hero → trust is valid", () => {
    assert.ok(isValidTransition("hero", "trust"))
  })

  it("footer → hero is invalid", () => {
    assert.equal(isValidTransition("footer", "hero"), false)
  })

  it("unknown → anything is false", () => {
    assert.equal(isValidTransition("unknown", "hero"), false)
  })

  it("cta → footer is valid", () => {
    assert.ok(isValidTransition("cta", "footer"))
  })
})

describe("validateSequence()", () => {
  it("valid sequence returns empty violations", () => {
    const violations = validateSequence(["hero", "trust", "services", "cta", "footer"])
    assert.deepEqual(violations, [])
  })

  it("reports unknown section types", () => {
    const violations = validateSequence(["hero", "banana", "footer"])
    assert.ok(violations.some(v => v.includes("banana")))
  })

  it("reports invalid transitions", () => {
    const violations = validateSequence(["footer", "hero"])
    assert.ok(violations.some(v => v.includes("Ungültiger Übergang")))
  })

  it("header is permissive (any target)", () => {
    const violations = validateSequence(["header", "services"])
    assert.deepEqual(violations, [])
  })

  it("custom is permissive", () => {
    const violations = validateSequence(["hero", "custom", "footer"])
    assert.deepEqual(violations, [])
  })

  it("empty sequence returns no violations", () => {
    assert.deepEqual(validateSequence([]), [])
  })

  it("single element returns no violations", () => {
    assert.deepEqual(validateSequence(["hero"]), [])
  })
})

describe("allSectionTypes()", () => {
  it("returns all types from GRAPH", () => {
    const types = allSectionTypes()
    assert.ok(types.includes("hero"))
    assert.ok(types.includes("footer"))
    assert.ok(types.includes("header"))
    assert.ok(types.includes("custom"))
  })
})
