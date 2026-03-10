import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { composeLayout, layoutClass } from "../engine/layoutComposer.js"

describe("composeLayout()", () => {
  it("default single area creates stack", () => {
    const layout = composeLayout({})
    assert.equal(layout.type, "stack")
    assert.equal(layout.columns, "1fr")
    assert.ok(layout.style.includes("1fr"))
  })

  it("two areas create split", () => {
    const layout = composeLayout({ areas: { text: 8, image: 5 } })
    assert.equal(layout.type, "split")
    assert.equal(layout.columns, "8fr 5fr")
    assert.deepEqual(layout.areaNames, ["text", "image"])
    assert.deepEqual(layout.areaValues, [8, 5])
  })

  it("three areas create triple", () => {
    const layout = composeLayout({ areas: { a: 1, b: 1, c: 1 } })
    assert.equal(layout.type, "triple")
    assert.equal(layout.columns, "1fr 1fr 1fr")
  })

  it("four+ areas create grid", () => {
    const layout = composeLayout({ areas: { a: 1, b: 1, c: 1, d: 1 } })
    assert.equal(layout.type, "grid")
  })

  it("style contains grid display", () => {
    const layout = composeLayout({ areas: { content: 1 } })
    assert.ok(layout.style.includes("display:grid"))
    assert.ok(layout.style.includes("gap:var(--sp-8)"))
  })
})

describe("layoutClass()", () => {
  it("maps stack to layout-stack", () => {
    assert.equal(layoutClass({ type: "stack" }), "layout-stack")
  })

  it("maps split to layout-split", () => {
    assert.equal(layoutClass({ type: "split" }), "layout-split")
  })

  it("maps triple to layout-triple", () => {
    assert.equal(layoutClass({ type: "triple" }), "layout-triple")
  })

  it("maps grid to layout-grid", () => {
    assert.equal(layoutClass({ type: "grid" }), "layout-grid")
  })

  it("unknown type falls back to layout-grid", () => {
    assert.equal(layoutClass({ type: "unknown" }), "layout-grid")
  })
})
