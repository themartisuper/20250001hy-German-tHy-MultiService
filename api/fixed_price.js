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
        const descriptionSource = isCustom 
            ? CUSTOM_SERVICE_DATA.descriptions 
            : serviceDescriptions[serviceKey] || CUSTOM_SERVICE_DATA.descriptions;
            
        let html = '';
        descriptionSource.forEach(text => { html += `<p>${text}</p>`; });
        cardDescriptionEl.innerHTML = html;
    }

    function calculatePrice() {
        const { service, weekly, months } = selections;

        // Обновление скрытых полей
        if (serviceInput) serviceInput.value = service || '';
        if (weeklyInput) weeklyInput.value = weekly || '';
        if (monthsInput) monthsInput.value = months || '';
        
        // --- Обработка Custom/Telefonisch besprechen ---
        const isCustom = [service, weekly, months].some(val => val === "custom");

        if (isCustom) {
            if (priceEl) priceEl.textContent = CUSTOM_SERVICE_DATA.price;
            if (discountEl) discountEl.textContent = CUSTOM_SERVICE_DATA.discount;
            
            // Убираем/ставим required для валидации
            if (serviceInput) serviceInput.toggleAttribute('required', service !== "custom");
            if (weeklyInput) weeklyInput.toggleAttribute('required', weekly !== "custom");
            if (monthsInput) monthsInput.toggleAttribute('required', months !== "custom");
            
            updateDescription("custom");
            return;
        }

        // Возвращаем required
        if (serviceInput) serviceInput.setAttribute('required', 'required');
        if (weeklyInput) weeklyInput.setAttribute('required', 'required');
        if (monthsInput) monthsInput.setAttribute('required', 'required');

        if (!service || !weekly || !months || !basePrice[service]) {
            if (priceEl) priceEl.textContent = "0.00€";
            if (discountEl) discountEl.textContent = 'Kein Rabatt';
            updateDescription(service);
            return;
        }

        const pricePerUnit = basePrice[service];
        const total = pricePerUnit * weekly * months;
        const discount = getDiscount(months);
        const finalPrice = total - (total * discount / 100);

        if (priceEl) priceEl.textContent = `${finalPrice.toFixed(2)}€`;
        if (discountEl) discountEl.textContent = discount ? `zusätzlicher Rabatt ${discount}%` : 'Kein Rabatt';
        
        updateDescription(service);
    }

    // --- ЛОГИКА DROPDOWN И ВЫБОРА (ОСТАВЛЕНА БЕЗ ИЗМЕНЕНИЙ) ---
    // (Этот код работает корректно, так как использует form.querySelectorAll)
    
    // ... (ваш код для form.querySelectorAll('.fixed-price__card-btn')) ...
    form.querySelectorAll('.fixed-price__card-btn').forEach(btn => {
        btn.onclick = (e) => { 
            e.stopPropagation();
            const dropdownType = btn.dataset.dropdown;
            const dd = form.querySelector(`.fixed-price__dropdown[data-type="${dropdownType}"]`);
            if (dd) {
                form.querySelectorAll('.fixed-price__dropdown.open').forEach(d => {
                    if (d !== dd) d.classList.remove('open');
                });
                dd.classList.toggle('open');
            }
        };
    });

    // 🚨 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Удаляем старый обработчик, добавляем новый
    if (currentGlobalDropdownCloser) {
        document.removeEventListener('click', currentGlobalDropdownCloser);
    }
    
    // Создаем новый обработчик, привязанный к ТЕКУЩЕЙ форме
    currentGlobalDropdownCloser = (e) => {
        if (!form.contains(e.target) && !e.target.closest('.fixed-price__dropdown-wrapper') && !e.target.closest('.fixed-price__card-btn')) {
            form.querySelectorAll('.fixed-price__dropdown.open').forEach(dd => dd.classList.remove('open'));
        }
    };
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