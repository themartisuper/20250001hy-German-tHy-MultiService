// Vercel API route for fixed-price form (server-side)
async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('fixed_price handler body:', req.body);

  const {
    first_name,
    last_name,
    email,
    phone,
    message,
    street,
    house,
    address_supplement,
    zip,
    city,
    service,
    weekly,
    months,
    final_price,
    discount_info,
    service_details
  } = req.body || {};

  // Validate required fields
  const missing = [];
  if (!first_name) missing.push('first_name');
  if (!last_name) missing.push('last_name');
  if (!email) missing.push('email');
  if (!phone) missing.push('phone');
  if (!service) missing.push('service');
  if (!weekly) missing.push('weekly');
  if (!months) missing.push('months');
  if (!street) missing.push('street');
  if (!house) missing.push('house');
  if (!zip) missing.push('zip');
  if (!city) missing.push('city');

  if (missing.length > 0) {
    return res.status(400).json({ error: 'Missing required fields', missing });
  }

  const now = new Date();
  const dateString = now.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

  const subject = `Neue Anfrage: ${service_details || service}`;

  const HTMLPart = `
    <h3>Neue Anfrage (Fixed Price)</h3>
    <p><strong>Datum/Zeit:</strong> ${dateString}</p>
    <p><strong>Vorname:</strong> ${first_name}</p>
    <p><strong>Nachname:</strong> ${last_name}</p>
    <p><strong>E-Mail:</strong> ${email}</p>
    <p><strong>Telefon:</strong> ${phone}</p>
    <p><strong>Leistung:</strong> ${service}</p>
    <p><strong>Pro Woche:</strong> ${weekly}</p>
    <p><strong>Laufzeit (Monate):</strong> ${months}</p>
    <p><strong>Preis:</strong> ${final_price || '0.00€'}</p>
    <p><strong>Rabatt:</strong> ${discount_info || ''}</p>
    <p><strong>Adresse:</strong><br>${street} ${house}<br>${address_supplement || ''}<br>${zip} ${city}</p>
    <p><strong>Nachricht:</strong><br>${message || '—'}</p>
  `;

  const TextPart = `
Neue Anfrage (Fixed Price)
Datum/Zeit: ${dateString}

Vorname: ${first_name}
Nachname: ${last_name}
E-Mail: ${email}
Telefon: ${phone}

Leistung: ${service}
Pro Woche: ${weekly}
Laufzeit (Monate): ${months}
Preis: ${final_price || '0.00€'}
Rabatt: ${discount_info || ''}

Adresse:
${street} ${house}
${address_supplement || ''}
${zip} ${city}

Nachricht: ${message || '-'}
`;

  const MJ_PUBLIC = process.env.MJ_PUBLIC;
  const MJ_PRIVATE = process.env.MJ_PRIVATE;
  const EMAIL_FROM = process.env.EMAIL_FROM;
  const EMAIL_TO = process.env.EMAIL_TO || process.env.EMAIL_FROM;

  if (!MJ_PUBLIC || !MJ_PRIVATE || !EMAIL_FROM) {
    console.error('Mailjet env missing');
    return res.status(500).json({ error: 'Mailjet credentials missing' });
  }

  try {
    const result = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(`${MJ_PUBLIC}:${MJ_PRIVATE}`).toString('base64')
      },
      body: JSON.stringify({
        Messages: [
          {
            From: { Email: EMAIL_FROM, Name: 'Fixed Price Formular' },
            ReplyTo: { Email: EMAIL_FROM, Name: 'Fixed Price Formular' },
            To: [{ Email: EMAIL_TO }],
            Subject: subject,
            HTMLPart: HTMLPart,
            TextPart: TextPart
          }
        ]
      })
    });

    const data = await result.json();
    console.log('Mailjet response:', data);

    if (!result.ok) {
      return res.status(500).json({ error: 'Email send failed', mailjet: data });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('FATAL ERROR:', e);
    return res.status(500).json({ error: 'Server error', details: e.message });
  }
}

// fixed_price.js

// Глобальная переменная для хранения ССЫЛКИ на активный обработчик закрытия
let currentGlobalDropdownCloser = null;

// --- ДАННЫЕ ЦЕНЫ И ОПИСАНИЙ ДЛЯ ВСЕХ ВКЛАДОК ---
const CUSTOM_SERVICE_DATA = {
    // Единые данные для "Telefonisch besprechen"
    price: "nach Vereinbarung",
    discount: '',
    descriptions: [
        "• Maßgeschneidertes Angebot", 
        "• Persönliche Beratung am Telefon", 
        "• Kostenlose und unverbindliche Besprechung"
    ]
};

