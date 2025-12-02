// fixed_price.js

// Глобальная переменная для хранения ССЫЛКИ на активный обработчик закрытия
let currentGlobalDropdownCloser = null;

// --- ДАННЫЕ ЦЕНЫ И ОПИСАНИЙ ДЛЯ ВСЕХ ВКЛАДОК ---
const CUSTOM_SERVICE_DATA = {
    // Единые данные для "Telefonisch besprechen"
    price: "nach Vereinbarung",
    discount: '',
    descriptions: [
        "• Maßgeschneidertes Angebot", 
        "• Persönliche Beratung am Telefon", 
        "• Kostenlose und unverbindliche Besprechung"
    ]
};

const ALL_SERVICE_DATA = {
    "logistics": {
        title: "Transport & Logistik",
        basePrice: {
            "Fahrzeugüberführung": 30,
            "Kurierdienste": 25,
            "Lieferant": 28,
            "Möbeltransport / Umzugshilfe": 40,
            "Tragehilfe": 22,
            "Zum Flughafen hin-zurück fahren": 35,
        },
        serviceDescriptions: {
            "Fahrzeugüberführung": ["• Schnelle und sichere Überführung", "• Vollkaskoversicherung inklusive", "• Termingerechte Zustellung bundesweit"],
            "Kurierdienste": ["• Zustellung am selben Tag möglich", "• Sendungsverfolgung in Echtzeit", "• Flexible Abholzeiten"],
            "Lieferant": ["• Regelmäßige Lieferungen nach Plan", "• Zuverlässiges und geschultes Personal", "• Optionale Lagerhaltung verfügbar"],
            "Möbeltransport / Umzugshilfe": ["• Professionelle Trage- und Montierhilfe", "• Spezialausrüstung für schwere Gegenstände", "• Schadensversicherung für Ihren Umzug"],
            "Tragehilfe": ["• Stundenweise Buchung möglich", "• Hilfe beim Be- und Entladen", "• Ideal für spontane Großeinkäufe"],
            "Zum Flughafen hin-zurück fahren": ["• Pünktlicher Transfer ohne Stress", "• Gepäckservice inklusive", "• Fahrten zu allen großen Flughäfen"],
        }
    },
    "garden": {
        title: "Garten & Haus",
        basePrice: {
            "Rasenpflege": 20,
            "Heckenschnitt": 30,
            "Reparaturen": 25,
            "Reinigungsdienste": 18,
        },
        serviceDescriptions: {
            "Rasenpflege": ["• Wöchentliche oder monatliche Pflege", "• Düngung inklusive", "• Vertikutieren und Entsorgung"],
            "Heckenschnitt": ["• Form- und Pflegeschnitt", "• Entfernung von Grünschnitt", "• Professionelle Werkzeuge"],
            "Reparaturen": ["• Часовая оплата", "• Мелкий ремонт", "• Без учета стоимости материалов"],
            "Reinigungsdienste": ["• Очистка террасы/балкона", "• Мойка фасадов", "• Индивидуальный график"],
        }
    },
    "events": {
        title: "Persönliche Dienste & Events",
        basePrice: {
            "Catering": 45, // Пример цены за час/чел
            "Haushaltshilfe": 20,
            "Kinderbetreuung": 15,
            "Eventplanung": 50,
        },
        serviceDescriptions: {
            "Catering": ["• Полная организация питания", "• Разработка меню", "• Персонал и обслуживание"],
            "Haushaltshilfe": ["• Глажка, стирка, уборка", "• Индивидуальные задания", "• Гибкий график"],
            "Kinderbetreuung": ["• Опытные няни", "• Занятия и игры", "• Дневная/вечерняя смена"],
            "Eventplanung": ["• Планирование и координация", "• Поиск локаций", "• Управление бюджетом"],
        }
    },
    "cleaning": {
        title: "Reinigung & Pflege",
        basePrice: {
            "Standardreinigung": 18,
            "Tiefenreinigung": 25,
            "Büroreinigung": 22,
            "Fensterreinigung": 35,
        },
        serviceDescriptions: {
            "Standardreinigung": ["• Постоянная еженедельная уборка", "• Мытье полов и пылесос", "• Дезинфекция поверхностей"],
            "Tiefenreinigung": ["• Сезонная или разовая", "• Глубокая очистка ковров/мебели", "• Труднодоступные места"],
            "Büroreinigung": ["• Гибкий график (вне рабочего времени)", "• Уборка офисной техники", "• Поставка расходников"],
            "Fensterreinigung": ["• Мойка окон и рам", "• Без разводов", "• Доступна для всех типов зданий"],
        }
    }
};

