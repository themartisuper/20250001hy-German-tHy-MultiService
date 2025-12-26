// Handler для формы "Persönliche Dienste & Events"
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const body = req.body || {};
  console.log('personal_request handler body:', body);

  // Проверяем обязательные поля
  const required = ['first_name', 'last_name', 'email', 'phone', 'service', 'street', 'house_number', 'zip', 'city'];
  const missing = required.filter(k => !body[k]);
  if (missing.length) return res.status(400).json({ error: 'Missing required fields', missing });

  // Генерируем timestamp по Берлину
  const now = new Date();
  const datum = now.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' });
  const uhrzeit = now.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const subject = `Persönliche Dienste Anfrage: ${body.service || 'Unbekannte Leistung'} | ${datum}, ${uhrzeit}`;
  
  // Форматируем информацию о расписании
  const scheduleInfo = body.timing_onetime ? 
    'Einmalig (einzelner Termin)' : 
    `Wochen: ${body.timing_weeks || '—'}, Tage pro Woche: ${body.timing_days_per_week || '—'}, Monate: ${body.timing_months || '—'}`;

  // HTML письмо
  const HTMLPart = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        .field-value { color: #555; word-break: break-word; }
        .message-box { background-color: #fffbf0; padding: 15px; border-radius: 6px; border-left: 4px solid #ffa726; margin-top: 10px; word-break: break-word; }
        .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; }
        
        @media only screen and (max-width: 480px) {
          .container { margin: 10px; border-radius: 4px; }
          .header { padding: 20px 15px; }
          .header h1 { font-size: 20px; }
          .block { padding: 20px 15px; }
          .block-title { font-size: 14px; }
          .field { flex-direction: column; }
          .field-label { min-width: auto; margin-bottom: 4px; font-size: 14px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Neue Persönliche Anfrage</h1>
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
          <div class="field"><span class="field-label">Hausnummer:</span><span class="field-value">${body.house_number || '—'}</span></div>
          <div class="field"><span class="field-label">PLZ:</span><span class="field-value">${body.zip || '—'}</span></div>
          <div class="field"><span class="field-label">Stadt:</span><span class="field-value">${body.city || '—'}</span></div>
        </div>
        
        <div class="block">
          <div class="block-title">🛠️ Gewünschte Dienstleistung</div>
          <div class="field"><span class="field-label">Service:</span><span class="field-value"><strong>${body.service || '—'}</strong></span></div>
          <div class="field"><span class="field-label">Zeitplan:</span><span class="field-value">${scheduleInfo}</span></div>
          ${body.message ? `<div class="field"><span class="field-label">Details:</span><span class="field-value">${body.message}</span></div>` : ''}
        </div>
        
        <div class="footer">
          German tHÿ MultiService &copy; ${now.getFullYear()}
        </div>
      </div>
    </body>
    </html>
  `;
  
  const TextPart = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NEUE PERSÖNLICHE ANFRAGE
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
Hausnummer:     ${body.house_number || '—'}
PLZ:            ${body.zip || '—'}
Stadt:          ${body.city || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ GEWÜNSCHTE DIENSTLEISTUNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Service:           ${body.service || '—'}
Zeitplan:          ${scheduleInfo}
${body.message ? `Details:           ${body.message}\n` : ''}
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
            From: { Email: EMAIL_FROM, Name: 'Persönliche Dienste Formular' },
            ReplyTo: { Email: (EMAIL_FROM || body.email), Name: `${body.first_name || ''} ${body.last_name || ''}`.trim() },
            To: [{ Email: EMAIL_TO }],
            Subject: subject,
            HTMLPart,
            TextPart
          }
        ]
      })
    });

    const data = await result.json();
    if (!result.ok) {
      console.error('MAILJET_SEND_ERROR', { status: result.status, statusText: result.statusText, data });
      return res.status(500).json({ error: 'MAILJET_SEND_500', status: result.status, statusText: result.statusText, mailjet: data });
    }
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: e.message });
  }
}
