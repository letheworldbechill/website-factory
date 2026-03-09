# Smooth Builder – Spacing- & Layout-System

**Implementierungsdokumentation (direkt umsetzbar)**

Ziel dieses Dokuments: Du bekommst einen klaren, technischen Migrationspfad, damit **Builder UI, Preview und Export HTML** dieselben Spacing-Proportionen nutzen.

---

## 1) Zielarchitektur

Das System soll überall dieselbe Token-Quelle verwenden:

1. `Design Tokens`
2. `Component Styles`
3. `Builder Preview`
4. `Export (tokens.css/components.css/index.html)`

**Regel:** Keine eigenen Spacing-Skalen pro Schicht mehr. Es gibt nur **eine** Ladder + **eine** Dichte-Skalierung.

---

## 2) Neues Spacing-System (8px + Fibonacci)

### 2.1 Kernidee

- Basiseinheit: `8px`
- Wachstum: Fibonacci-nahe Sprünge
- Vorteil: konsistente Rhythmik, bessere visuelle Hierarchie auf Landingpages

### 2.2 Verbindliche Ladder

```css
:root {
  --sp-scale: 1;

  --sp-1: calc(0.5rem * var(--sp-scale));     /* 8px */
  --sp-2: calc(0.8125rem * var(--sp-scale));  /* 13px */
  --sp-3: calc(1.3125rem * var(--sp-scale));  /* 21px */
  --sp-4: calc(2.125rem * var(--sp-scale));   /* 34px */
  --sp-5: calc(3.4375rem * var(--sp-scale));  /* 55px */
  --sp-6: calc(5.5625rem * var(--sp-scale));  /* 89px */
  --sp-7: calc(9rem * var(--sp-scale));       /* 144px */
}
```

### 2.3 Dichte-Modi

```css
[data-density="compact"]  { --sp-scale: 0.8; }
[data-density="balanced"] { --sp-scale: 1; }
[data-density="airy"]     { --sp-scale: 1.25; }
```

> Empfehlung: `balanced` als Default setzen.

---

## 3) Typografie an `--sp-scale` koppeln

Behalte `clamp(...)` bei, aber skaliere konsistent:

```css
:root {
  --text-xs: clamp(calc(0.75rem * var(--sp-scale)), 1vw, calc(0.8rem * var(--sp-scale)));
  --text-sm: clamp(calc(0.875rem * var(--sp-scale)), 1.2vw, calc(0.95rem * var(--sp-scale)));
  --text-base: clamp(calc(1rem * var(--sp-scale)), 1.4vw, calc(1.05rem * var(--sp-scale)));
  --text-lg: clamp(calc(1.125rem * var(--sp-scale)), 1.8vw, calc(1.25rem * var(--sp-scale)));
  --text-xl: clamp(calc(1.25rem * var(--sp-scale)), 2vw, calc(1.5rem * var(--sp-scale)));
}
```

Damit bleibt die Lesbarkeit über Density-Modi stabil.

---

## 4) Vertikaler Rhythmus für Sections

Definiere globale Section-Abstände:

```css
:root {
  --section-space-sm: var(--sp-4);
  --section-space-md: var(--sp-5);
  --section-space-lg: var(--sp-6);
  --section-space-xl: var(--sp-7);
}

.section {
  padding-block: var(--section-space-lg);
}

.hero {
  padding-block: var(--section-space-xl);
}

.trust {
  padding-block: var(--section-space-sm);
}
```

---

## 5) Container- und Grid-Standard

### 5.1 Container

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--sp-3);
}
```

Optional für große Layouts: `max-width: 1280px;`

### 5.2 Grid

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--sp-3);
}

.hero-grid {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: var(--sp-5);
}

@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: var(--sp-4);
  }
}
```

---

## 6) Komponentenregeln (verbindlich)

```css
.card {
  padding: var(--sp-4);
  border-radius: 14px;
}

.btn {
  padding: calc(var(--sp-2) * 0.75) var(--sp-3);
}

.section-header {
  margin-bottom: var(--sp-5);
}
```

Wichtig: Alle Komponenten nutzen nur `--sp-*` und `--section-space-*`.

---

## 7) Export-Konsistenz (kritischer Punkt)

Der Export darf **keine eigene Spacing-Skala** enthalten.

### Pflicht für Export-Pipeline

1. `tokens.css` wird aus exakt derselben Token-Quelle erzeugt wie die Preview.
2. `components.css` enthält keine harten Pixelwerte für Margins/Paddings (außer Radius/Border-Sonderfälle).
3. `index.html` referenziert nur die exportierten Token-Dateien.

### Akzeptanzkriterium

- Bei gleichem Datensatz + gleichem `density` müssen Preview und Export visuell deckungsgleich sein (Toleranz max. 1px durch Browser-Rounding).

---

## 8) Services-Grid Fix (Desktop)

Wenn aktuell nur 1 Spalte aktiv ist, ergänze:

```css
.services__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-4);
}

@media (min-width: 900px) {
  .services__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 9) Migrationsplan (in Reihenfolge umsetzen)

1. **Token-Quelle umstellen**
   - Alte 4px-Ladder entfernen.
   - Neue Fibonacci-Ladder + `--sp-scale` setzen.
2. **Density-Mapping vereinheitlichen**
   - `compact/balanced/airy` überall identisch abbilden.
3. **Komponenten migrieren**
   - Alle Spacing-Hardcodes (`px/rem`) auf `--sp-*`/`--section-space-*` umstellen.
4. **Export-Generator angleichen**
   - Export-Tokens aus derselben Quelle wie Preview erzeugen.
5. **Regression-Check**
   - Vorher/Nachher-Screens mit denselben Daten vergleichen.

---

## 10) Definition of Done (DoD)

Eine Implementierung gilt als abgeschlossen, wenn:

- [ ] Es gibt nur noch **eine** Spacing-Ladder im gesamten System.
- [ ] Density beeinflusst Preview und Export gleich.
- [ ] Komponenten verwenden ausschließlich Spacing-Tokens.
- [ ] Services-Grid ist ab `900px` 3-spaltig.
- [ ] Snapshot-Test „Preview vs Export“ besteht.

---

## 11) QA-Checkliste

- [ ] `compact`: Layout bleibt dicht, aber lesbar.
- [ ] `balanced`: Standard-Layout wirkt neutral.
- [ ] `airy`: Mehr Weißraum ohne visuelle Brüche.
- [ ] Hero-Abstand deutlich größer als Trust-Bar.
- [ ] Buttons, Cards, Section-Header behalten Proportionen über alle Dichten.

---

## 12) Optionaler nächster Schritt

Wenn die Token-Konsistenz steht, kannst du als nächstes ein **automatisches Layout-Patterning** einbauen:

`Header → Hero → Trust → Services → Benefits → Testimonials → FAQ → CTA → Footer`

Das verbessert die Qualität der generierten Landingpages stark, ohne manuelles Fine-Tuning.
