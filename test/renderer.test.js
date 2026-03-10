import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { renderSection } from "../engine/renderer.js"

describe("renderSection()", () => {
  it("returns empty string for disabled sections", () => {
    assert.equal(renderSection({ enabled: false, type: "hero" }), "")
  })

  it("renders hero section", () => {
    const html = renderSection({
      id: "hero-1", type: "hero", enabled: true,
      data: { title: "Welcome", subtitle: "Test" },
      items: [], areas: { content: 1 },
    })
    assert.ok(html.includes("Welcome"))
    assert.ok(html.includes("hero"))
  })

  it("renders cta section", () => {
    const html = renderSection({
      id: "cta-1", type: "cta", enabled: true,
      data: { title: "Get Started", ctaPrimary: "Click", ctaPrimaryUrl: "#" },
      items: [], areas: { content: 1 },
    })
    assert.ok(html.includes("Get Started"))
    assert.ok(html.includes("Click"))
  })

  it("renders cards for services", () => {
    const html = renderSection({
      id: "s-1", type: "services", enabled: true,
      data: { title: "Services" },
      items: [
        { title: "Item A", body: "Body A" },
        { title: "Item B", body: "Body B" },
        { title: "Item C", body: "Body C" },
      ],
      areas: { content: 1 },
    })
    assert.ok(html.includes("Item A"))
    assert.ok(html.includes("card"))
  })

  it("renders trust section", () => {
    const html = renderSection({
      id: "t-1", type: "trust", enabled: true,
      data: { title: "Trust" },
      items: [{ stat: "100+", label: "Clients" }],
      areas: { content: 1 },
    })
    assert.ok(html.includes("100+"))
  })

  it("renders faq section", () => {
    const html = renderSection({
      id: "faq-1", type: "faq", enabled: true,
      data: { title: "FAQ" },
      items: [{ question: "Why?", answer: "Because." }],
      areas: { content: 1 },
    })
    assert.ok(html.includes("Why?"))
    assert.ok(html.includes("Because."))
  })

  it("renders process section", () => {
    const html = renderSection({
      id: "p-1", type: "process", enabled: true,
      data: { title: "Process" },
      items: [{ title: "Step 1", body: "Do thing" }],
      areas: { content: 1 },
    })
    assert.ok(html.includes("Step 1"))
    assert.ok(html.includes("process"))
  })

  it("renders testimonials section", () => {
    const html = renderSection({
      id: "tm-1", type: "testimonials", enabled: true,
      data: { title: "Testimonials" },
      items: [{ body: "Great!", name: "Jane", rating: 5 }],
      areas: { content: 1 },
    })
    assert.ok(html.includes("Great!"))
    assert.ok(html.includes("Jane"))
  })

  it("renders footer section", () => {
    const html = renderSection(
      { id: "f-1", type: "footer", enabled: true, data: {}, items: [], areas: { content: 1 } },
      { site: { name: "Test Co", contact: { email: "hi@test.com" } }, legal: {} }
    )
    assert.ok(html.includes("Test Co"))
  })

  it("renders header section", () => {
    const html = renderSection(
      { id: "h-1", type: "header", enabled: true, data: {}, items: [], areas: { content: 1 } },
      { site: { name: "Acme Corp" }, theme: { preset: "swiss" }, _pageSections: [] }
    )
    assert.ok(html.includes("Acme Corp"))
    assert.ok(html.includes("site-header"))
  })

  it("returns comment for unknown pattern", () => {
    const html = renderSection({
      id: "x-1", type: "custom", enabled: true, pattern: "nonexistent",
      data: {}, items: [], areas: { content: 1 },
    })
    assert.ok(html.includes("<!--"))
    assert.ok(html.includes("kein Renderer"))
  })

  it("escapes user content in output", () => {
    const html = renderSection({
      id: "hero-1", type: "hero", enabled: true,
      data: { title: '<script>alert("xss")</script>' },
      items: [], areas: { content: 1 },
    })
    assert.ok(!html.includes("<script>alert"))
    assert.ok(html.includes("&lt;script&gt;"))
  })
})
