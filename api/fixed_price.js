// Clean single ESM Vercel handler for fixed-price form
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const body = req.body || {};
  console.log('fixed_price handler body:', body);

  const required = ['first_name','last_name','email','phone','service','weekly','months','street','house','zip','city'];
  const missing = required.filter(k => !body[k]);
  if (missing.length) return res.status(400).json({ error: 'Missing required fields', missing });

  const now = new Date();
  const dateString = now.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

  const subject = `Neue Anfrage: ${body.service_details || body.service}`;
  
  // Build full email with all fields
  const HTMLPart = `
    <h3>Neue Anfrage (Fixed Price)</h3>
    <p><strong>Datum/Zeit:</strong> ${dateString}</p>
    <hr>
    <h4>Persönliche Informationen:</h4>
    <p><strong>Vorname:</strong> ${body.first_name || '—'}</p>
    <p><strong>Nachname:</strong> ${body.last_name || '—'}</p>
    <p><strong>E-Mail:</strong> ${body.email || '—'}</p>
    <p><strong>Telefon:</strong> ${body.phone || '—'}</p>
    <h4>Adresse:</h4>
    <p><strong>Straße:</strong> ${body.street || '—'}</p>
    <p><strong>Hausnummer:</strong> ${body.house || '—'}</p>
    <p><strong>Adresszusatz:</strong> ${body.address_supplement || '—'}</p>
    <p><strong>PLZ:</strong> ${body.zip || '—'}</p>
    <p><strong>Stadt:</strong> ${body.city || '—'}</p>
    <h4>Leistung:</h4>
    <p><strong>Service:</strong> ${body.service || '—'}</p>
    <p><strong>Pro Woche:</strong> ${body.weekly || '—'}</p>
    <p><strong>Laufzeit (Monate):</strong> ${body.months || '—'}</p>
    <p><strong>Preis:</strong> ${body.final_price || '—'}</p>
    <p><strong>Rabatt:</strong> ${body.discount_info || '—'}</p>
    <p><strong>Service Details:</strong> ${body.service_details || '—'}</p>
    ${body.message ? `<h4>Nachricht:</h4><p>${body.message}</p>` : ''}
  `;
  
  const TextPart = `
Neue Anfrage (Fixed Price)
Datum/Zeit: ${dateString}

--- PERSÖNLICHE INFORMATIONEN ---
Vorname: ${body.first_name || '—'}
Nachname: ${body.last_name || '—'}
E-Mail: ${body.email || '—'}
Telefon: ${body.phone || '—'}

--- ADRESSE ---
Straße: ${body.street || '—'}
Hausnummer: ${body.house || '—'}
Adresszusatz: ${body.address_supplement || '—'}
PLZ: ${body.zip || '—'}
Stadt: ${body.city || '—'}

--- LEISTUNG ---
Service: ${body.service || '—'}
Pro Woche: ${body.weekly || '—'}
Laufzeit (Monate): ${body.months || '—'}
Preis: ${body.final_price || '—'}
Rabatt: ${body.discount_info || '—'}
Service Details: ${body.service_details || '—'}
${body.message ? `
NACHRICHT:
${body.message}` : ''}\n`;

  const MJ_PUBLIC = process.env.MJ_PUBLIC;
  const MJ_PRIVATE = process.env.MJ_PRIVATE;
  const EMAIL_FROM = process.env.EMAIL_FROM;
  const EMAIL_TO = process.env.EMAIL_TO || process.env.EMAIL_FROM;
  if (!MJ_PUBLIC || !MJ_PRIVATE || !EMAIL_FROM) return res.status(500).json({ error: 'Mailjet credentials missing' });

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
            HTMLPart,
            TextPart
          }
        ]
      })
    });

    const data = await result.json();
    if (!result.ok) return res.status(500).json({ error: 'Email send failed', mailjet: data });
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: e.message });
  }
}