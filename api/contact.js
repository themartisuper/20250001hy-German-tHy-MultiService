export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
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
              Name: "Контактная форма"
            },
            To: [
              {
                Email: process.env.EMAIL_TO
              }
            ],
            Subject: "Новое сообщение с формы",
            HTMLPart: `
              <h3>Имя: ${name}</h3>
              <p>Email: ${email}</p>
              <p>${message}</p>
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
