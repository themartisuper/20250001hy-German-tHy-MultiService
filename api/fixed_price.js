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
  const HTMLPart = `<h3>Neue Anfrage (Fixed Price)</h3><p><strong>Datum/Zeit:</strong> ${dateString}</p>`;
  const TextPart = `Neue Anfrage (Fixed Price)\nDatum/Zeit: ${dateString}`;

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