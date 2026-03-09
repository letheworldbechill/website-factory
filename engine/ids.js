/**
 * engine/ids.js
 *
 * ID-Generierung für Sections.
 * Kein crypto-Modul nötig — läuft in Browser und Node.
 */

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789"

/**
 * Erzeugt eine kurze zufällige ID (4 Zeichen).
 * Format: "a1b2"
 */
function shortId(length = 4) {
  let id = ""
  for (let i = 0; i < length; i++) {
    id += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return id
}

/**
 * Erzeugt eine Section-ID im Format "<type>-<shortid>".
 * Beispiel: "hero-a1b2", "services-x9y8"
 */
export function sectionId(type) {
  return `${type}-${shortId()}`
}
