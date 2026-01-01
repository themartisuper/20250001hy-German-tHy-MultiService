// Описания для каждой услуги (service)
// Ключ — значение из data-value (например, "Fahrzeugüberführung")
// Значение — массив из 1-3 строк (будет <p> на каждую строку)

export const serviceDescriptions = {
  // Gruppe 1: Transport & Logistik
  "Fahrzeugüberführung": [
    "Kurzstrecke (50-150 km): 1.40 €/km",
    "Mittelstrecke (150-500 km): 1.10 €/km",
    "Langstrecke (>500 km): 0.95 €/km"
  ],
  "Kurierdienste (privat)": [
    "Kurierdienst bis 10 km: 32 €",
    "Kurierdienst 10-30 km: 55 €",
    "Kurierdienst 30-50 km: 85 €",
    "Kurierdienst 50-100 km: 130 €",
    "Kurierdienst >100 km: 1,40 €/km"
  ],
  "Kurierdienste (gewerblich)": [
    "Kurierdienst bis 10 km: 40 €",
    "Kurierdienst 10-30 km: 65 €",
    "Kurierdienst 30-50 km: 105 €",
    "Kurierdienst 50-100 km: 155 €",
    "Kurierdienst >100 km: 1,60 €/km"
  ],
  "Lieferant": [
    "Fahrer ohne Auto: 20 € / Stunde",
    "Fahrer mit Auto: 26 € / Stunde"
  ],
  "Möbeltransport / Umzugshilfe": [
    "Sicherer Transport von Möbeln und Umzugsgütern.",
    "Abbau, Aufbau und Verpackung nach Bedarf.",
    "Erfahrenes Team sorgt für reibungslosen Ablauf."
  ],
  "Tragehilfe": [
    "Unterstützung beim Tragen schwerer Gegenstände.",
    "Schonung Ihrer Gesundheit und Möbel.",
    "Kurzfristig buchbar für einzelne Transporte."
  ],
  "Zum Flughafen hin-zurück fahren": [
    "Komfortabler Transport zum/vom Flughafen.",
    "Pünktliche Abholung und flexible Buchungszeiten.",
    "Freundlicher Fahrer mit Ortskenntnis."
  ],

  // 🟦 Gruppe 2: Reinigung & Pflege
  "Auto reinigen (Innen und Außenbereich)": [
    "Gründliche Innen- und Außenreinigung Ihres Fahrzeugs.",
    "Pflege von Lack, Leder und Polstern.",
    "Optional mit Wachsbeschichtung oder Politur."
  ],
  "Büroreinigung": [
    "Regelmäßige Reinigung von Arbeitsplätzen, Böden und Sanitäranlagen.",
    "Flexible Zeitpläne nach Bürozeiten.",
    "Verwendung umweltfreundlicher Reinigungsmittel."
  ],
  "Dachhaut/Dachziegel reinigen": [
    "Entfernung von Moos, Algen und Schmutz von Dächern.",
    "Verlängert die Lebensdauer der Dachziegel.",
    "Professionelle Ausrüstung für sichere Reinigung."
  ],
  "Endreinigung / Bauendreinigung": [
    "Gründliche Reinigung nach Bau- oder Renovierungsarbeiten.",
    "Entfernung von Staub, Farbresten und Bauschutt.",
    "Bereitstellung von professionellen Reinigungsmitteln und Werkzeugen."
  ],
  "Fassadenreinigung (Schimmel-, Algen- & Moosentfernung)": [
    "Entfernt effektiv Schimmel, Algen und Moos von Fassaden.",
    "Schützt langfristig die Bausubstanz.",
    "Umweltfreundliche Reinigungsmittel und Verfahren."
  ],
  "Fensterreinigung": [
    "Streifenfreie Reinigung von Fenstern innen und außen.",
    "Optional inkl. Rahmen- und Fensterbankreinigung.",
    "Schnell, zuverlässig und termingerecht."
  ],
  "Fliesen Reiniger": [
    "Gründliche Reinigung und Pflege von Fliesenflächen.",
    "Entfernung von Kalk, Schmutz und Flecken.",
    "Verwendung spezieller, schonender Reinigungsmittel."
  ],
  "Lauabholung": [
    "Bequeme Abholung und Rückgabe Ihrer Wäsche.",
    "Schneller Service und flexible Termine.",
    "Professionelle Reinigung und Pflege der Textilien."
  ],
  "Haushaltreinigung": [
    "Regelmäßige oder einmalige Reinigung von Wohnräumen.",
    "Staubsaugen, Wischen, Abstauben und Oberflächenpflege.",
    "Individuelle Abstimmung nach Kundenwunsch."
  ],
  "Schneeräumung": [
    "Sicheres Freiräumen von Gehwegen, Einfahrten und Zufahrten.",
    "Verwendung von professionellem Räumgerät.",
    "Pünktlich und zuverlässig bei jedem Schneefall."
  ],
  "Streudienst": [
    "Streuen von Gehwegen, Einfahrten und Außenbereichen bei Eisglätte.",
    "Verwendung umweltfreundlicher Streumittel.",
    "Schnelle Reaktion bei akuten Gefahrenstellen."
  ],
  "Teppichreinigung- und Polster-/Sofareinigung": [
    "Professionelle Reinigung von Teppichen, Polstern und Sofas.",
    "Entfernt Flecken, Staub und unangenehme Gerüche.",
    "Schonende Behandlung für lange Lebensdauer der Textilien."
  ],
  "Eis und Schneebeseitigung am Auto": [
    "Schnelles Entfernen von Eis und Schnee von Fahrzeugen.",
    "Schonende Behandlung von Lack und Scheiben.",
    "Auf Wunsch auch Vorwärmen oder Enteisen der Scheiben."
  ],

  // 🟧 Gruppe 3: Haus & Garten
  "Gartenbewässerung": [
    "Automatisches oder manuelles Bewässern Ihrer Pflanzen.",
    "Optimale Wasserversorgung für gesunde Pflanzen.",
    "Individuelle Abstimmung je nach Gartenfläche."
  ],
  "Gartenpflege": [
    "Regelmäßiger Rückschnitt, Rasenpflege und Beetpflege.",
    "Entfernung von Laub und Unkraut.",
    "Professionelle Pflege für einen gepflegten Garten."
  ],
  "Haushüter": [
    "Überwachung Ihres Hauses während Ihrer Abwesenheit.",
    "Postservice, Pflanzenpflege und kleine Reparaturen.",
    "Sicherstellung von Sicherheit und Ordnung."
  ],
  "Kleinreparaturen (ohne Handwerksplicht)": [
    "Durchführung kleiner Reparaturen ohne Handwerkslizenzpflicht.",
    "Montage von Möbeln, Lampen oder Regalen.",
    "Schnell und zuverlässig, ohne großen Aufwand."
  ],
  "Rasenmäher": [
    "Regelmäßiges Mähen Ihres Rasens.",
    "Pflege für gesundes Wachstum und gepflegtes Aussehen.",
    "Optionaler Schnitt nach individueller Wunschhöhe."
  ],
  "Regale und Gardinenmontage": [
    "Fachgerechte Montage von Regalen, Vorhängen oder Gardinenstangen.",
    "Verwendung passender Schrauben und Dübel.",
    "Sauberes Arbeiten ohne Schäden an Wänden."
  ],
  "Sträucherschnitt": [
    "Rückschnitt von Sträuchern und Hecken.",
    "Formgebung nach Wunsch und Pflege für gesundes Wachstum.",
    "Entsorgung des Schnittguts inklusive."
  ],
  "Unkrautentfernung": [
    "Effektives Entfernen von Unkraut in Beeten und auf Wegen.",
    "Chemiefrei oder mit umweltfreundlichen Mitteln.",
    "Regelmäßige Kontrolle für sauberen Garten."
  ],
  "Weihnachtsbeleuchtung Montage": [
    "Auf- und Abbau von Weihnachtsbeleuchtung außen und innen.",
    "Sichere Befestigung und Verkabelung.",
    "Optional auch Lagerung der Dekoration im Folgejahr."
  ],

  // 🟨 Persönliche Dienste & Events
  "Einkaufshilfe": [
    "Unterstützung beim Einkaufen von Lebensmitteln oder Waren des täglichen Bedarfs.",
    "Abholung und Lieferung direkt zu Ihnen nach Hause.",
    "Individuelle Beratung bei der Produktauswahl möglich."
  ],
  "Einzelhandelskaufmann": [
    "Professionelle Unterstützung im Einzelhandel oder Lager.",
    "Sortimentspflege, Kundenberatung und Kassenservice.",
    "Flexible Einsätze nach Bedarf."
  ],
  "Eventhilfe / Servicekraft": [
    "Unterstützung bei Veranstaltungen, Catering oder Auf-/Abbau.",
    "Freundlicher Service für Gäste und Veranstalter.",
    "Kurzfristige Einsätze oder regelmäßige Events möglich."
  ],
  "Hundeausführen / Gassi-Service": [
    "Regelmäßiges Ausführen Ihres Hundes.",
    "Individuelle Spaziergänge angepasst an Tempo und Bedürfnisse des Hundes.",
    "Pflege und Fütterung nach Absprache möglich."
  ],
  "Seniorenbetreuung (ohne Pflege)": [
    "Begleitung älterer Menschen bei Alltagstätigkeiten.",
    "Gespräche, Spaziergänge und Freizeitgestaltung.",
    "Unterstützung ohne medizinische Pflege."
  ],
  "Tierbetreuung": [
    "Betreuung von Haustieren während Abwesenheit der Besitzer.",
    "Fütterung, Spielzeit und Pflege nach Bedarf.",
    "Flexible Einsätze für kurz- oder langfristige Betreuung."
  ]
};
