export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  console.log("REQUEST BODY:", req.body);

  const {
    first_name,
    last_name,
    email,
    phone,
    service,
    message,
    target,
    delivery,
    street,
    house_number,
    address_extra,
    zip,
    city
  } = req.body;

  // ---- DEBUG: какие поля реально пустые ----
  const missing = [];
  if (!first_name) missing.push("first_name");
  if (!last_name) missing.push("last_name");
  if (!email) missing.push("email");
  if (!phone) missing.push("phone");
  if (!service) missing.push("service");
  if (!target) missing.push("target");
  if (!delivery) missing.push("delivery");

  if (missing.length > 0) {
    console.log("❌ REQUIRED FIELDS MISSING:", missing);
    return res.status(400).json({
      error: "Missing required fields",
      missing
    });
  }

  // ---- Проверка адреса для почты ----
  if (delivery === "post") {
    const addr_missing = [];
    if (!street) addr_missing.push("street");
    if (!house_number) addr_missing.push("house_number");
    if (!zip) addr_missing.push("zip");
    if (!city) addr_missing.push("city");

    if (addr_missing.length > 0) {
      console.log("❌ ADDRESS FIELDS MISSING:", addr_missing);
      return res.status(400).json({
        error: "Missing postal address fields",
        missing: addr_missing
      });
    }
  }

  // ---- Проверяем ENV ----
  console.log("ENV CHECK:", {
    MJ_PUBLIC: process.env.MJ_PUBLIC ? "OK" : "MISSING",
    MJ_PRIVATE: process.env.MJ_PRIVATE ? "OK" : "MISSING",
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_TO: process.env.EMAIL_TO
  });

  try {
    const result = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(process.env.MJ_PUBLIC + ":" + process.env.MJ_PRIVATE).toString("base64")
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: process.env.EMAIL_FROM,
              Name: "Gutschein Formular"
            },
            To: [{ Email: process.env.EMAIL_TO }],
            Subject: "Neue Gutschein-Anfrage",
            HTMLPart: `
              <h3>Neue Gutschein-Anfrage:</h3>
              <p><strong>Vorname:</strong> ${first_name}</p>
              <p><strong>Nachname:</strong> ${last_name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Telefon:</strong> ${phone}</p>
              <p><strong>Dienstleistung:</strong> ${service}</p>
              <p><strong>Für wen:</strong> ${target}</p>
              <p><strong>Lieferung:</strong> ${delivery === "email" ? "Per E-Mail" : "Per Post"}</p>
              ${
                delivery === "post"
                  ? `<p><strong>Adresse:</strong> ${street} ${house_number} ${address_extra || ""}, ${zip} ${city}</p>`
                  : ""
              }
              <p><strong>Nachricht:</strong><br>${message || "—"}</p>
            `,
            TextPart: `
Neue Gutschein-Anfrage:
Vorname: ${first_name}
Nachname: ${last_name}
Email: ${email}
Telefon: ${phone}
Dienstleistung: ${service}
Für wen: ${target}
Lieferung: ${delivery === "email" ? "Per E-Mail" : "Per Post"}
${delivery === "post" ? `Adresse: ${street} ${house_number} ${address_extra || ""}, ${zip} ${city}` : ""}
Nachricht: ${message || "-"}
            `
          }
        ]
      })
    });

    const data = await result.json();
    console.log("MAILJET RAW RESPONSE:", data);

    if (!result.ok) {
      console.error("Mailjet error:", data);
      return res.status(500).json({ error: "Email send failed", mailjet: data });
    }

    return res.status(200).json({ success: true });

  } catch (e) {
    console.error("SERVER ERROR:", e);
    return res.status(500).json({ error: "Server error" });
  }
}
