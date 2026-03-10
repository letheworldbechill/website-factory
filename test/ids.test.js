import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { sectionId } from "../engine/ids.js"

describe("sectionId()", () => {
  it("returns string with type prefix", () => {
    const id = sectionId("hero")
    assert.ok(id.startsWith("hero-"))
  })

  it("has correct format: type-xxxx", () => {
    const id = sectionId("services")
    assert.match(id, /^services-[a-z0-9]{4}$/)
  })

  it("generates unique IDs", () => {
    const ids = new Set()
    for (let i = 0; i < 100; i++) {
      ids.add(sectionId("test"))
    }
    // With 36^4 = 1.6M possibilities, 100 should be unique
    assert.equal(ids.size, 100)
  })

  it("works with different types", () => {
    const types = ["hero", "cta", "footer", "custom"]
    for (const type of types) {
      const id = sectionId(type)
      assert.ok(id.startsWith(`${type}-`), `Expected ${id} to start with ${type}-`)
    }
  })
})
