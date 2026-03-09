# Minimal Builder v5 – Review & Refactor-Plan zum soliden Produkt

## Zielbild
Aus dem aktuellen „Minimal Builder“ soll ein **zuverlässiges, wartbares und release-fähiges Produkt** werden – mit klarer Architektur, Testbarkeit, Sicherheit und planbarer Weiterentwicklung.

---

## 1) Kurzreview des aktuellen Stands

### Stärken
- Funktionsdichte ist hoch: Editor, Vorschau und Export sind bereits integriert.
- Gute UX-Basics vorhanden (z. B. Accessibility-Hinweise, Motion-Reduktion, visuelle Tokens).
- Produktgedanke ist klar erkennbar (Website-Builder mit Export-Pipeline).

### Hauptrisiken (für „solides Produkt“)
1. **Monolithische Single-File-Architektur**
   - Sehr großes `index.html` mit Styles, React-Komponenten, Business-Logik und Export-Code.
   - Hohe Änderungsrisiken, geringe Wiederverwendbarkeit, schwer testbar.
2. **Runtime-Transpilation im Browser**
   - `@babel/standalone` + `text/babel` erhöhen Startzeit und CPU-Last.
3. **Security/Delivery-Risiken über CDN-Setup**
   - Mehrere externe Skripte; für Produktionshärte fehlen harte Build-/Supply-Chain-Gates.
4. **Unklare Layering-Grenzen**
   - UI, Domain, Template-Logik und Export sind stark gekoppelt.
5. **Fehlende Produkt-Guardrails**
   - Keine klaren Qualitätsgates (CI, Tests, Release-Checklisten, Migrationsregeln).

---

## 2) Refactor-Zielarchitektur (v5)

### Architekturprinzipien
- **Trennung nach Verantwortung**: `app/ui`, `domain`, `rendering`, `export`, `infra`.
- **Unidirektionaler Datenfluss**: Zustand → Rendering/Preview → Export.
- **Schema-first Datenmodell**: Zentrale Validierung (z. B. Zod/JSON-Schema).
- **Deterministischer Export**: Gleiche Eingabe = identischer Output.
- **Design-System als API**: Tokens + Spacing/Layout-Regeln als zentrale Quelle.

### Vorgeschlagene Struktur
```txt
src/
  app/
    bootstrap.tsx
    routes/
  ui/
    components/
    panels/
    primitives/
  domain/
    model/
    actions/
    validation/
  rendering/
    preview/
    templates/
  export/
    html/
    assets/
    validators/
  infra/
    persistence/
    analytics/
    service-worker/
  styles/
    tokens/
    themes/
    global.css
tests/
  unit/
  integration/
  e2e/
```

---

## 3) Umsetzungsplan in 5 Phasen

## Phase 0 – Stabilisieren & Baseline (1–2 Wochen)
**Ziel:** Messbar machen, bevor umgebaut wird.

- Build-Tooling aufsetzen (Vite o. ä.), ohne Feature-Änderungen.
- Linting/Formatting strikt aktivieren.
- Baseline-Metriken erfassen:
  - Bundlegröße
  - First Load / Time to Interactive
  - Export-Dauer
  - Error-Rate im Browser
- „Golden Files“ für Export erzeugen (Referenz-Outputs).

**Abnahmekriterien**
- Reproduzierbarer Build lokal + CI.
- Baseline-Dashboard/Markdown mit Metriken vorhanden.

## Phase 1 – Entkoppeln der Kernlogik (2–3 Wochen)
**Ziel:** Risiko aus dem Monolithen nehmen.

- Domain-Modell extrahieren (`Project`, `Page`, `Section`, `Theme`, `Asset`).
- Alle State-Transitions in Actions/Reducer kapseln.
- Preview-Renderer von Editor-UI trennen.
- Export-Pipeline als separates Modul isolieren.

**Abnahmekriterien**
- Kern-Use-Cases laufen ohne direkte DOM-Kopplung.
- Erste Unit-Tests für Domain + Export grün.

## Phase 2 – Produktqualität & Sicherheit (1–2 Wochen)
**Ziel:** Produktionshärte.

- Externe Skripte durch gebaute Bundles ersetzen.
- CSP-Konzept + Dependency-Pinning + Security-Scan in CI.
- Service-Worker-Strategie: Versionierung, Update-UX, Rollback.
- Error-Boundaries + Telemetrie für kritische Pfade.

**Abnahmekriterien**
- Security-Checks in CI verpflichtend.
- SW-Update-Flow dokumentiert und getestet.

## Phase 3 – UX-Systematisierung (2 Wochen)
**Ziel:** Konsistenz und Skalierbarkeit im Editor.

- Komponentenbibliothek mit klaren API-Kontrakten.
- Spacing/Layout-System aus Dokumentation technisch verankern.
- Theming vereinheitlichen (Dark/Light + Export-Theme-Kompatibilität).
- Accessibility-Regressionstests (Keyboard, Fokus, Kontrast).

**Abnahmekriterien**
- Design-Tokens sind Single Source of Truth.
- A11y-Smoke-Tests in CI vorhanden.

## Phase 4 – Release-Readiness (1 Woche)
**Ziel:** Betriebssicheres Produkt.

- SemVer + Changelog + Migrationsnotes.
- Smoke-E2E für Kern-Workflows:
  - Projekt anlegen
  - Abschnitt bearbeiten
  - Vorschau prüfen
  - Export + ZIP validieren
- Release-Checkliste + Incident-Runbook.

**Abnahmekriterien**
- Wiederholbarer Release-Prozess.
- Kern-Workflows stabil in E2E.

---

## 4) Priorisierte Backlog-Epics
1. **E1 – Build-System & Modulstruktur**
2. **E2 – Domain Model + Validation Layer**
3. **E3 – Export Engine Hardening**
4. **E4 – UI-Komponentenbibliothek**
5. **E5 – Security & Compliance Guardrails**
6. **E6 – Observability & Error Monitoring**

---

## 5) KPIs für „solides Produkt“
- **Performance:** Initial Load < 2.5s (Median Zielgerät)
- **Stabilität:** < 1% Session Error Rate in kritischen Flows
- **Qualität:** 80%+ Abdeckung für Domain/Export-Module
- **Delivery:** Jeder Merge läuft durch CI-Quality-Gates
- **UX:** Keine Blocker in Keyboard/A11y-Smoke-Tests

---

## 6) Minimaler Start ab morgen (konkrete Tasks)
1. Projekt auf Vite migrieren (ohne Feature-Änderung).
2. `src/domain` anlegen und Datenschema aus aktuellem State ableiten.
3. Export-Funktionen in `src/export` extrahieren.
4. 3 Golden-File-Tests für HTML-Export einführen.
5. CI mit Lint + Unit + Export-Tests verpflichtend machen.

Damit entsteht eine **inkrementelle Refactor-Route**: schnellere Deploys, weniger Regressionen, klarere Ownership und bessere Basis für v5-Features.
