/**
 * engine/defaults.js
 *
 * Default-Werte für alle Section-Typen.
 * Parser und Section Composer benutzen diese als Fallback.
 */

// ── Default Areas (Fibonacci-Gewichte) ───────────────────────────────────────

export const DEFAULT_AREAS = {
  header:       { content: 1 },
  hero:         { content: 8, image: 5 },
  trust:        { content: 1 },
  authority:    { content: 1 },
  services:     { grid: 3 },
  benefits:     { list: 3 },
  process:      { grid: 2 },
  team:         { grid: 3 },
  gallery:      { grid: 5 },
  testimonials: { grid: 3 },
  faq:          { content: 1 },
  cta:          { content: 1 },
  footer:       { content: 1 },
  contact:      { content: 1 },
  pricing:      { grid: 3 },
  custom:       { content: 1 },
}

// ── Default Data (Platzhalter-Inhalte) ──────────────────────────────────────

export const DEFAULT_DATA = {
  header:       { title: "Unternehmen", logoText: "", logoImage: "", navItems: [], ctaText: "", ctaUrl: "#kontakt" },
  hero:         { title: "Willkommen bei uns", subtitle: "Wir bieten professionelle Dienstleistungen für Ihren Erfolg.", label: "Ihr Partner", ctaPrimary: "Kontakt aufnehmen", ctaPrimaryUrl: "#kontakt", ctaSecondary: "Mehr erfahren", ctaSecondaryUrl: "#leistungen" },
  trust:        { title: "Zahlen, die überzeugen" },
  authority:    { title: "Unsere Expertise", body: "Mit langjähriger Erfahrung und fundiertem Fachwissen stehen wir Ihnen als verlässlicher Partner zur Seite." },
  services:     { label: "Leistungen", title: "Unsere Dienstleistungen", subtitle: "Massgeschneiderte Lösungen für Ihre Anforderungen." },
  benefits:     { label: "Vorteile",   title: "Ihre Vorteile", subtitle: "Warum Sie sich für uns entscheiden sollten." },
  process:      { label: "Ablauf",     title: "So arbeiten wir" },
  team:         { label: "Team",       title: "Unser Team" },
  gallery:      { label: "Galerie",    title: "Einblicke" },
  testimonials: { label: "Stimmen",    title: "Das sagen unsere Kunden" },
  faq:          { label: "FAQ",        title: "Häufige Fragen" },
  cta:          { title: "Bereit für den nächsten Schritt?", subtitle: "Kontaktieren Sie uns für eine unverbindliche Beratung.", ctaPrimary: "Jetzt anfragen", ctaPrimaryUrl: "#kontakt" },
  footer:       { title: "" },
  contact:      { label: "Kontakt",    title: "Kontaktieren Sie uns" },
  pricing:      { label: "Preise",     title: "Unsere Pakete" },
  custom:       {},
}

// ── Default Items (für Listen-Sections) ─────────────────────────────────────