// Глобальная функция, которая будет вызываться из main.js
// container - это активный элемент .services-tabs__content-item
function initFixedPriceForm(container) {
    
    // Получаем ключ текущей вкладки (logistics, garden, events, cleaning)
    const contentKey = container.dataset.contentKey;
    const currentData = ALL_SERVICE_DATA[contentKey];
    if (!currentData) return; // Выход, если данные не найдены

    const { basePrice, serviceDescriptions } = currentData;
    
    // --- ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ, привязанных к текущему контейнеру ---
    const form = container.querySelector('form');
    if (!form) return; 

    // Используем локальные переменные для этой формы
    const priceEl = form.querySelector('.fixed-price__card-price');
    const discountEl = form.querySelector('.fixed-price__discount');
    const cardTitleEl = form.querySelector('.fixed-price__card-tile');
    const cardDescriptionEl = form.querySelector('.fixed-price__card-description'); 

    // Ссылки на СКРЫТЫЕ ПОЛЯ (поиск по name)
    const serviceInput = form.querySelector('[name="service"]'); 
    const weeklyInput = form.querySelector('[name="weekly"]'); 
    const monthsInput = form.querySelector('[name="months"]');

    // !!! ВАЖНО: Используем локальное состояние для этой формы
    let selections = { 
        service: serviceInput ? serviceInput.value || null : null, 
        weekly: weeklyInput ? weeklyInput.value || null : null, 
        months: monthsInput ? monthsInput.value || null : null 
    };
    
    // --- ФУНКЦИИ РАСЧЕТА И ОПИСАНИЯ ---
    function getDiscount(months) {
        if (months >= 12) return 20;
        if (months >= 6) return 10;
        if (months >= 3) return 5;
        return 0;
    }

    function updateDescription(serviceKey) {
        if (!cardDescriptionEl) return;
        
        const isCustom = serviceKey === "custom";

        export default async function handler(req, res) {
            if (req.method !== 'POST') {
                res.status(405).json({ success: false, error: 'Method Not Allowed' });
                return;
            }

            const {
                first_name, last_name, email, phone, message,
                street, house, address_supplement, zip, city,
                service, weekly, months,
                final_price, discount_info, service_details
            } = req.body;

            const MJ_PUBLIC = process.env.MJ_PUBLIC;
            const MJ_PRIVATE = process.env.MJ_PRIVATE;
            const EMAIL_FROM = process.env.EMAIL_FROM;
            const EMAIL_TO = process.env.EMAIL_TO || EMAIL_FROM;

            if (!MJ_PUBLIC || !MJ_PRIVATE || !EMAIL_FROM) {
                res.status(500).json({ success: false, error: 'Mailjet credentials missing' });
                return;
            }

            const subject = `Neue Anfrage: ${service_details}`;
            const text = `\nNeue Anfrage von ${first_name} ${last_name}\nE-Mail: ${email}\nTelefon: ${phone}\n\nLeistung: ${service}\nPro Woche: ${weekly}\nLaufzeit: ${months}\nPreis: ${final_price}\nRabatt: ${discount_info}\n\nAdresse:\n${street} ${house}\n${address_supplement}\n${zip} ${city}\n\nNachricht:\n${message}\n`;

            try {
                const response = await fetch('https://api.mailjet.com/v3.1/send', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + Buffer.from(`${MJ_PUBLIC}:${MJ_PRIVATE}`).toString('base64'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Messages: [
                            {
                                From: { Email: EMAIL_FROM },
                                To: [{ Email: EMAIL_TO }],
                                Subject: subject,
                                TextPart: text,
                            }
                        ]
                    })
                });
                const result = await response.json();
                if (response.ok && result.Messages && result.Messages[0].Status === 'success') {
                    res.status(200).json({ success: true });
                } else {
                    res.status(500).json({ success: false, error: result });
                }
            } catch (err) {
                res.status(500).json({ success: false, error: err.message });
            }
        }
    document.addEventListener('click', currentGlobalDropdownCloser);


    // --- Выбор элемента Dropdown ---
    // (Этот код использует form.querySelectorAll и работает локально)
    form.querySelectorAll('.fixed-price__dropdown li').forEach(li => {
        li.onclick = () => { 
            const dropdown = li.closest('.fixed-price__dropdown');
            const type = dropdown.dataset.type;
            const isCustom = li.dataset.custom === "true";
            const btn = form.querySelector(`.fixed-price__card-btn[data-dropdown="${type}"]`);

            dropdown.querySelectorAll('li').forEach(x => x.classList.remove('active'));
            li.classList.add('active');

            if (isCustom) {
                selections[type] = "custom";
            } else {
                selections[type] = type === 'service' 
                    ? li.dataset.value 
                    : parseInt(li.dataset.value.match(/\d+/)[0], 10); 
            }

            if(btn) btn.textContent = li.textContent.trim(); 
            // 🚨 Ключевое: Обновляем заголовок карточки
            if (type === 'service' && cardTitleEl) cardTitleEl.textContent = li.textContent.trim();
            if(btn) btn.style.borderColor = "#ccc"; 

            if (dropdown) dropdown.classList.remove('open');
            
            calculatePrice();
        };
    });
    
    // --- Инициализация при запуске ---
    calculatePrice();
}