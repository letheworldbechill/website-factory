/**
 * engine/escape.js
 *
 * HTML-Escaping für alle user-generierten Inhalte.
 * Verhindert XSS-Angriffe durch injection in Templates.
 *
 * Regel: ALLE Werte aus DSL.data, DSL.items, DSL.site.name etc.
 *        müssen durch esc() laufen bevor sie in HTML-Attribute
 *        oder Text-Content eingefügt werden.
 */

const ESC_MAP = {
  "&":  "&amp;",
  "<":  "&lt;",
  ">":  "&gt;",
  '"':  "&quot;",
  "'":  "&#x27;",
  "/":  "&#x2F;",
  "`":  "&#x60;",
}

/**
 * Escaped einen String für sichere HTML-Ausgabe.
 * Gibt leeren String zurück wenn value null/undefined/falsy ist.
 *
 * @param {any}    value - Zu escapender Wert
 * @returns {string}     - Sicherer HTML-String
 */
export function esc(value) {
  if (value === null || value === undefined) return ""
  return String(value).replace(/[&<>"'`/]/g, c => ESC_MAP[c])
}

/**
 * Escaped einen URL-Wert für href/src-Attribute.
 * Blockt javascript:-URLs und data:- URLs.
 *
 * @param {string} url
 * @returns {string}
 */
export function escUrl(url) {
  if (!url) return "#"
  const s = String(url).trim()
  // javascript: und data: sind gefährlich
  if (/^(javascript|data|vbscript):/i.test(s)) return "#"
  return esc(s)
}