export const DEFAULT_ITEMS = {
  trust: [
    { stat: "15+",  label: "Jahre Erfahrung" },
    { stat: "500+", label: "Zufriedene Kunden" },
    { stat: "98%",  label: "Weiterempfehlung" },
  ],
  services: [
    { icon: "📋", title: "Beratung",     body: "Individuelle Beratung, abgestimmt auf Ihre Bedürfnisse." },
    { icon: "⚙️", title: "Umsetzung",    body: "Professionelle Umsetzung mit höchsten Qualitätsstandards." },
    { icon: "📈", title: "Optimierung",   body: "Kontinuierliche Verbesserung für nachhaltigen Erfolg." },
  ],
  benefits: [
    { icon: "✓", title: "Erfahrung",      body: "Langjährige Expertise in der Branche." },
    { icon: "✓", title: "Qualität",        body: "Höchste Standards bei jedem Projekt." },
    { icon: "✓", title: "Persönlich",      body: "Direkte Ansprechpartner für Ihr Anliegen." },
  ],
  process: [
    { step: "1", title: "Erstgespräch",    body: "Wir lernen Ihre Anforderungen kennen." },
    { step: "2", title: "Konzept",         body: "Wir erarbeiten eine massgeschneiderte Lösung." },
    { step: "3", title: "Umsetzung",       body: "Professionelle Realisierung Ihres Projekts." },
  ],
  testimonials: [
    { name: "Anna Müller",   role: "Geschäftsführerin", company: "Müller AG",  rating: 5, body: "Hervorragende Zusammenarbeit und erstklassige Ergebnisse." },
    { name: "Thomas Keller", role: "Inhaber",          company: "Keller GmbH", rating: 5, body: "Professionell, zuverlässig und immer erreichbar." },
  ],
  faq: [
    { question: "Wie läuft eine Zusammenarbeit ab?",   answer: "Nach einem unverbindlichen Erstgespräch erstellen wir ein massgeschneidertes Angebot." },
    { question: "Welche Kosten entstehen?",            answer: "Die Kosten richten sich nach dem Umfang Ihres Projekts. Kontaktieren Sie uns für ein individuelles Angebot." },
    { question: "Wie lange dauert ein typisches Projekt?", answer: "Die Dauer hängt von der Komplexität ab. Wir besprechen den Zeitrahmen im Erstgespräch." },
  ],
  team: [
    { title: "Max Muster",     body: "Geschäftsführer" },
    { title: "Lisa Beispiel",  body: "Projektleitung" },
    { title: "Peter Vorlage",  body: "Fachexperte" },
  ],
  pricing: [
    { title: "Starter",       body: "Ideal für kleine Projekte." },
    { title: "Professional",  body: "Für wachsende Unternehmen." },
    { title: "Enterprise",    body: "Massgeschneiderte Lösungen." },
  ],
}

// ── Industry-specific Content ───────────────────────────────────────────────

