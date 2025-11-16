export default async function handler(req, res) {
  //
  // 1) Accept only POST — все остальные методы пошли гулять
  //
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  //
  // 2) Читаем тело запроса
  // Если фронт что-то шлёт неправильно — мы это сразу увидим.
  //
  console.log("REQUEST BODY RAW:", req.body);

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

  //
  // 3) Диагностика пропавших обязательных полей
  //
  const missing = [];
  if (!first_name) missing.push("first_name");
  if (!last_name) missing.push("last_name");
  if (!email) missing.push("email");
  if (!phone) missing.push("phone");
  if (!service) missing.push("service");
  if (!target) missing.push("target");
  if (!delivery) missing.push("delivery");

  console.log("DEBUG missing:", missing);

  //
  // Если хоть одно обязательное поле отсутствует — кидаем ошибку
  //
  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missing
    });
  }

  //
  // 4) Проверяем адрес — только если доставка по почте
  //
  if (delivery === "post") {
    const missingAddress = [];
    if (!street) missingAddress.push("street");
    if (!house_number) missingAddress.push("house_number");
    if (!zip) missingAddress.push("zip");
    if (!city) missingAddress.push("city");

    console.log("DEBUG missing address fields:", missingAddress);

    if (missingAddress.length > 0) {
      return res.status(400).json({
        error: "Address fields required for postal delivery",
        missingAddress
      });
    }
  }

  //
  // 5) Пытаемся отправить письмо через Mailjet
  //
  try {
    console.log("⚡ SENDING EMAIL THROUGH MAILJET…");

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
            To: [
              {
                Email: process.env.EMAIL_TO
              }
            ],
            Subject: "Neue Gutschein-Anfrage",

            // HTML версия письма (красиво)
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

            // Текстовая версия — для антиспам
            TextPart: `
Neue Gutschein-Anfrage:
Vorname: ${first_name}
Nachname: ${last_name}
Email: ${email}
Telefon: ${phone}
Dienstleistung: ${service}
Für wen: ${target}
Lieferung: ${delivery === "email" ? "Per E-Mail" : "Per Post"}

${
  delivery === "post"
    ? `Adresse: ${street} ${house_number} ${address_extra || ""}, ${zip} ${city}`
    : ""
}

Nachricht: ${message || "-"}
            `
          }
        ]
      })
    });

    const data = await result.json();

    //
    // 6) Проверяем ответ Mailjet
    //
    console.log("MAILJET RESPONSE:", data);

    if (!result.ok) {
      return res.status(500).json({ error: "Email send failed", mailjet: data });
    }

    //
    // 7) Всё прошло успешно
    //
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("FATAL ERROR:", e);
    return res.status(500).json({ error: "Server error", details: e.message });
  }
}
