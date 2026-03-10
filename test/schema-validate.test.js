import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { validate } from "../schema/validate.js"

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Shorthand: validate inline schema against data, return error strings. */
function check(schema, data) {
  return validate(schema, data, "#", schema)
}

// ── Object validation ────────────────────────────────────────────────────────

describe("validate() — objects", () => {
  it("accepts a valid object", () => {
    const schema = { type: "object", properties: { name: { type: "string" } } }
    assert.deepEqual(check(schema, { name: "hello" }), [])
  })

  it("rejects non-object", () => {
    const schema = { type: "object" }
    const errors = check(schema, "string")
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("erwartet object"))
  })

  it("rejects array as object", () => {
    const schema = { type: "object" }
    const errors = check(schema, [1, 2])
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("array"))
  })

  it("rejects null as object", () => {
    const schema = { type: "object" }
    const errors = check(schema, null)
    assert.equal(errors.length, 1)
  })

  it("reports missing required fields", () => {
    const schema = {
      type: "object",
      required: ["a", "b"],
      properties: { a: { type: "string" }, b: { type: "string" } },
    }
    const errors = check(schema, { a: "ok" })
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("'b'"))
  })

  it("reports unknown fields with additionalProperties false", () => {
    const schema = {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "string" } },
    }
    const errors = check(schema, { x: "ok", y: "extra" })
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("'y'"))
  })

  it("validates nested properties", () => {
    const schema = {
      type: "object",
      properties: {
        inner: {
          type: "object",
          properties: { val: { type: "number" } },
        },
      },
    }
    const errors = check(schema, { inner: { val: "not a number" } })
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("inner"))
    assert.ok(errors[0].includes("number"))
  })
})

// ── Array validation ─────────────────────────────────────────────────────────

describe("validate() — arrays", () => {
  it("accepts a valid array", () => {
    const schema = { type: "array", items: { type: "string" } }
    assert.deepEqual(check(schema, ["a", "b"]), [])
  })

  it("rejects non-array", () => {
    const schema = { type: "array" }
    const errors = check(schema, {})
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("erwartet array"))
  })

  it("reports minItems violation", () => {
    const schema = { type: "array", minItems: 2, items: { type: "string" } }
    const errors = check(schema, ["one"])
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("mindestens 2"))
  })

  it("validates individual items", () => {
    const schema = { type: "array", items: { type: "number" } }
    const errors = check(schema, [1, "two", 3])
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("[1]"))
  })
})

// ── String validation ────────────────────────────────────────────────────────

describe("validate() — strings", () => {
  it("accepts a valid string", () => {
    assert.deepEqual(check({ type: "string" }, "hello"), [])
  })

  it("rejects non-string", () => {
    const errors = check({ type: "string" }, 42)
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("erwartet string"))
  })

  it("validates enum", () => {
    const schema = { type: "string", enum: ["a", "b"] }
    const errors = check(schema, "c")
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("nicht erlaubt"))
  })

  it("accepts valid enum value", () => {
    const schema = { type: "string", enum: ["a", "b"] }
    assert.deepEqual(check(schema, "a"), [])
  })

  it("validates minLength", () => {
    const schema = { type: "string", minLength: 3 }
    const errors = check(schema, "ab")
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("mindestens 3"))
  })

  it("validates maxLength", () => {
    const schema = { type: "string", maxLength: 5 }
    const errors = check(schema, "toolong")
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("maximal 5"))
  })

  it("validates pattern", () => {
    const schema = { type: "string", pattern: "^[a-z]+$" }
    const errors = check(schema, "ABC")
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("Muster"))
  })

  it("accepts matching pattern", () => {
    const schema = { type: "string", pattern: "^[a-z]+$" }
    assert.deepEqual(check(schema, "abc"), [])
  })
})

// ── Format checks ────────────────────────────────────────────────────────────

