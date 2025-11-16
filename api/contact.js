export default async function handler(req, res) {
  //
  // 1) Ограничиваем обработку только POST-запросами.
  // Любой другой метод — ошибка 405.
  //
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  //
  // 2) Читаем тело запроса.
  // Логируем "как есть", чтобы сразу видеть, что прислал фронт.
  //
  console.log("REQUEST BODY RAW:", req.body);

  // Деструктурируем поля из тела запроса для удобства
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
  // 3) Проверка обязательных полей
  // Если какое-то поле не пришло — добавляем его в массив missing
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

  // Если есть пропавшие обязательные поля — возвращаем ошибку 400
  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missing
    });
  }

  //
  // 4) Проверяем поля адреса — только если доставка по почте
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
  // 5) Формируем текущую дату и время для использования в Subject письма
  //
  const now = new Date();
  // Форматируем дату и время по немецкому стилю: DD.MM.YYYY, HH:MM:SS
  const dateString = now.toLocaleString("de-DE", { 
    year: "numeric", month: "2-digit", day: "2-digit", 
    hour: "2-digit", minute: "2-digit", second: "2-digit" 
  });

  // Subject с датой и временем
  const subject = `Gutschein-Anfrage - ${dateString}`;

  //
  // 6) Формируем и отправляем письмо через Mailjet
  // Используем async/await и try/catch для надёжной обработки ошибок
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
              { Email: process.env.EMAIL_TO }
            ],
            Subject: subject, // Используем динамический Subject

            // HTML версия письма — для визуальной презентации
            HTMLPart: `
              <h3>Neue Gutschein-Anfrage:</h3>
              <p><strong>Datum/Zeit:</strong> ${dateString}</p>
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

            // Текстовая версия письма — нужна для антиспам-фильтров
            TextPart: `
Neue Gutschein-Anfrage:
Datum/Zeit: ${dateString}
Vorname: ${first_name}
Nachname: ${last_name}
E-Mail: ${email}
Telefon: ${phone}
Dienstleistung: ${service}
Für wen: ${target}
Senden per: ${delivery === "email" ? "E-Mail" : "Post"}
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
    // 7) Проверяем ответ Mailjet
    // Если Mailjet вернул ошибку — возвращаем 500
    //
    console.log("MAILJET RESPONSE:", data);

    if (!result.ok) {
      return res.status(500).json({ error: "Email send failed", mailjet: data });
    }

    //
    // 8) Всё прошло успешно — возвращаем успех фронту
    //
    return res.status(200).json({ success: true });
  } catch (e) {
    // Ловим любые ошибки сервера
    console.error("FATAL ERROR:", e);
    return res.status(500).json({ error: "Server error", details: e.message });
  }
}
