# Code Review – Website Editor (`index.html`)

## Scope
Review des Editors mit Fokus auf **Performance**, **Security**, **Maintainability** und **Deployment-Risiken**.

## Executive Summary
Der Editor ist funktional umfangreich, hat aber ein paar strukturelle Risiken für produktive Nutzung:

1. **Hohe Initial-Load-Kosten** durch Laufzeit-Transpilation mit Babel im Browser.
2. **Supply-Chain-Risiko** durch externe CDN-Skripte ohne Subresource Integrity (SRI).
3. **PWA/Deployment-Risiko** durch Service-Worker-Registrierung ohne klare Versionierungs-/Update-Strategie.
4. **Wartbarkeit** leidet stark durch die große Single-File-Architektur.

---

## Findings

### 1) Runtime-Transpilation im Browser (High)
**Beobachtung:** Babel Standalone wird direkt im Browser geladen und mehrere Blöcke mit `type="text/babel"` werden zur Laufzeit transpiliert.  
**Risiko:** Langsamer Startup, höherer CPU-Bedarf auf schwächeren Geräten, schlechtere Caching- und Debugging-Eigenschaften.

**Evidenz:** `@babel/standalone` sowie mehrere `text/babel`-Skripte.  

**Empfehlung:** Build-Step (z. B. Vite/esbuild) einführen und statisch gebaute JS-Bundles ausliefern.

### 2) Externe Skripte ohne SRI (High)
**Beobachtung:** React, ReactDOM, Babel, JSZip und FileSaver werden von CDNs geladen, aber ohne `integrity`-Attribute.
**Risiko:** Bei kompromittiertem CDN/Dependency kann schädlicher Code unbemerkt geladen werden.

**Evidenz:** `<script src="https://...">` mit `crossorigin`, jedoch ohne `integrity`.

**Empfehlung:**
- Feste, gepinnte Versionen mit SRI verwenden.
- Kritische Libraries möglichst selbst hosten.
- CSP-Header ergänzen (mindestens `script-src` restriktiv).

### 3) Service Worker Registrierung ohne Update-Konzept (Medium)
**Beobachtung:** Service Worker wird auf HTTP(S) direkt registriert (`./sw.js`), aber im Dokument ist keine begleitende Strategie für Versionierung, Rollback oder Cache-Busting erkennbar.
**Risiko:** Stale Caches, schwer nachvollziehbare Produktionsfehler nach Deployments.

**Evidenz:** Direkte Registrierung von `./sw.js`.

**Empfehlung:**
- Versionierte Cache-Namen im SW.
- Aktiv gesteuertes Update-Handling (`skipWaiting`/`clientsClaim` mit UX-Flow).
- Deployment-Checkliste für SW-Invalidation.

### 4) Monolithische Single-File-Struktur (Medium)
**Beobachtung:** Sehr große HTML-Datei mit umfangreichem CSS + JS + React-Komponenten in einem Dokument.
**Risiko:** Hohe Komplexität bei Änderungen, schwierigeres Testen/Reviewen, erhöhte Regression-Gefahr.

**Evidenz:** Styling, Utilities, Komponenten und Bootstrap liegen im selben Dokument.

**Empfehlung:**
- Modularisieren: `styles/`, `components/`, `core/`, `export/`.
- Kleine, klar abgegrenzte Module mit Unit-Tests.
- Optional TypeScript für robustere Refactors.

---

## Positiv aufgefallen
- Accessibility-Basics wie `:focus-visible` und `prefers-reduced-motion` sind berücksichtigt.
- Zusätzliche Safety/Validation-Hilfen sind vorhanden (z. B. Error-Overlay, ExportValidator).

## Priorisierte Next Steps
1. **Build-Pipeline statt Browser-Babel**.
2. **SRI + pinned dependencies + CSP**.
3. **Service-Worker-Update-Strategie** dokumentieren und technisch absichern.
4. **Schrittweise Modularisierung** (zuerst Utilities + Komponenten trennen).