describe("validate() — format checks", () => {
  it("validates email format", () => {
    const schema = { type: "string", format: "email" }
    assert.deepEqual(check(schema, "user@example.com"), [])
    assert.equal(check(schema, "not-an-email").length, 1)
  })

  it("validates uri format", () => {
    const schema = { type: "string", format: "uri" }
    assert.deepEqual(check(schema, "https://example.com"), [])
    assert.equal(check(schema, "not a url").length, 1)
  })

  it("validates hostname format", () => {
    const schema = { type: "string", format: "hostname" }
    assert.deepEqual(check(schema, "example.com"), [])
    assert.equal(check(schema, "not a host!").length, 1)
  })

  it("validates uri-reference format", () => {
    const schema = { type: "string", format: "uri-reference" }
    assert.deepEqual(check(schema, "/path/to/page"), [])
    assert.equal(check(schema, "").length, 1)
  })

  it("ignores unknown format (no check registered)", () => {
    const schema = { type: "string", format: "ipv4" }
    assert.deepEqual(check(schema, "not an ip"), [])
  })
})

// ── Number / Integer validation ──────────────────────────────────────────────

describe("validate() — numbers", () => {
  it("accepts a valid number", () => {
    assert.deepEqual(check({ type: "number" }, 3.14), [])
  })

  it("rejects non-number", () => {
    const errors = check({ type: "number" }, "3")
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("erwartet number"))
  })

  it("validates minimum", () => {
    const schema = { type: "number", minimum: 10 }
    const errors = check(schema, 5)
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("Minimalwert"))
  })

  it("validates maximum", () => {
    const schema = { type: "number", maximum: 100 }
    const errors = check(schema, 200)
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("Maximalwert"))
  })

  it("accepts number at boundary", () => {
    const schema = { type: "number", minimum: 0, maximum: 10 }
    assert.deepEqual(check(schema, 0), [])
    assert.deepEqual(check(schema, 10), [])
  })

  it("validates integer type", () => {
    const schema = { type: "integer" }
    assert.deepEqual(check(schema, 5), [])
    const errors = check(schema, 5.5)
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("ganzzahligen"))
  })

  it("validates number enum", () => {
    const schema = { type: "number", enum: [1, 2, 3] }
    assert.deepEqual(check(schema, 2), [])
    assert.equal(check(schema, 4).length, 1)
  })
})

// ── Boolean validation ───────────────────────────────────────────────────────

describe("validate() — booleans", () => {
  it("accepts boolean values", () => {
    assert.deepEqual(check({ type: "boolean" }, true), [])
    assert.deepEqual(check({ type: "boolean" }, false), [])
  })

  it("rejects non-boolean", () => {
    const errors = check({ type: "boolean" }, "true")
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("erwartet boolean"))
  })
})

// ── $ref resolution ──────────────────────────────────────────────────────────

describe("validate() — $ref", () => {
  it("resolves internal $ref", () => {
    const schema = {
      type: "object",
      properties: {
        item: { $ref: "#/$defs/myString" },
      },
      $defs: {
        myString: { type: "string", minLength: 1 },
      },
    }
    assert.deepEqual(check(schema, { item: "ok" }), [])
    assert.equal(check(schema, { item: "" }).length, 1)
  })

  it("throws on unresolvable internal $ref", () => {
    const schema = {
      type: "object",
      properties: {
        item: { $ref: "#/$defs/doesNotExist" },
      },
    }
    assert.throws(() => check(schema, { item: "x" }), /nicht gefunden/)
  })
})

// ── Combined / edge cases ────────────────────────────────────────────────────

describe("validate() — edge cases", () => {
  it("accumulates multiple errors", () => {
    const schema = {
      type: "object",
      required: ["a", "b", "c"],
      properties: {
        a: { type: "string" },
        b: { type: "string" },
        c: { type: "string" },
      },
    }
    const errors = check(schema, {})
    assert.equal(errors.length, 3)
  })

  it("handles deeply nested validation", () => {
    const schema = {
      type: "object",
      properties: {
        level1: {
          type: "object",
          properties: {
            level2: {
              type: "object",
              properties: {
                value: { type: "integer" },
              },
            },
          },
        },
      },
    }
    const errors = check(schema, { level1: { level2: { value: 1.5 } } })
    assert.equal(errors.length, 1)
    assert.ok(errors[0].includes("level1"))
    assert.ok(errors[0].includes("level2"))
  })

  it("skips properties not present in data", () => {
    const schema = {
      type: "object",
      properties: {
        optional: { type: "string", minLength: 5 },
      },
    }
    // optional field not provided — should not error
    assert.deepEqual(check(schema, {}), [])
  })
})
