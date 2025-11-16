export default async function handler(req, res) {
  //
  // 1) Пропускаем только POST — остальное идёт лесом
  //
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  //
  // 2) Логируем тело запроса сырым — ловит кривые запросы с фронта
  //
  console.log("REQUEST BODY RAW:", req.body);

  //
  // 3) Распаковываем поля, которые реально приходят с нового фронта
  //
  const {
    first_name,
    last_name,
    email,
    phone,
    service,
    message,
    recipient,   // Für mich selbst | Für eine andere Person | Für eine Firma
    delivery,    // selbst | wir (или пусто, если выбран "Für mich selbst")
    birthday
  } = req.body;

  //
  // 4) Проверяем обязательные поля
  // Всё по-честному: только то, что реально required на фронте
  //
  const missing = [];
  if (!first_name) missing.push("first_name");
  if (!last_name) missing.push("last_name");
  if (!email) missing.push("email");
  if (!phone) missing.push("phone");
  if (!service) missing.push("service");
  if (!recipient) missing.push("recipient");

  //
  // delivery обязательно только если выбран "andere Person" или "Firma"
  //
  if (recipient === "Für eine andere Person" || recipient === "Für eine Firma") {
    if (!delivery) missing.push("delivery");
  }

  console.log("DEBUG missing fields:", missing);

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missing
    });
  }

  //
  // 5) Генерируем timestamp по Берлину
  //
  const now = new Date();
  const dateString = now.toLocaleString("de-DE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  //
  // 6) Subject письма
  //
  const subject = `Gutschein-Anfrage – ${dateString}`;

  //
  // 7) Готовим email и шлём через Mailjet
  //
  try {
    console.log("⚡ SENDING EMAIL THROUGH MAILJET…");

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

            //
            // ReplyTo — не обязательная штука, но сильно снижает шанс улёта в спам
            //
            ReplyTo: {
              Email: process.env.EMAIL_FROM,
              Name: "Gutschein Formular"
            },

            To: [{ Email: process.env.EMAIL_TO }],
            Subject: subject,

            //
            // HTML письмо (нормально читается глазами)
            //
            HTMLPart: `
              <h3>Neue Gutschein-Anfrage</h3>
              <p><strong>Datum/Zeit:</strong> ${dateString}</p>

              <p><strong>Vorname:</strong> ${first_name}</p>
              <p><strong>Nachname:</strong> ${last_name}</p>
              <p><strong>E-Mail:</strong> ${email}</p>
              <p><strong>Telefon:</strong> ${phone}</p>

              <p><strong>Geburtsdatum:</strong> ${birthday || "—"}</p>

              <p><strong>Dienstleistung:</strong> ${service}</p>

              <p><strong>Für wen:</strong> ${recipient}</p>

              ${(() => {
                if (recipient === "Für mich selbst") {
                  return `<p><strong>Versandart:</strong> Nicht erforderlich (bestellt für sicht)</p>`;
                }

                // остальные варианты: andere Person / Firma
                if (delivery === "selbst") {
                  return `<p><strong>Versandart:</strong> Kunde verschenkt selbst</p>`;
                }

                return `<p><strong>Versandart:</strong> Wir senden direkt</p>`;
              })()}


              <p><strong>Nachricht:</strong><br>${message || "—"}</p>
            `,

            //
            // TextPart — обязателен, иначе фильтры спамят к херам
            //
            TextPart: `
Gutschein-Anfrage
Datum/Zeit: ${dateString}

Vorname: ${first_name}
Nachname: ${last_name}
E-Mail: ${email}
Telefon: ${phone}

Geburtsdatum: ${birthday || "-"}

Dienstleistung: ${service}
Für wen: ${recipient}

${
  recipient === "Für mich selbst"
    ? `Versandart: Nicht erforderlich`
    : `Versandart: ${
        delivery === "selbst" ? "Kunde verschenkt selbst" : "Wir senden direkt"
      }`
}

Nachricht: ${message || "-"}
            `
          }
        ]
      })
    });

    const data = await result.json();
    console.log("MAILJET RESPONSE:", data);

    //
    // 8) Если Mailjet облажался — 500 и домой
    //
    if (!result.ok) {
      return res.status(500).json({
        error: "Email send failed",
        mailjet: data
      });
    }

    //
    // 9) Всё good
    //
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("FATAL ERROR:", e);
    return res.status(500).json({
      error: "Server error",
      details: e.message
    });
  }
}
