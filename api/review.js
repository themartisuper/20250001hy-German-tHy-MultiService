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
  // 3) Распаковываем поля, которые реально приходят с фронта
  //
  const {
    name,
    rating,
    service,
    comment
  } = req.body;

  //
  // 4) Проверяем обязательные поля
  //
  const missing = [];
  if (!name) missing.push("name");
  if (!rating) missing.push("rating");
  if (!service) missing.push("service");

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
  const subject = `Neue Bewertung – ${rating}/5 Sterne – ${dateString}`;

  //
  // 7) Генерируем звёзды для визуализации
  //
  const starsHTML = "★".repeat(parseInt(rating)) + "☆".repeat(5 - parseInt(rating));
  const starsText = "★".repeat(parseInt(rating)) + "☆".repeat(5 - parseInt(rating));

  //
  // 8) Готовим email и шлём через Mailjet
  //
  try {
    console.log("⚡ SENDING REVIEW EMAIL THROUGH MAILJET…");

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
              Name: "Bewertungs Formular"
            },

            //
            // ReplyTo — не обязательная штука, но сильно снижает шанс улёта в спам
            //
            ReplyTo: {
              Email: process.env.EMAIL_FROM,
              Name: "Bewertungs Formular"
            },

            To: [{ Email: process.env.EMAIL_TO }],
            Subject: subject,

            //
            // HTML письмо (нормально читается глазами)
            //
            HTMLPart: `
              <h3>Neue Bewertung erhalten!</h3>
              <p><strong>Datum/Zeit:</strong> ${dateString}</p>

              <p><strong>Name:</strong> ${name}</p>

              <p><strong>Bewertung:</strong> <span style="color: #ffc83a; font-size: 1.5em;">${starsHTML}</span> (${rating}/5)</p>

              <p><strong>Dienstleistung:</strong> ${service}</p>

              <p><strong>Kommentar:</strong><br>${comment || "—"}</p>
            `,

            //
            // TextPart — обязателен, иначе фильтры спамят к херам
            //
            TextPart: `
Neue Bewertung erhalten!
Datum/Zeit: ${dateString}

Name: ${name}

Bewertung: ${starsText} (${rating}/5)

Dienstleistung: ${service}

Kommentar: ${comment || "-"}
            `
          }
        ]
      })
    });

    const data = await result.json();
    console.log("MAILJET RESPONSE:", data);

    //
    // 9) Если Mailjet облажался — 500 и домой
    //
    if (!result.ok) {
      return res.status(500).json({
        error: "Email send failed",
        mailjet: data
      });
    }

    //
    // 10) Всё good
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
