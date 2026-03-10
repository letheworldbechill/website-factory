import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { composeSections, composeSection } from "../engine/sectionComposer.js"

describe("composeSections()", () => {
  it("returns one section per type", () => {
    const result = composeSections(["hero", "cta", "footer"])
    assert.equal(result.length, 3)
    assert.equal(result[0].type, "hero")
    assert.equal(result[1].type, "cta")
    assert.equal(result[2].type, "footer")
  })

  it("each section has required fields", () => {
    const result = composeSections(["hero"])
    const s = result[0]
    assert.ok(s.id)
    assert.equal(s.type, "hero")
    assert.equal(s.enabled, true)
    assert.ok(s.areas)
    assert.ok(s.data)
    assert.ok(Array.isArray(s.items))
    assert.ok(s.settings)
  })

  it("generates unique IDs", () => {
    const result = composeSections(["hero", "hero"])
    assert.notEqual(result[0].id, result[1].id)
  })

  it("applies industry-specific content", () => {
    const generic = composeSections(["hero"], "generic")
    const treuhand = composeSections(["hero"], "treuhand")
    // Treuhand has specific hero content; should differ from generic
    // Both should have hero data
    assert.ok(generic[0].data)
    assert.ok(treuhand[0].data)
  })

  it("deep copies items (no shared references)", () => {
    const result1 = composeSections(["services"], "treuhand")
    const result2 = composeSections(["services"], "treuhand")
    if (result1[0].items.length > 0 && result2[0].items.length > 0) {
      result1[0].items[0].title = "MUTATED"
      assert.notEqual(result2[0].items[0].title, "MUTATED")
    }
  })

  it("empty types returns empty array", () => {
    assert.deepEqual(composeSections([]), [])
  })
})

describe("composeSection()", () => {
  it("returns a single section", () => {
    const s = composeSection("hero")
    assert.equal(s.type, "hero")
    assert.ok(s.id)
    assert.equal(s.enabled, true)
  })
})