const ALL_SERVICE_DATA = {
    "logistics": {
        title: "Transport & Logistik",
        basePrice: {
            "Fahrzeugüberführung": 30,
            "Kurierdienste": 25,
            "Lieferant": 28,
            "Möbeltransport / Umzugshilfe": 40,
            "Tragehilfe": 22,
            "Zum Flughafen hin-zurück fahren": 35,
        },
        serviceDescriptions: {
            "Fahrzeugüberführung": ["• Schnelle und sichere Überführung", "• Vollkaskoversicherung inklusive", "• Termingerechte Zustellung bundesweit"],
            "Kurierdienste": ["• Zustellung am selben Tag möglich", "• Sendungsverfolgung in Echtzeit", "• Flexible Abholzeiten"],
            "Lieferant": ["• Regelmäßige Lieferungen nach Plan", "• Zuverlässiges und geschultes Personal", "• Optionale Lagerhaltung verfügbar"],
            "Möbeltransport / Umzugshilfe": ["• Professionelle Trage- und Montierhilfe", "• Spezialausrüstung für schwere Gegenstände", "• Schadensversicherung für Ihren Umzug"],
            "Tragehilfe": ["• Stundenweise Buchung möglich", "• Hilfe beim Be- und Entladen", "• Ideal für spontane Großeinkäufe"],
            "Zum Flughafen hin-zurück fahren": ["• Pünktlicher Transfer ohne Stress", "• Gepäckservice inklusive", "• Fahrten zu allen großen Flughäfen"],
        // Vercel API route for fixed-price form (server-side)
        export default async function handler(req, res) {
            // 1) Allow only POST
            if (req.method !== 'POST') {
                return res.status(405).json({ error: 'Method Not Allowed' });
            }

            console.log('fixed_price handler body:', req.body);
// Vercel API route for fixed-price form (server-side)
export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    console.log('fixed_price handler body:', req.body);

    const {
        first_name,
        last_name,
        email,
        phone,
        message,
        street,
        house,
        address_supplement,
        zip,
        city,
        service,
        weekly,
        months,
        final_price,
        discount_info,
        service_details
    } = req.body || {};

    // Validate required fields
    const missing = [];
    if (!first_name) missing.push('first_name');
    if (!last_name) missing.push('last_name');
    if (!email) missing.push('email');
    if (!phone) missing.push('phone');
    if (!service) missing.push('service');
    if (!weekly) missing.push('weekly');
    if (!months) missing.push('months');
    if (!street) missing.push('street');
    if (!house) missing.push('house');
    if (!zip) missing.push('zip');
    if (!city) missing.push('city');

    if (missing.length > 0) {
        return res.status(400).json({ error: 'Missing required fields', missing });
    }

    const now = new Date();
    const dateString = now.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

    const subject = `Neue Anfrage: ${service_details || service}`;

    const HTMLPart = `
        <h3>Neue Anfrage (Fixed Price)</h3>
        <p><strong>Datum/Zeit:</strong> ${dateString}</p>
        <p><strong>Vorname:</strong> ${first_name}</p>
        <p><strong>Nachname:</strong> ${last_name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Leistung:</strong> ${service}</p>
        <p><strong>Pro Woche:</strong> ${weekly}</p>
        <p><strong>Laufzeit (Monate):</strong> ${months}</p>
        <p><strong>Preis:</strong> ${final_price || '0.00€'}</p>
        <p><strong>Rabatt:</strong> ${discount_info || ''}</p>
        <p><strong>Adresse:</strong><br>${street} ${house}<br>${address_supplement || ''}<br>${zip} ${city}</p>
        <p><strong>Nachricht:</strong><br>${message || '—'}</p>
    `;

    const TextPart = `
Neue Anfrage (Fixed Price)
Datum/Zeit: ${dateString}

Vorname: ${first_name}
Nachname: ${last_name}
E-Mail: ${email}
Telefon: ${phone}

Leistung: ${service}
Pro Woche: ${weekly}
Laufzeit (Monate): ${months}
Preis: ${final_price || '0.00€'}
Rabatt: ${discount_info || ''}

Adresse:
${street} ${house}
${address_supplement || ''}
${zip} ${city}

Nachricht: ${message || '-'}
`;

    const MJ_PUBLIC = process.env.MJ_PUBLIC;
    const MJ_PRIVATE = process.env.MJ_PRIVATE;
    const EMAIL_FROM = process.env.EMAIL_FROM;
    const EMAIL_TO = process.env.EMAIL_TO || process.env.EMAIL_FROM;

    if (!MJ_PUBLIC || !MJ_PRIVATE || !EMAIL_FROM) {
        console.error('Mailjet env missing');
        return res.status(500).json({ error: 'Mailjet credentials missing' });
    }

    try {
        const result = await fetch('https://api.mailjet.com/v3.1/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Buffer.from(`${MJ_PUBLIC}:${MJ_PRIVATE}`).toString('base64')
            },
            body: JSON.stringify({
                Messages: [
                    {
                        From: { Email: EMAIL_FROM, Name: 'Fixed Price Formular' },
                        ReplyTo: { Email: EMAIL_FROM, Name: 'Fixed Price Formular' },
                        To: [{ Email: EMAIL_TO }],
                        Subject: subject,
                        HTMLPart: HTMLPart,
                        TextPart: TextPart
                    }
                ]
            })
        });

        const data = await result.json();
        console.log('Mailjet response:', data);

        if (!result.ok) {
            return res.status(500).json({ error: 'Email send failed', mailjet: data });
        }

        return res.status(200).json({ success: true });
    } catch (e) {
        console.error('FATAL ERROR:', e);
        return res.status(500).json({ error: 'Server error', details: e.message });
    }
}

module.exports = handler;
