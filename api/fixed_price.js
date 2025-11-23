// api/contact.js
const Mailjet = require('node-mailjet');

// Инициализация Mailjet с вашими ключами из переменных окружения
const mailjet = Mailjet.apiConnect(
    process.env.MJ_PUBLIC,
    process.env.MJ_PRIVATE
);

export default async function handler(req, res) {
    // Разрешаем только POST запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const data = req.body;

        // Простая валидация (фронтенд проверяет, но бэкенд тоже должен)
        if (!data.email || !data.last_name || !data.phone) {
            return res.status(400).json({ message: 'Обязательные поля отсутствуют' });
        }

        // Формируем красивое HTML письмо для вас
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
                <h2 style="color: #4c5b5c; border-bottom: 2px solid #4c5b5c; padding-bottom: 10px;">
                    Новая заявка с сайта
                </h2>
                
                <h3 style="background: #f5f5f5; padding: 10px;">📦 Детали заказа</h3>
                <p><strong>Услуга:</strong> ${data.service_details}</p>
                <p><strong>Итоговая цена:</strong> ${data.final_price}</p>
                <p><strong>Скидка:</strong> ${data.discount_info}</p>

                <h3 style="background: #f5f5f5; padding: 10px;">👤 Контактные данные</h3>
                <p><strong>Имя:</strong> ${data.first_name} ${data.last_name}</p>
                <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                <p><strong>Телефон:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>

                <h3 style="background: #f5f5f5; padding: 10px;">📍 Адрес</h3>
                <p>
                    ${data.street} ${data.house}<br>
                    ${data.address_supplement ? data.address_supplement + '<br>' : ''}
                    ${data.zip} ${data.city}
                </p>

                ${data.message ? `
                <h3 style="background: #f5f5f5; padding: 10px;">💬 Сообщение клиента</h3>
                <p style="white-space: pre-wrap;">${data.message}</p>
                ` : ''}

                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">Это письмо отправлено автоматически с вашего сайта.</p>
            </div>
        `;

        // Отправка через Mailjet
        const result = await mailjet
            .post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": process.env.EMAIL_FROM,
                            "Name": "Заявка с сайта"
                        },
                        "To": [
                            {
                                "Email": process.env.EMAIL_TO,
                                "Name": "Admin"
                            }
                        ],
                        // ReplyTo позволяет вам нажать "Ответить" в почте и сразу писать клиенту
                        "ReplyTo": {
                            "Email": data.email,
                            "Name": `${data.first_name} ${data.last_name}`
                        },
                        "Subject": `Новая заявка: ${data.service || 'Custom'} от ${data.last_name}`,
                        "HTMLPart": emailHtml,
                        "TextPart": `Новая заявка от ${data.first_name} ${data.last_name}. Тел: ${data.phone}. Услуга: ${data.service_details}`
                    }
                ]
            });

        console.log("Email sent successfully:", result.body);
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Mailjet Error:", error.statusCode, error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Ошибка при отправке письма',
            error: error.message 
        });
    }
}