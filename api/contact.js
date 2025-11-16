export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    first_name,
    last_name,
    email,
    phone,
    service,
    message
  } = req.body;

  if (!first_name || !last_name || !email || !phone || !service) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const result = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.MJ_PUBLIC + ":" + process.env.MJ_PRIVATE
          ).toString("base64")
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: process.env.EMAIL_FROM,
              Name: "Gutschein Formular"
            },
            To: [
              {
                Email: process.env.EMAIL_TO
              }
            ],
            Subject: "Neue Gutschein-Anfrage",
            HTMLPart: `
              <h3>Neue Anfrage:</h3>
              <p><strong>Vorname:</strong> ${first_name}</p>
              <p><strong>Nachname:</strong> ${last_name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Telefon:</strong> ${phone}</p>
              <p><strong>Dienstleistung:</strong> ${service}</p>
              <p><strong>Nachricht:</strong><br>${message || "—"}</p>
            `
          }
        ]
      })
    });

    const data = await result.json();

    if (!result.ok) {
      console.error("Mailjet error:", data);
      return res.status(500).json({ error: "Email send failed" });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
}