export const INDUSTRY_CONTENT = {
  treuhand: {
    hero:         { title: "Ihre Treuhand mit Weitblick", subtitle: "Buchhaltung, Steuern und Beratung aus einer Hand.", label: "Treuhand" },
    trust:        { title: "Vertrauen durch Kompetenz" },
    services:     { label: "Leistungen", title: "Unsere Treuhand-Dienstleistungen", subtitle: "Von der Buchführung bis zur Steueroptimierung." },
    process:      { label: "Ablauf", title: "Ihr Weg zur optimalen Treuhandlösung" },
    faq:          { label: "FAQ", title: "Häufige Fragen zur Treuhand" },
    cta:          { title: "Kostenlose Erstberatung", subtitle: "Vereinbaren Sie ein unverbindliches Gespräch mit unseren Treuhand-Experten." },
    _items: {
      trust:    [{ stat: "20+", label: "Jahre Erfahrung" }, { stat: "800+", label: "Mandanten" }, { stat: "CHF 2 Mrd.", label: "Verwaltetes Vermögen" }],
      services: [{ icon: "📊", title: "Buchhaltung", body: "Professionelle Buchführung und Jahresabschlüsse." }, { icon: "💰", title: "Steuern", body: "Steuerberatung und -optimierung für Unternehmen und Privatpersonen." }, { icon: "📋", title: "Beratung", body: "Strategische Unternehmensberatung und Nachfolgeplanung." }],
      faq:      [{ question: "Welche Buchhaltungssoftware verwenden Sie?", answer: "Wir arbeiten mit allen gängigen Systemen und beraten Sie bei der Auswahl." }, { question: "Wie oft sollte die Buchhaltung aktualisiert werden?", answer: "Wir empfehlen eine monatliche Aktualisierung für optimale Übersicht." }],
    },
  },
  kanzlei: {
    hero:         { title: "Recht. Klar. Kompetent.", subtitle: "Ihre Kanzlei für Wirtschaftsrecht, Vertragsrecht und Beratung.", label: "Kanzlei" },
    trust:        { title: "Erfolge, die zählen" },
    authority:    { title: "Unsere Rechtsexpertise", body: "Fundierte juristische Beratung mit klarer Sprache und praxisnahen Lösungen." },
    services:     { label: "Rechtsgebiete", title: "Unsere Fachgebiete", subtitle: "Kompetente Beratung in allen relevanten Rechtsbereichen." },
    faq:          { label: "FAQ", title: "Häufige Fragen" },
    cta:          { title: "Erstberatung vereinbaren", subtitle: "Wir nehmen uns Zeit für Ihr Anliegen." },
    _items: {
      trust:    [{ stat: "1'200+", label: "Abgeschlossene Fälle" }, { stat: "25+", label: "Jahre Erfahrung" }, { stat: "99%", label: "Erfolgsquote" }],
      services: [{ icon: "⚖️", title: "Vertragsrecht", body: "Vertragsgestaltung, -prüfung und Verhandlung." }, { icon: "🏢", title: "Wirtschaftsrecht", body: "Beratung bei Gründung, M&A und Compliance." }, { icon: "👥", title: "Arbeitsrecht", body: "Vertretung von Arbeitgebern und Arbeitnehmern." }],
      faq:      [{ question: "Wie hoch sind Ihre Honorare?", answer: "Wir rechnen transparent nach Aufwand ab. Im Erstgespräch besprechen wir die voraussichtlichen Kosten." }, { question: "Übernehmen Sie auch Prozessvertretung?", answer: "Ja, wir vertreten Sie vor allen Instanzen." }],
    },
  },
  it: {
    hero:         { title: "IT-Lösungen, die funktionieren", subtitle: "Software, Cloud und Infrastruktur für Ihr Unternehmen.", label: "IT-Services" },
    services:     { label: "Services", title: "Unsere IT-Dienstleistungen", subtitle: "Von der Beratung bis zum laufenden Betrieb." },
    benefits:     { label: "Vorteile", title: "Warum unsere IT?", subtitle: "Technologie, die Ihr Business voranbringt." },
    cta:          { title: "IT-Beratung starten", subtitle: "Lassen Sie uns gemeinsam Ihre IT-Infrastruktur optimieren." },
    _items: {
      services:     [{ icon: "☁️", title: "Cloud Services", body: "Migration, Betrieb und Optimierung Ihrer Cloud-Infrastruktur." }, { icon: "🔒", title: "IT-Security", body: "Schutz Ihrer Systeme und Daten vor Bedrohungen." }, { icon: "💻", title: "Software-Entwicklung", body: "Individuelle Softwarelösungen nach Mass." }],
      testimonials: [{ name: "Stefan Brunner", role: "CTO", company: "TechCorp AG", rating: 5, body: "Zuverlässiger IT-Partner mit schnellen Reaktionszeiten." }, { name: "Maria Hofmann", role: "CEO", company: "Digital GmbH", rating: 5, body: "Hat unsere IT-Infrastruktur komplett modernisiert." }],
    },
  },
  saas: {
    hero:         { title: "Die Plattform für Ihren Erfolg", subtitle: "Einfach. Skalierbar. Sicher.", label: "SaaS-Lösung" },
    authority:    { title: "Warum unsere Plattform?", body: "Eine leistungsstarke Software-Lösung, die mit Ihrem Unternehmen wächst." },
    services:     { label: "Features", title: "Leistungsstarke Funktionen", subtitle: "Alles, was Sie für effizientes Arbeiten brauchen." },
    faq:          { label: "FAQ", title: "Fragen zu unserer Software" },
    cta:          { title: "Jetzt kostenlos testen", subtitle: "14 Tage kostenlos. Keine Kreditkarte erforderlich.", ctaPrimary: "Kostenlos starten", ctaPrimaryUrl: "#signup" },
    _items: {
      services: [{ icon: "📊", title: "Dashboard", body: "Alle wichtigen Kennzahlen auf einen Blick." }, { icon: "🔄", title: "Automatisierung", body: "Wiederkehrende Aufgaben automatisch erledigen." }, { icon: "🔗", title: "Integrationen", body: "Nahtlose Anbindung an Ihre bestehenden Tools." }],
      pricing:  [{ title: "Free", body: "Bis 3 Benutzer, grundlegende Funktionen." }, { title: "Pro", body: "Unbegrenzte Benutzer, alle Funktionen." }, { title: "Enterprise", body: "Dedizierte Infrastruktur und Support." }],
    },
  },
  handwerk: {
    hero:         { title: "Handwerk mit Leidenschaft", subtitle: "Qualität und Zuverlässigkeit seit Generationen.", label: "Meisterbetrieb" },
    trust:        { title: "Unser Qualitätsversprechen" },
    services:     { label: "Leistungen", title: "Unsere Handwerksleistungen", subtitle: "Vom kleinen Auftrag bis zum Grossprojekt." },
    process:      { label: "Ablauf", title: "Von der Anfrage zur Umsetzung" },
    cta:          { title: "Offerte anfordern", subtitle: "Kostenlose und unverbindliche Offerte innert 48 Stunden." },
    _items: {
      trust:   [{ stat: "30+", label: "Jahre Erfahrung" }, { stat: "2'000+", label: "Projekte" }, { stat: "100%", label: "Meisterqualität" }],
      process: [{ step: "1", title: "Anfrage", body: "Beschreiben Sie Ihr Vorhaben." }, { step: "2", title: "Besichtigung", body: "Wir kommen vor Ort und beraten Sie." }, { step: "3", title: "Offerte", body: "Sie erhalten eine transparente Offerte." }, { step: "4", title: "Umsetzung", body: "Termingerechte und saubere Ausführung." }],
    },
  },
  restaurant: {
    hero:         { title: "Willkommen in unserem Restaurant", subtitle: "Frische Zutaten, kreative Küche, unvergessliche Momente.", label: "Gastronomie" },
    services:     { label: "Angebot", title: "Unsere Küche", subtitle: "Saisonal, regional und mit Liebe zubereitet." },
    cta:          { title: "Tisch reservieren", subtitle: "Geniessen Sie einen besonderen Abend bei uns.", ctaPrimary: "Reservieren", ctaPrimaryUrl: "#reservierung" },
    _items: {
      services:     [{ icon: "🍽️", title: "À la carte", body: "Saisonale Gerichte aus regionalen Zutaten." }, { icon: "🥂", title: "Events", body: "Private Anlässe und Firmenevents." }, { icon: "🚗", title: "Catering", body: "Kulinarische Erlebnisse an Ihrem Wunschort." }],
      testimonials: [{ name: "Sandra Weber", role: "Stammgast", rating: 5, body: "Die beste Küche der Stadt! Immer wieder ein Genuss." }, { name: "Hans Berger", role: "Feinschmecker", rating: 5, body: "Hervorragende Qualität und ein wunderbares Ambiente." }],
    },
  },
  medizin: {
    hero:         { title: "Ihre Gesundheit in besten Händen", subtitle: "Moderne Medizin mit persönlicher Betreuung.", label: "Praxis" },
    trust:        { title: "Kompetenz und Vertrauen" },
    services:     { label: "Angebot", title: "Unsere medizinischen Leistungen", subtitle: "Umfassende Betreuung für Ihre Gesundheit." },
    faq:          { label: "FAQ", title: "Häufige Patientenfragen" },
    cta:          { title: "Termin vereinbaren", subtitle: "Wir freuen uns auf Ihren Besuch.", ctaPrimary: "Termin buchen", ctaPrimaryUrl: "#termin" },
    _items: {
      trust:    [{ stat: "10'000+", label: "Patienten" }, { stat: "15+", label: "Fachärzte" }, { stat: "25+", label: "Jahre Erfahrung" }],
      services: [{ icon: "🩺", title: "Vorsorge", body: "Regelmässige Check-ups für Ihre Gesundheit." }, { icon: "💊", title: "Therapie", body: "Individuelle Behandlungspläne." }, { icon: "🏥", title: "Spezialisierung", body: "Fachärztliche Kompetenz in verschiedenen Bereichen." }],
    },
  },
  coaching: {
    hero:         { title: "Entfalten Sie Ihr Potenzial", subtitle: "Persönliches Coaching für beruflichen und privaten Erfolg.", label: "Coaching" },
    authority:    { title: "Mein Ansatz", body: "Mit erprobten Methoden und einfühlsamer Begleitung unterstütze ich Sie dabei, Ihre Ziele zu erreichen." },
    services:     { label: "Angebot", title: "Coaching-Angebote", subtitle: "Individuelle Begleitung für Ihre Entwicklung." },
    process:      { label: "Ablauf", title: "Ihr Coaching-Weg" },
    cta:          { title: "Kennenlerngespräch buchen", subtitle: "Der erste Schritt zu Ihrer Veränderung.", ctaPrimary: "Termin buchen", ctaPrimaryUrl: "#termin" },
    _items: {
      services:     [{ icon: "🎯", title: "Business Coaching", body: "Führungskompetenz und Karriereentwicklung." }, { icon: "🧠", title: "Life Coaching", body: "Klarheit und Balance im Leben finden." }, { icon: "👥", title: "Team Coaching", body: "Zusammenarbeit und Kommunikation stärken." }],
      process:      [{ step: "1", title: "Kennenlernen", body: "Kostenloses Erstgespräch." }, { step: "2", title: "Zieldefinition", body: "Gemeinsam Ihre Ziele klären." }, { step: "3", title: "Coaching-Sessions", body: "Regelmässige Begleitung." }, { step: "4", title: "Reflexion", body: "Erfolge feiern und nächste Schritte planen." }],
      testimonials: [{ name: "Julia Frei", role: "Unternehmerin", rating: 5, body: "Das Coaching hat mein Business auf ein neues Level gebracht." }, { name: "Marco Bianchi", role: "Teamleiter", rating: 5, body: "Endlich verstehe ich mein Team besser und kann es gezielt fördern." }],
    },
  },
  bildung: {
    hero:         { title: "Bildung, die bewegt", subtitle: "Innovative Lernkonzepte für Ihren Wissensvorsprung.", label: "Bildung" },
    services:     { label: "Angebot", title: "Unsere Bildungsangebote", subtitle: "Praxisnahe Weiterbildung für alle Stufen." },
    process:      { label: "Ablauf", title: "Ihr Lernweg" },
    faq:          { label: "FAQ", title: "Fragen zur Weiterbildung" },
    cta:          { title: "Jetzt anmelden", subtitle: "Starten Sie Ihre Weiterbildung noch heute.", ctaPrimary: "Kurs buchen", ctaPrimaryUrl: "#kurse" },
    _items: {
      services: [{ icon: "📚", title: "Kurse", body: "Praxisorientierte Weiterbildungskurse." }, { icon: "🎓", title: "Zertifikate", body: "Anerkannte Abschlüsse und Diplome." }, { icon: "💡", title: "Workshops", body: "Intensive Praxis-Workshops." }],
      process:  [{ step: "1", title: "Beratung", body: "Finden Sie den passenden Kurs." }, { step: "2", title: "Anmeldung", body: "Einfache Online-Anmeldung." }, { step: "3", title: "Lernen", body: "Interaktiver Unterricht mit Praxisbezug." }],
    },
  },
  immobilien: {
    hero:         { title: "Ihr Zuhause wartet", subtitle: "Immobilien kaufen, verkaufen und verwalten — mit Expertise.", label: "Immobilien" },
    services:     { label: "Services", title: "Unsere Immobilien-Dienstleistungen", subtitle: "Kompetente Begleitung bei jedem Schritt." },
    cta:          { title: "Beratungstermin vereinbaren", subtitle: "Profitieren Sie von unserer lokalen Marktkenntnis.", ctaPrimary: "Termin buchen", ctaPrimaryUrl: "#kontakt" },
    _items: {
      services:     [{ icon: "🏠", title: "Verkauf", body: "Professionelle Vermarktung Ihrer Immobilie." }, { icon: "🔑", title: "Vermietung", body: "Passende Mieter für Ihr Objekt finden." }, { icon: "📐", title: "Bewertung", body: "Marktgerechte Immobilienbewertung." }],
      testimonials: [{ name: "Ursula Schmid", role: "Eigentümerin", rating: 5, body: "Mein Haus wurde in Rekordzeit und über dem Schätzpreis verkauft." }, { name: "Beat Lehmann", role: "Investor", rating: 5, body: "Kompetente Beratung und ein Auge für gute Objekte." }],
    },
  },
  generic: {},
}

// ── Default Settings ──────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS = {
  header:       { background: "default", paddingTop: "none",  paddingBottom: "none" },
  hero:         { background: "default", paddingTop: "xl",    paddingBottom: "xl"   },
  trust:        { background: "alt",     paddingTop: "md",    paddingBottom: "md",   textAlign: "center" },
  authority:    { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  services:     { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  benefits:     { background: "alt",     paddingTop: "lg",    paddingBottom: "lg"   },
  process:      { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  team:         { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  gallery:      { background: "alt",     paddingTop: "lg",    paddingBottom: "lg"   },
  testimonials: { background: "alt",     paddingTop: "lg",    paddingBottom: "lg"   },
  faq:          { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  cta:          { background: "brand",   paddingTop: "xl",    paddingBottom: "xl",   textAlign: "center" },
  footer:       { background: "dark",    paddingTop: "lg",    paddingBottom: "lg"   },
  contact:      { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  pricing:      { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
  custom:       { background: "default", paddingTop: "lg",    paddingBottom: "lg"   },
}
