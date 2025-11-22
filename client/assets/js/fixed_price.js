// ---------------------------------------------
// ИНИЦИАЛИЗАЦИЯ И СКРЫТЫЕ ПОЛЯ
// ---------------------------------------------
const priceEl = document.querySelector('.fixed-price__card-price');
const discountEl = document.querySelector('.fixed-price__discount');
const form = document.getElementById('fixed-price-form'); // Ссылка на форму

// Ссылки на скрытые поля, добавленные в HTML
const serviceInput = document.getElementById('service-value');
const weeklyInput = document.getElementById('weekly-value');
const monthsInput = document.getElementById('months-value');

const selections = { service: null, weekly: null, months: null };
const basePrice = {
  "Fahrzeugüberführung": 30,
  "Kurierdienste": 25,
  "Lieferant": 28,
  "Möbeltransport / Umzugshilfe": 40,
  "Tragehilfe": 22,
  "Zum Flughafen hin-zurück fahren": 35
};

function getDiscount(months) {
  if (months >= 12) return 20;
  if (months >= 6) return 10;
  if (months >= 3) return 5;
  return 0;
}

function calculatePrice() {
  const { service, weekly, months } = selections;

  // --- ОБНОВЛЕНИЕ СКРЫТЫХ ПОЛЕЙ ---
  serviceInput.value = service || '';
  weeklyInput.value = weekly || '';
  monthsInput.value = months || '';
  
  // Показываем "nach Vereinbarung" только если выбран кастомный пункт
  if ([service, weekly, months].includes("custom")) {
    priceEl.textContent = "nach Vereinbarung";
    discountEl.textContent = '';
    
    // Убираем required для полей, если выбран кастомный пункт
    serviceInput.removeAttribute('required');
    weeklyInput.removeAttribute('required');
    monthsInput.removeAttribute('required');
    return;
  }

  // Возвращаем required, если это не кастомный выбор
  serviceInput.setAttribute('required', 'required');
  weeklyInput.setAttribute('required', 'required');
  monthsInput.setAttribute('required', 'required');

  // Если что-то не выбрано — просто скрываем цену
  if (!service || !weekly || !months) {
    priceEl.textContent = "";
    discountEl.textContent = '';
    return;
  }

  const total = basePrice[service] * weekly * months;
  const discount = getDiscount(months);
  const finalPrice = total - (total * discount / 100);

  priceEl.textContent = `${finalPrice.toFixed(2)}€`;
  discountEl.textContent = discount ? `zusätzlicher Rabatt ${discount}%` : '';
}

// ---------------------------------------------
// DROPDOWN
// ---------------------------------------------
document.querySelectorAll('.fixed-price__card-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const dropdownType = btn.dataset.dropdown;
    const dd = document.querySelector(`.fixed-price__dropdown[data-type="${dropdownType}"]`);

    document.querySelectorAll('.fixed-price__dropdown').forEach(d => {
      if (d !== dd) d.classList.remove('open');
    });
    dd.classList.toggle('open');
  });
});

// Закрытие при клике вне
document.addEventListener('click', (e) => {
  if (!e.target.closest('.fixed-price__card-options')) {
    document.querySelectorAll('.fixed-price__dropdown').forEach(dd => dd.classList.remove('open'));
  }
});

// ---------------------------------------------
// SELECTION
// ---------------------------------------------
document.querySelectorAll('.fixed-price__dropdown li').forEach(li => {
  li.addEventListener('click', () => {
    const dropdown = li.closest('.fixed-price__dropdown');
    const type = dropdown.dataset.type;
    const isCustom = li.dataset.custom === "true";

    if (isCustom) {
      selections[type] = "custom";

      // Кнопка и заголовок
      document.querySelector(`.fixed-price__card-btn[data-dropdown="${type}"]`).textContent = li.textContent.trim();
      if (type === 'service') {
        document.querySelector('.fixed-price__card-title').textContent = li.textContent.trim();
      }

      // Цена и скидка скрыты только для кастомного пункта
      priceEl.textContent = "nach Vereinbarung";
      discountEl.textContent = '';

      dropdown.classList.remove('open');
      calculatePrice(); // <-- ВЫЗОВ ДЛЯ ОБНОВЛЕНИЯ СКРЫТЫХ ПОЛЕЙ
      return;
    }

    // --- обычная логика ---
    selections[type] = type === 'service'
      ? li.dataset.value
      : parseInt(li.dataset.value.match(/\d+/)[0], 10);

    dropdown.querySelectorAll('li').forEach(x => x.classList.remove('active'));
    li.classList.add('active');

    document.querySelector(`.fixed-price__card-btn[data-dropdown="${type}"]`).textContent = li.dataset.value;

    if (type === 'service') {
      document.querySelector('.fixed-price__card-title').textContent = li.dataset.value;
    }

    dropdown.classList.remove('open');
    calculatePrice();
  });
});

// ---------------------------------------------
// ЛОГИКА ОТПРАВКИ ФОРМЫ (SUBMIT)
// ---------------------------------------------
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Предотвращаем стандартную отправку формы

  // Блокируем кнопку
  const sendBtn = document.querySelector('.fixed-price__card-btn-send');
  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.textContent = 'Senden...';
  }

  // Собираем данные формы
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries()); // Преобразуем FormData в JSON

  // Добавляем итоговую цену и скидку в данные для отправки (для письма)
  data.final_price = priceEl.textContent;
  data.discount_info = discountEl.textContent;

  // Формирование деталей услуги для письма
  if (data.service === 'Telefonisch besprechen') { 
    data.service_details = 'Telefonisch besprechen (Anfrage Custom-Preis)';
  } else {
    // Используем 'service' из data, который был обновлен из скрытого поля
    const weeklyValue = document.querySelector(`.fixed-price__dropdown li[data-value="${data.weekly} mal"]`)?.textContent.trim() || data.weekly;
    const monthsValue = document.querySelector(`.fixed-price__dropdown li[data-value="${data.months} Monate"]`)?.textContent.trim() || data.months;
    data.service_details = `${data.service} (${weeklyValue} pro Woche, ${monthsValue}) - Preis: ${data.final_price}`;
  }


  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Успех: Выводим сообщение и очищаем форму
      alert('✅ Anfrage erfolgreich gesendet! Wir melden uns in Kürze.');
      form.reset(); 
      // Сброс JS-состояния и визуальных элементов
      selections.service = null; selections.weekly = null; selections.months = null;
      calculatePrice(); 
      document.querySelector('.fixed-price__card-title').textContent = '';
      document.querySelectorAll('.fixed-price__dropdown li').forEach(x => x.classList.remove('active'));
      document.querySelector('button[data-dropdown="service"]').textContent = 'Auswählen';
      document.querySelector('button[data-dropdown="weekly"]').textContent = 'pro Woche';
      document.querySelector('button[data-dropdown="months"]').textContent = 'Monate';
    } else {
      // Ошибка
      console.error('Fehler beim Senden:', result);
      const missingFields = result.missing ? ` (${result.missing.join(', ')})` : '';
      alert(`❌ Fehler beim Senden der Anfrage. Bitte überprüfen Sie die Eingaben. Fehlende поля: ${missingFields}`);
    }

  } catch (error) {
    console.error('Netzwerk- oder Serverfehler:', error);
    alert('❌ Ein kritischer Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
  } finally {
    // Разблокируем кнопку
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Anfrage absenden';
    }
  }
});