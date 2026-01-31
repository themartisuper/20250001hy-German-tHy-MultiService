// Описания для каждой услуги (service)
// Ключ — значение из data-value (например, "Fahrzeugüberführung")
// Значение — массив из 1-3 строк (будет <p> на каждую строку)

export const serviceDescriptions = {
  // Gruppe 1: Transport & Logistik
  "Fahrzeugüberführung": [
    /*"Kurzstrecke (50-150 km): 1.40 €/km",
    "Mittelstrecke (150-500 km): 1.10 €/km",
    "Langstrecke (>500 km): 0.95 €/km" */
  ],
  "Kurierdienste (privat)": [
    /*"Kurierdienst bis 10 km: 32 €",
    "Kurierdienst 10-30 km: 55 €",
    "Kurierdienst 30-50 km: 85 €",
    "Kurierdienst 50-100 km: 130 €",
    "Kurierdienst >100 km: 1,40 €/km" */
  ],
  "Kurierdienste (gewerblich)": [
    /*"Kurierdienst bis 10 km: 40 €",
    "Kurierdienst 10-30 km: 65 €",
    "Kurierdienst 30-50 km: 105 €",
    "Kurierdienst 50-100 km: 155 €",
    "Kurierdienst >100 km: 1,60 €/km" */
  ],
  "Lieferant": [
    /*"Fahrer ohne Auto: 20 € / Stunde",
    "Fahrer mit Auto: 26 € / Stunde"*/
  ],
  "Möbeltransport / Umzugshilfe": [ // отключено 01.01.2026
    "Sicherer Transport von Möbeln und Umzugsgütern.",
    "Abbau, Aufbau und Verpackung nach Bedarf.",
    "Erfahrenes Team sorgt für reibungslosen Ablauf."
  ],
  "Tragehilfe": [
    /*"Tragehilfe Kühlschrank / Waschmaschine: 35 € pro Stück",
    "Möbelstücke (Schrank, Sofa etc.): 25 € pro Stück",
    "Kartons / kleine Gegenstände (bis 25 kg): 4 € pro Stück",
    "Sperrige / schwere Gegenstände (>50 kg oder >2m): 55 € pro Stück",
    "Stundenbasis (bei gemischten Arbeiten): 28 €/h pro Helfer"*/
  ],
  "Zum Flughafen hin fahren": [
    /*"bis 30 km: 40 €",
    "bis 50 km: 55 €",
    "bis 100 km: 80 €",
    "bis 150 km: 105 €",
    "bis 200 km: 135 €",
    "bis 300 km: 185 €"*/
  ],
  "Zum Flughafen hin-zurück fahren": [
    /*"bis 30 km: 65 €",
    "bis 50 km: 95 €",
    "bis 100 km: 145 €",
    "bis 150 km: 195 €",
    "bis 200 km: 255 €",
    "bis 300 km: 355 €"*/
  ],

  "Hausverteilungsservice": [
    /*"🚚 1) Abholung der Materialien (falls der Kunde sie nicht bringt)",
    "Abholpauschalen:",
    "• Innerhalb 10 km: 10 €",
    "• 10-20 km: 20 €",
    "• 20-40 km: 35 €",
    "• Über 40 km: 0,80 € / km",
    "Bei Auftrag von Abholung + Verteilung automatisch -10 % Kombi-Rabatt",
    "⸻",
    "🏠 2) Zustellung & Verteilung an Haushalte",
    "Grundpreise pro Haushalt:",
    "• Leicht (bis 100g): 0,20 € / Haushalt",
    "• Mittel (100-300g): 0,25 € / Haushalt",
    "• Schwer (300g-1 kg): 0,35 € / Haushalt",
    "Mengenpakete:",
    "• 1.000 Haushalte: ab 180 €",
    "• 5.000 Haushalte: ab 850 €",
    "• 10.000 Haushalte: ab 1.600 €"*/
  ],

  // 🟦 Gruppe 2: Reinigung & Pflege
  "Auto reinigen (privat)": [
    /*"Außenreinigung Handwäsche (inkl. Felgen & Trocknen): 32 €",
    "Premium Außen (Handwäsche + Lackpflege + Wachs): 65 €",
    "Innenreinigung Basis (Staubsaugen, Cockpit, Scheiben): 42 €",
    "Innen Komplett (Polster, Kofferraum, Detail): 85 €",
    "Standard Paket (Außen Handwäsche + Innen Basis): 75 €",
    "Premium Paket (Außen Premium + Innen Komplett): 149 €"*/
  ],
  "Auto reinigen (gewerblich)": [
    /*"Außenreinigung Handwäsche (inkl. Felgen & Trocknen): 40 €",
    "Premium Außen (Handwäsche + Lackpflege + Wachs): 80 €",
    "Innenreinigung Basis (Staubsaugen, Cockpit, Scheiben): 52 €",
    "Innen Komplett (Polster, Kofferraum, Detail): 105 €",
    "Standard Paket (Außen Handwäsche + Innen Basis): 90 €",
    "Premium Paket (Außen Premium + Innen Komplett): 179 €"*/
  ],
  "Büroreinigung": [
    "Regelmäßige Reinigung von Arbeitsplätzen, Böden und Sanitäranlagen.",
    "Flexible Zeitpläne nach Bürozeiten.",
    "Verwendung umweltfreundlicher Reinigungsmittel."
  ],
  "Dachhaut/Dachziegel reinigen": [
    /*"Grundpreise (Privatkunden):",
    "Dachreinigung Standard: 11 € / m²",
    "Dachreinigung stark verschmutzt (z.B. Moos/Algen): 13 € / m²",
    "Carport/Garage Reinigung: ab 280 € pauschal",
    " ",
    "Grundpreise (Gewerbekunden, z.B. Firmengebäude):",
    "Dachreinigung Standard: 13 € / m²",
    "Dachreinigung stark verschmutzt (z.B. Moos/Algen): 16 € / m²",
    "Carport/Garage Reinigung: ab 350 € pauschal"*/
  ],
  "Endreinigung / Bauendreinigung": [
    "Gründliche Reinigung nach Bau- oder Renovierungsarbeiten.",
    "Entfernung von Staub, Farbresten und Bauschutt.",
    "Bereitstellung von professionellen Reinigungsmitteln und Werkzeugen."
  ],
  "Fassadenreinigung (Schimmel-, Algen- & Moosentfernung)": [
    /*"Grundpreise (Privatkunden):",
    "Fassadenreinigung Standard: 11 € / m²",
    "Fassadenreinigung stark befallen (z.B. Schimmel/Algen): 16 € / m²",
    " ",
    "Grundpreise (Gewerbekunden, z.B. Mehrfamilienhäuser):",
    "Fassadenreinigung Standard: 13 € / m²",
    "Fassadenreinigung stark befallen (z.B. Schimmel/Algen): 19 € / m²"*/
  ],
  "Fensterreinigung": [
    "Streifenfreie Reinigung von Fenstern innen und außen.",
    "Optional inkl. Rahmen- und Fensterbankreinigung.",
    "Schnell, zuverlässig und termingerecht."
  ],
  "Fliesen Reiniger": [
    /*"Grundpreise (Privatkunden):",
    "Bodenfliesen (normale Flächen): 5 €/m²",
    "Wandfliesen (z. B. Küche, Bad, Spritzschutz): 6 €/m²",
    "Fugenreinigung (intensiv / Schimmelentfernung): 8 €/m²",
    "⸻",
    "💼 Gewerbliche Flächen / stark frequentierte Bereiche:",
    "9 €/m² oder 38 €/h"*/
  ],
  "Lauabholung": [
    /*"Grundpreise (Privatkunden):",
    "Laubentfernung klein (bis 50 m²): 28 € / Einsatz",
    "Laubentfernung mittel (50–150 m²): 48 € / Einsatz",
    "Laubentfernung groß (>150 m²): 95 € / Einsatz",
    "Stundenpreis: 42 € / Stunde",
    "Saisonvertrag EFH (Herbst, inkl. 5 Einsätze): ab 120 €",
    "Saisonvertrag MFH / kleine Firma: ab 250 €",
    " ",
    "Grundpreise (Gewerbekunden, z.B. Firmengelände):",
    "Laubentfernung klein (bis 50 m²): 35 € / Einsatz",
    "Laubentfernung mittel (50–150 m²): 60 € / Einsatz",
    "Laubentfernung groß (>150 m²): 120 € / Einsatz",
    "Stundenpreis: 50 € / Stunde",
    "Saisonvertrag EFH (Herbst, inkl. 5 Einsätze): ab 150 €",
    "Saisonvertrag MFH / kleine Firma: ab 300 €"*/
  ],
  "Haushaltreinigung": [
    "Regelmäßige oder einmalige Reinigung von Wohnräumen.",
    "Staubsaugen, Wischen, Abstauben und Oberflächenpflege.",
    "Individuelle Abstimmung nach Kundenwunsch."
  ],
  "Schneeräumung": [
    /*"Grundpreise (Privatkunden):",
    "Schneeräumung klein (bis 50 m²): 28 € / Einsatz",
    "Schneeräumung mittel (50–150 m²): 48 € / Einsatz",
    "Schneeräumung groß (>150 m²): 95 € / Einsatz",
    "Stundenpreis: 42 € / Stunde",
    "Saisonvertrag EFH (Dez–März, inkl. Räumen & Streuen): ab 280 €",
    "Saisonvertrag MFH / klein Firma: ab 550 €",
    " ",
    "Grundpreise (Gewerbekunden, z.B. Firmenparkplatz):",
    "Schneeräumung klein (bis 50 m²): 35 € / Einsatz",
    "Schneeräumung mittel (50–150 m²): 60 € / Einsatz",
    "Schneeräumung groß (>150 m²): 120 € / Einsatz",
    "Stundenpreis: 50 € / Stunde",
    "Saisonvertrag EFH (Dez–März, inkl. Räumen & Streuen): ab 350 €",
    "Saisonvertrag MFH / klein Firma: ab 650 €"*/
  ],
  "Streudienst": [
    /*"Grundpreise (Privatkunden):",
    "Streudienst klein (bis 50 m²): 12 € / Einsatz",
    "Streudienst mittel (50–150 m²): 22 € / Einsatz",
    "Streudienst groß (>150 m²): 45 € / Einsatz",
    "Stundenpreis: 32 € / Stunde",
    "Saisonvertrag EFH (Dez–März, inkl. Räumen & Streuen): ab 120 €",
    "Saisonvertrag MFH / kleine Firma: ab 250 €",
    " ",
    "Grundpreise (Gewerbekunden, z.B. Firmenflächen):",
    "Streudienst klein (bis 50 m²): 15 € / Einsatz",
    "Streudienst mittel (50–150 m²): 28 € / Einsatz",
    "Streudienst groß (>150 m²): 55 € / Einsatz",
    "Stundenpreis: 40 € / Stunde",
    "Saisonvertrag EFH (Dez–März, inkl. Räumen & Streuen): ab 150 €",
    "Saisonvertrag MFH / kleine Firma: ab 300 €"*/
  ],
  "Teppichreinigung- und Polster-/Sofareinigung": [
    /*"Grundpreise (Privatkunden):",
    "Teppich Standardreinigung (Staubsaugen + Fleckenentfernung): 6 €/m²",
    "Teppich Tiefenreinigung / Intensive: 10 €/m²",
    "Sofa 2-Sitzer: 55 €",
    "Sofa 3-Sitzer: 85 €",
    "Ecksofa / Großsofa: 130 €",
    "⸻",
    "Gewerbliche Kunden (Büro/Hotel):",
    "Teppich: 8 €/m² (Standard) oder 12 €/m² (Intensiv)",
    "Sofas: +20 % auf Privatpreise (z.B. 3-Sitzer: 102 €)"*/
  ],
  "Eis und Schneebeseitigung am Auto": [
    /*"Grundpreise (Privatkunden):",
    "Schneebeseitigung + Enteisung Kleinwagen: 11 €",
    "Schneebeseitigung + Enteisung SUV/Kombi: 16 €",
    "Schneebeseitigung + Enteisung Transporter: 22 €",
    " ",
    "Grundpreise (Gewerbekunden, z.B. Firmenflotten):",
    "Schneebeseitigung + Enteisung Kleinwagen: 14 €",
    "Schneebeseitigung + Enteisung SUV/Kombi: 20 €",
    "Schneebeseitigung + Enteisung Transporter: 28 €"*/
  ],

  // 🟧 Gruppe 3: Haus & Garten
  "Gartenbewässerung": [
    /*"Grundpreise (Privatkunden / Privatgärten):",
    "Handbewässerung kleine Fläche (<100 m²): 22 € / Einsatz",
    "Handbewässerung mittlere Fläche (100–500 m²): 45 € / Einsatz",
    "Handbewässerung große Fläche (>500 m²): 0,18 €/m²",
    "Kontrolle & Inbetriebnahme Sprinkler: 35 € / Einsatz",
    "Installation kleiner Bewässerungssysteme: 60 € / System",
    " ",
    "Grundpreise (Gewerbekunden / Firmengelände):",
    "Handbewässerung kleine Fläche (<100 m²): 28 € / Einsatz",
    "Handbewässerung mittlere Fläche (100–500 m²): 55 € / Einsatz",
    "Handbewässerung große Fläche (>500 m²): 0,22 €/m²",
    "Kontrolle & Inbetriebnahme Sprinkler: 45 € / Einsatz",
    "Installation kleiner Bewässerungssysteme: 80 € / System"*/
  ],
  "Gartenpflege": [
    /*"Grundpreise (Privatkunden / Privatgärten pro Einsatz):",
    "Kleine Gärten bis 200 m²: 35 €",
    "Mittlere Gärten 200-500 m²: 60€",
    "Große Gärten 500-1000 m²: 90€",
    " ",
    "Grundpreise (Gewerbekunden / Firmengelände pro Einsatz):",
    "Kleine Gärten bis 200 m²: 45€",
    "Mittlere Gärten 200-500 m²: 75€",
    "Große Gärten 500-1000 m²: 110€",
    "⸻",
    "Einzelne Leistungen (falls nicht im Paket):",
    "Rasenmähen: 35-95 € (je nach Fläche)",
    "Sträucherschnitt: 7-28 € / Strauch oder 6-15 €/lfm Hecke",
    "Unkrautentfernung: 22 €/h oder 0,85 €/m²",
    "Laub entfernen / Gartenabfälle: 25-45 € pro Einsatz",
    "Bewässerung (Hand/Sprinkler): 22-45 € pro Einsatz",
    "Düngen / Pflegebehandlung: 20-35 € pro Einsatz"*/
  ],
  "Haushüter": [
    /*"Grundpreise (Privatkunden):",
    "Hauskontrolle (Post, Blumen etc.): 32 € / Besuch",
    "Tägliche Kontrolle 1 Woche (7 Besuche): 200 € (Paketpreis)",
    "Übernachtung im Haus (inkl. Anwesenheit): 60 € / Nacht",
    "Grundpreise (Gewerbekunden, z.B. Ferienwohnungen):",
    "Hauskontrolle (Post, Blumen etc.): 40 € / Besuch",
    "Tägliche Kontrolle 1 Woche (7 Besuche): 250 € (Paketpreis)",
    "Übernachtung im Haus (inkl. Anwesenheit): 75 € / Nacht",*/
  ],
  "Kleinreparaturen (ohne Handwerksplicht)": [
    /*"Grundpreise (Privatkunden):",
    "Kleinreparaturen pro Stunde: 32 €/h",
    "Möbel nachziehen / kleine Reparatur: 22 €",
    "Bilder / Spiegel aufhängen: 16 € / Stück",
    "Silikon erneuern (Bad, Küche): 38 €",
    "Lampen / Vorhang / kleine Montage: 28 € / Stück",
    " ",
    "Grundpreise (Gewerbekunden):",
    "Kleinreparaturen pro Stunde: 40 €/h",
    "Möbel nachziehen / kleine Reparatur: 28 €",
    "Bilder / Spiegel aufhängen: 20 € / Stück",
    "Silikon erneuern (Bad, Küche): 48 €",
    "Lampen / Vorhang / kleine Montage: 35 € / Stück"*/
  ],
  "Rasenmäher": [
    /*"Grundpreise (Privatkunden / Privatgärten pro Einsatz):",
    "Rasenmähen bis 200 m²: 35 €",
    "Rasenmähen bis 500 m²: 60 €",
    "Rasenmähen bis 1000 m²: 95 €",
    "Flächen >1000 m²: ab 0,15 €/m²",
    " ",
    "Grundpreise (Gewerbekunden / Firmengelände pro Einsatz):",
    "Rasenmähen bis 200 m²: 45 €",
    "Rasenmähen bis 500 m²: 80 €",
    "Rasenmähen bis 1000 m²: 120 €",
    "Flächen >1000 m²: ab 0,20 €/m²"*/
  ],
  "Regale und Gardinenmontage": [
    /*"Grundpreise (Privatkunden):",
    "Einfaches Wandregal: 32 € / Stück",
    "Komplette Regalsysteme: 65 € / Stück",
    "Gardinen / Vorhang standard: 22 € / Stück",
    "Gardinen-Doppelstange / Schiene: 45 € / Stück",
    " ",
    "Grundpreise (Gewerbekunden):",
    "Einfaches Wandregal: 40 € / Stück",
    "Komplette Regalsysteme: 80 € / Stück",
    "Gardinen / Vorhang standard: 28 € / Stück",
    "Gardinen-Doppelstange / Schiene: 55 € / Stück"*/
  ],
  "Sträucherschnitt": [
    /*"Grundpreise (Privatkunden / Privatgärten):",
    "Kleiner Strauch (<1,5 m): 7 € / Strauch",
    "Mittlerer Strauch (1,5–2,5 m): 14 € / Strauch",
    "Großer Strauch (>2,5 m): 28 € / Strauch",
    "Hecken niedrig (<1,5 m): 6 €/lfm",
    "Hecken hoch (1,5–3 m): 9 €/lfm",
    "Sehr hohe/dichte Hecken (>3 m): 15 €/lfm",
    " ",
    "Grundpreise (Gewerbekunden / Firmengelände):",
    "Kleiner Strauch (<1,5 m): 9 € / Strauch",
    "Mittlerer Strauch (1,5–2,5 m): 18 € / Strauch",
    "Großer Strauch (>2,5 m): 35 € / Strauch",
    "Hecken niedrig (<1,5 m): 8 €/lfm",
    "Hecken hoch (1,5–3 m): 12 €/lfm",
    "Sehr hohe/dichte Hecken (>3 m): 18 €/lfm",*/
  ],
  "Unkrautentfernung": [
    /*"Grundpreise (Privatkunden / Privatgärten):",
    "Kleine Fläche bis 50 m²: 35 € / Einsatz",
    "Mittlere Fläche 50–100 m²: 55 € / Einsatz",
    "Größere Fläche >100 m²: 0,85 €/m²",
    "Handarbeit / Beete: 22 €/h",
    " ",
    "Grundpreise (Gewerbekunden / Firmengelände):",
    "Kleine Fläche bis 50 m²: 45 € / Einsatz",
    "Mittlere Fläche 50–100 m²: 70 € / Einsatz",
    "Größere Fläche >100 m²: 1,10 €/m²",
    "Handarbeit / Beete: 30 €/h"*/
  ],
  "Weihnachtsbeleuchtung Montage": [
    /*"Grundpreise (Privatkunden):",
    "Pauschale bis 10 m Kette: 28 €",
    "Pauschale 10–30 m: 48 €",
    "Pauschale 30–50 m: 68 €",
    "Pauschale >50 m: 105 €",
    " ",
    "Grundpreise (Gewerbekunden, z.B. Geschäfte):",
    "Pauschale bis 10 m Kette: 35 €",
    "Pauschale 10–30 m: 58 €",
    "Pauschale 30–50 m: 82 €",
    "Pauschale >50 m: 125 €"*/
  ],

  // 🟨 Persönliche Dienste & Events
  "Einkaufshilfe": [
    /*"Grundpreise:",
    "Einkaufshilfe (Begleitung): 22 € / Stunde",
    "Einkauf erledigen (ohne Kunde): 28 € / Stunde",
    "Kleiner Einkauf (bis 1 h): 28 € pauschal",
    "Großer Einkauf (bis 2 h): 48 € pauschal"*/
  ],
  "Einzelhandelskaufmann": [
    /*"Grundpreise:",
    "Normale Aushilfe / Regalpflege / Kasse: 18 € / Stunde",
    "Erfahrene Kraft / Fachbereich: 24 € / Stunde"*/
  ],
  "Eventhilfe / Servicekraft": [
    "Unterstützung bei Veranstaltungen, Catering oder Auf-/Abbau.",
    "Freundlicher Service für Gäste und Veranstalter.",
    "Kurzfristige Einsätze oder regelmäßige Events möglich."
  ],
  "Hundeausführen / Gassi-Service": [
    /*"Grundpreise:",
    "Gassi-Service 30 Min (Einzelhund): 16 € / Einsatz",
    "Gassi-Service 60 Min (Einzelhund): 22 € / Einsatz",
    "Gassi-Service 90 Min (Einzelhund): 32 € / Einsatz",
    "Gruppen-Gassi 60 Min (2-4 Hunde): 16 € / Hund",
    "Gruppen-Gassi 90 Min (2-4 Hunde): 24 € / Hund"*/
  ],
  "Seniorenbetreuung (ohne Pflege)": [
    /*"Grundpreise:",
    "Seniorenbegleitung (Alltagshilfe): 24 € / Stunde",
    "Spaziergang / Gesellschaft: 24 € / Stunde",
    "Einkaufsbegleitung: 27 € / Stunde",
    "Arzt-/Terminbegleitung: 27 € / Stunde",
    "Nachtbegleitung (20–06 Uhr): 95 € pauschal"*/
  ],
  "Tierbetreuung": [
    /*"Grundpreise:",
    "Hund Gassi-Service 30 Min: 16 € / Einsatz",
    "Hund Gassi-Service 60 Min: 22 € / Einsatz",
    "Hund Tagesbetreuung: 32 € / Tag",
    "Hund Übernachtung (24h): 100 € / Nacht",
    "Katzenbetreuung 1x täglich: 16 € / Tag (1 Besuch)",
    "Katzenbetreuung 2x täglich: 28 € / Tag (2 Besuche)",
    "Kleintierbetreuung (Füttern, Sauber machen): 13 € / Besuch"*/
  ]
};
