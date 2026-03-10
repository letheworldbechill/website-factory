import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { esc, escUrl } from "../engine/escape.js"

describe("esc()", () => {
  it("returns empty string for null", () => {
    assert.equal(esc(null), "")
  })

  it("returns empty string for undefined", () => {
    assert.equal(esc(undefined), "")
  })

  it("passes through safe strings unchanged", () => {
    assert.equal(esc("Hello World"), "Hello World")
  })

  it("escapes &", () => {
    assert.equal(esc("A & B"), "A &amp; B")
  })

  it("escapes < and >", () => {
    assert.equal(esc("<script>alert(1)</script>"), "&lt;script&gt;alert(1)&lt;&#x2F;script&gt;")
  })

  it("escapes double quotes", () => {
    assert.equal(esc('val="x"'), "val=&quot;x&quot;")
  })

  it("escapes single quotes", () => {
    assert.equal(esc("it's"), "it&#x27;s")
  })

  it("escapes backticks", () => {
    assert.equal(esc("`code`"), "&#x60;code&#x60;")
  })

  it("escapes forward slashes", () => {
    assert.equal(esc("a/b"), "a&#x2F;b")
  })

  it("converts numbers to string", () => {
    assert.equal(esc(42), "42")
  })

  it("handles empty string", () => {
    assert.equal(esc(""), "")
  })

  it("escapes multiple special chars in one string", () => {
    assert.equal(esc('<img src="x" onerror="alert(1)">'), '&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;')
  })
})

describe("escUrl()", () => {
  it("returns # for empty/falsy input", () => {
    assert.equal(escUrl(""), "#")
    assert.equal(escUrl(null), "#")
    assert.equal(escUrl(undefined), "#")
  })

  it("blocks javascript: URLs", () => {
    assert.equal(escUrl("javascript:alert(1)"), "#")
  })

  it("blocks javascript: case-insensitive", () => {
    assert.equal(escUrl("JavaScript:alert(1)"), "#")
    assert.equal(escUrl("JAVASCRIPT:void(0)"), "#")
  })

  it("blocks data: URLs", () => {
    assert.equal(escUrl("data:text/html,<h1>XSS</h1>"), "#")
  })

  it("blocks vbscript: URLs", () => {
    assert.equal(escUrl("vbscript:MsgBox('XSS')"), "#")
  })

  it("allows normal URLs and escapes them", () => {
    assert.equal(escUrl("https://example.com"), "https:&#x2F;&#x2F;example.com")
  })

  it("allows fragment URLs", () => {
    assert.equal(escUrl("#section"), "#section")
  })

  it("trims whitespace", () => {
    assert.equal(escUrl("  #section  "), "#section")
  })

  it("allows relative URLs", () => {
    const result = escUrl("/page/about")
    assert.ok(result.includes("page"))
    assert.notEqual(result, "#")
  })
})
