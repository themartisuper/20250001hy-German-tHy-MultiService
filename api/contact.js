export default async function handler(req, res) {
  // --- 1. Принимаем только POST-запросы ---
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // --- 2. Деструктурируем данные формы ---
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

  // --- 3. Проверяем обязательные поля ---
  // Если чего-то нет → сразу 400 Bad Request
  if (!first_name || !last_name || !email || !phone || !service || !target || !delivery) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // --- 4. Если заказ отправляется почтой — адрес обязателен ---
  if (delivery === "post") {
    if (!street || !house_number || !zip || !city) {
      return res.status(400).json({ error: "Address fields required for postal delivery" });
    }
  }

  try {
    // --- 5. Формируем письмо для Mailjet ---
    // Тут включён:
    // • HTMLPart — красиво отображается
    // • TextPart — must-have для хорошей доставляемости
    // • Reply-To — сильно снижает шанс попасть в спам
    const result = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        // Авторизация Mailjet (Public + Private Key)
        // Обязательно через Base64 — стандарт Basic Auth
        Authorization:
          "Basic " +
          Buffer.from(process.env.MJ_PUBLIC + ":" + process.env.MJ_PRIVATE)
            .toString("base64")
      },
      body: JSON.stringify({
        Messages: [
          {
            // Отправитель — должен быть верифицирован в Mailjet
            From: {
              Email: process.env.EMAIL_FROM,
              Name: "Gutschein Formular"
            },

            // Кому приходит письмо
            To: [
              {
                Email: process.env.EMAIL_TO
              }
            ],

            // Очень важно! Reply-To клиенту
            // Это делает письмо «легитимным» и снижает шанс спама
            ReplyTo: {
              Email: email,
              Name: `${first_name} ${last_name}`
            },

            Subject: "Neue Gutschein-Anfrage",

            // --- HTML версия письма ---
            HTMLPart: `
              <h3>Neue Gutschein-Anfrage</h3>
              <p><strong>Vorname:</strong> ${first_name}</p>
              <p><strong>Nachname:</strong> ${last_name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Telefon:</strong> ${phone}</p>
              <p><strong>Dienstleistung:</strong> ${service}</p>
              <p><strong>Für wen:</strong> ${target}</p>
              <p><strong>Lieferung:</strong> ${
                delivery === "email" ? "Per E-Mail" : "Per Post"
              }</p>
              ${
                delivery === "post"
                  ? `<p><strong>Adresse:</strong> ${street} ${house_number} ${address_extra || ""}, ${zip} ${city}</p>`
                  : ""
              }
              <p><strong>Nachricht:</strong><br>${message || "—"}</p>
            `,

            // --- TEXT версия письма ---
            // Нужна для антиспама. Некоторые провайдеры читают только текст.
            TextPart: `
Neue Gutschein-Anfrage
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

    // --- 6. Парсим ответ Mailjet ---
    const data = await result.json();

    // Если от Mailjet пришла ошибка
    if (!result.ok) {
      console.error("Mailjet error:", data);
      return res.status(500).json({ error: "Email send failed" });
    }

    // --- 7. Всё хорошо — отправляем ответ фронтенду ---
    return res.status(200).json({ success: true });

  } catch (e) {
    // --- 8. Ловим системные ошибки ---
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
}