// Clean single ESM Vercel handler for fixed-price form
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const body = req.body || {};
  console.log('fixed_price handler body:', body);

  const required = ['first_name','last_name','email','phone','service','weekly','months','street','house','zip','city'];
  const missing = required.filter(k => !body[k]);
  if (missing.length) return res.status(400).json({ error: 'Missing required fields', missing });

  const now = new Date();
  const datum = now.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' });
  const uhrzeit = now.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const subject = `Pauschal Anfrage: ${body.service || 'Unbekannte Leistung'} | ${datum}, ${uhrzeit}`;
  
  // Styled HTML email with clear blocks
  const HTMLPart = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; }
        .block { padding: 25px 30px; border-bottom: 1px solid #e0e0e0; }
        .block:last-child { border-bottom: none; }
        .block-title { font-size: 16px; font-weight: 600; color: #667eea; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .field { margin-bottom: 12px; display: flex; }
        .field-label { font-weight: 600; color: #333; min-width: 140px; }
        .field-value { color: #555; }
        .price-highlight { background-color: #f0f4ff; padding: 15px; border-radius: 6px; margin-top: 10px; border-left: 4px solid #667eea; }
        .price-highlight .field { margin-bottom: 8px; }
        .message-box { background-color: #fffbf0; padding: 15px; border-radius: 6px; border-left: 4px solid #ffa726; margin-top: 10px; }
        .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Neue Pauschal Anfrage</h1>
          <p>${datum} um ${uhrzeit}</p>
        </div>
        
        <div class="block">
          <div class="block-title">👤 Persönliche Daten</div>
          <div class="field"><span class="field-label">Vorname:</span><span class="field-value">${body.first_name || '—'}</span></div>
          <div class="field"><span class="field-label">Nachname:</span><span class="field-value">${body.last_name || '—'}</span></div>
          <div class="field"><span class="field-label">E-Mail:</span><span class="field-value">${body.email || '—'}</span></div>
          <div class="field"><span class="field-label">Telefon:</span><span class="field-value">${body.phone || '—'}</span></div>
        </div>
        
        <div class="block">
          <div class="block-title">📍 Adresse</div>
          <div class="field"><span class="field-label">Straße:</span><span class="field-value">${body.street || '—'}</span></div>
          <div class="field"><span class="field-label">Hausnummer:</span><span class="field-value">${body.house || '—'}</span></div>
          ${body.address_supplement ? `<div class="field"><span class="field-label">Adresszusatz:</span><span class="field-value">${body.address_supplement}</span></div>` : ''}
          <div class="field"><span class="field-label">PLZ:</span><span class="field-value">${body.zip || '—'}</span></div>
          <div class="field"><span class="field-label">Stadt:</span><span class="field-value">${body.city || '—'}</span></div>
        </div>
        
        <div class="block">
          <div class="block-title">🛠️ Gewünschte Dienstleistung</div>
          <div class="field"><span class="field-label">Service:</span><span class="field-value"><strong>${body.service || '—'}</strong></span></div>
          <div class="field"><span class="field-label">Pro Woche:</span><span class="field-value">${body.weekly || '—'}</span></div>
          <div class="field"><span class="field-label">Laufzeit (Monate):</span><span class="field-value">${body.months || '—'}</span></div>
          ${body.service_details ? `<div class="field"><span class="field-label">Details:</span><span class="field-value">${body.service_details}</span></div>` : ''}
          
          <div class="price-highlight">
            <div class="field"><span class="field-label">💰 Preis:</span><span class="field-value"><strong style="font-size: 18px; color: #667eea;">${body.final_price || '—'}</strong></span></div>
            ${body.discount_info ? `<div class="field"><span class="field-label">🎁 Rabatt:</span><span class="field-value"><strong style="color: #4caf50;">${body.discount_info}</strong></span></div>` : ''}
          </div>
        </div>
        
        ${body.message ? `
        <div class="block">
          <div class="block-title">💬 Kundenanfrage</div>
          <div class="message-box">${body.message}</div>
        </div>
        ` : ''}
        
        <div class="footer">
          German tHÿ MultiService &copy; ${now.getFullYear()}
        </div>
      </div>
    </body>
    </html>
  `;
  
  const TextPart = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NEUE PAUSCHAL ANFRAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Datum: ${datum}
🕐 Uhrzeit: ${uhrzeit}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 PERSÖNLICHE DATEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vorname:     ${body.first_name || '—'}
Nachname:    ${body.last_name || '—'}
E-Mail:      ${body.email || '—'}
Telefon:     ${body.phone || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 ADRESSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Straße:         ${body.street || '—'}
Hausnummer:     ${body.house || '—'}
${body.address_supplement ? `Adresszusatz:   ${body.address_supplement}\n` : ''}PLZ:            ${body.zip || '—'}
Stadt:          ${body.city || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ GEWÜNSCHTE DIENSTLEISTUNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Service:           ${body.service || '—'}
Pro Woche:         ${body.weekly || '—'}
Laufzeit (Monate): ${body.months || '—'}
${body.service_details ? `Details:           ${body.service_details}\n` : ''}
💰 Preis:          ${body.final_price || '—'}
${body.discount_info ? `🎁 Rabatt:         ${body.discount_info}\n` : ''}
${body.message ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 KUNDENANFRAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${body.message}
` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
German tHÿ MultiService © ${now.getFullYear()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

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
            From: { Email: EMAIL_FROM, Name: 'Pauschal Price Formular' },
            ReplyTo: { Email: body.email || EMAIL_FROM, Name: `${body.first_name} ${body.last_name}` },
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