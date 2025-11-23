export default async function handler(req, res) {
  // 1) Пропускаем только POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 2) Логируем
  console.log("FIXED PRICE REQUEST BODY:", req.body);

  // 3) Распаковываем поля (адаптировано под вашу новую форму)
  const {
    // Контакты
    first_name,
    last_name,
    email,
    phone,
    message,
    
    // Адрес
    street,
    house,
    address_supplement,
    zip,
    city,

    // Детали услуги (из скрытых полей и расчетов)
    service,
    weekly,
    months,
    final_price,
    discount_info,
    service_details // Это поле мы сформируем на фронте
  } = req.body;

  // 4) Проверяем обязательные поля
  const missing = [];
  if (!first_name) missing.push("first_name");
  if (!last_name) missing.push("last_name");
  if (!email) missing.push("email");
  if (!phone) missing.push("phone");
  // Проверяем поля заказа, если они не "custom"
  if (!service) missing.push("service"); 
  if (!street) missing.push("street");
  if (!city) missing.push("city");

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missing
    });
  }

  // 5) Timestamp
  const now = new Date();
  const dateString = now.toLocaleString("de-DE", {
    timeZone: "Europe/Berlin",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  });

  // 6) Subject
  const subject = `Anfrage Festpreis: ${last_name} – ${dateString}`;

  // 7) Отправка через Mailjet (БЕЗ БИБЛИОТЕКИ, как у вас)
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
              Name: "Website Anfrage"
            },
            ReplyTo: {
              Email: email,
              Name: `${first_name} ${last_name}`
            },
            To: [{ Email: process.env.EMAIL_TO }],
            Subject: subject,

            // HTML Версия
            HTMLPart: `
              <h2 style="color: #4c5b5c;">Neue Anfrage (Festpreis)</h2>
              <p><strong>Datum:</strong> ${dateString}</p>

              <h3 style="background: #eee; padding: 5px;">👤 Kontakt</h3>
              <p>
                <strong>Name:</strong> ${first_name} ${last_name}<br>
                <strong>Email:</strong> <a href="mailto:${email}">${email}</a><br>
                <strong>Telefon:</strong> <a href="tel:${phone}">${phone}</a>
              </p>

              <h3 style="background: #eee; padding: 5px;">📍 Adresse</h3>
              <p>
                ${street} ${house}<br>
                ${address_supplement ? address_supplement + '<br>' : ''}
                ${zip} ${city}
              </p>

              <h3 style="background: #eee; padding: 5px;">📦 Details zum Auftrag</h3>
              <p><strong>Service:</strong> ${service}</p>
              <p><strong>Frequenz:</strong> ${weekly}</p>
              <p><strong>Laufzeit:</strong> ${months}</p>
              <hr>
              <p><strong>Zusammenfassung:</strong> ${service_details}</p>
              <p style="font-size: 1.2em;"><strong>Preis (laut Kalkulator): ${final_price}</strong></p>
              <p style="color: #e67e22;">${discount_info}</p>

              <h3 style="background: #eee; padding: 5px;">💬 Nachricht</h3>
              <p>${message ? message.replace(/\n/g, '<br>') : "Keine Nachricht"}</p>
            `,

            // Текстовая версия
            TextPart: `
Neue Anfrage (Festpreis)
Datum: ${dateString}

KONTAKT:
Name: ${first_name} ${last_name}
Email: ${email}
Tel: ${phone}

ADRESSE:
${street} ${house}
${address_supplement || ''}
${zip} ${city}

AUFTRAG:
Service: ${service}
Frequenz: ${weekly}
Laufzeit: ${months}
Zusammenfassung: ${service_details}

PREIS: ${final_price}
RABATT: ${discount_info}

NACHRICHT:
${message || "-"}
            `
          }
        ]
      })
    });

    const data = await result.json();

    if (!result.ok) {
      console.error("Mailjet Error Response:", data);
      return res.status(500).json({ error: "Email send failed", mailjet: data });
    }

    return res.status(200).json({ success: true });

  } catch (e) {
    console.error("FATAL ERROR:", e);
    return res.status(500).json({ error: "Server error", details: e.message });
  }
}