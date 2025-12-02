// === ИНИЦИАЛИЗАЦИЯ ФОРМЫ С КОНТЕЙНЕРОМ ===
import { serviceDescriptions } from './fixed_price_descriptions.js';
window.initFixedPriceForm = function(container) {
  if (!container) return;

  // Ссылки на элементы ВНУТРИ контейнера
  const priceEl = container.querySelector('.fixed-price__card-price');
  const discountEl = container.querySelector('.fixed-price__discount');
  const form = container.querySelector('form');
  const descriptionEl = container.querySelector('.fixed-price__card-description');
  
  if (!form || !priceEl || !discountEl) return;

  // Ссылки на скрытые поля
  const serviceInput = form.querySelector('[name="service"]');
  const weeklyInput = form.querySelector('[name="weekly"]');
  const monthsInput = form.querySelector('[name="months"]');

  // Локальное состояние для этой формы
  const selections = { service: null, weekly: null, months: null };
  
  const basePrice = {
    "Fahrzeugüberführung": 30,
    "Kurierdienste": 25,
    "Lieferant": 28,
    "Möbeltransport / Umzugshilfe": 40,
    "Tragehilfe": 22,
    "Zum Flughafen hin-zurück fahren": 35,
    "Rasenpflege": 20,
    "Heckenschnitt": 25,
    "Reparaturen": 30,
    "Reinigungsdienste": 22,
    "Catering": 35,
    "Haushaltshilfe": 18,
    "Kinderbetreuung": 15,
    "Eventplanung": 40,
    "Standardreinigung": 20,
    "Tiefenreinigung": 35,
    "Büroreinigung": 25,
    "Fensterreinigung": 15
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
      
      // Убираем required для полей
      serviceInput.removeAttribute('required');
      weeklyInput.removeAttribute('required');
      monthsInput.removeAttribute('required');
      return;
    }

    // Возвращаем required
    serviceInput.setAttribute('required', 'required');
    weeklyInput.setAttribute('required', 'required');
    monthsInput.setAttribute('required', 'required');


    // Если что-то не выбрано — показываем 0.00€
    if (!service || !weekly || !months) {
      priceEl.textContent = "0.00€";
      discountEl.textContent = '';
      return;
    }

    const total = basePrice[service] * weekly * months;
    const discount = getDiscount(months);
    const finalPrice = total - (total * discount / 100);

    priceEl.textContent = `${finalPrice.toFixed(2)}€`;
    discountEl.textContent = discount ? `zusätzlicher Rabatt ${discount}%` : '';
  }

  // === DROPDOWN ЛОГИКА ===
  container.querySelectorAll('.fixed-price__card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdownType = btn.dataset.dropdown;
      const dd = container.querySelector(`.fixed-price__dropdown[data-type="${dropdownType}"]`);

      // Закрываем все другие
      container.querySelectorAll('.fixed-price__dropdown').forEach(d => {
        if (d !== dd) d.classList.remove('open');
      });
      dd.classList.toggle('open');
    });
  });

  // Закрытие при клике вне (только внутри контейнера)
  container.addEventListener('click', (e) => {
    if (!e.target.closest('.fixed-price__card-options')) {
      container.querySelectorAll('.fixed-price__dropdown').forEach(dd => dd.classList.remove('open'));
    }
  });

  // === SELECTION ЛОГИКА ===
  container.querySelectorAll('.fixed-price__dropdown li').forEach(li => {
    li.addEventListener('click', (e) => {
      e.stopPropagation(); // Останавливаем всплытие события
      const dropdown = li.closest('.fixed-price__dropdown');
      if (!dropdown) return;
      
      const type = dropdown.dataset.type;
      const isCustom = li.dataset.custom === "true";

      if (isCustom) {
        selections[type] = "custom";

        // Кнопка и заголовок
        const btn = container.querySelector(`.fixed-price__card-btn[data-dropdown="${type}"]`);
        if (btn) btn.textContent = li.textContent.trim();
        

        if (type === 'service') {
          const title = container.querySelector('.fixed-price__card-title');
          if (title) title.textContent = li.textContent.trim();
          // Обновляем описание
          if (descriptionEl) {
            const descArr = serviceDescriptions[li.dataset.value] || serviceDescriptions[li.textContent.trim()] || [];
            descriptionEl.innerHTML = descArr.map(line => `<p>${line}</p>`).join('');
          }
        }

        // Цена и скидка
        priceEl.textContent = "nach Vereinbarung";
        discountEl.textContent = '';

        // ⭐ ОБЯЗАТЕЛЬНО закрываем dropdown
        dropdown.classList.remove('open');
        calculatePrice();
        return;
      }

      // --- обычная логика ---
      selections[type] = type === 'service'
        ? li.dataset.value
        : parseInt(li.dataset.value.match(/\d+/)[0], 10);

      dropdown.querySelectorAll('li').forEach(x => x.classList.remove('active'));
      li.classList.add('active');

      const btn = container.querySelector(`.fixed-price__card-btn[data-dropdown="${type}"]`);
      if (btn) btn.textContent = li.dataset.value;


      if (type === 'service') {
        const title = container.querySelector('.fixed-price__card-title');
        if (title) title.textContent = li.dataset.value;
        // Обновляем описание
        if (descriptionEl) {
          const descArr = serviceDescriptions[li.dataset.value] || serviceDescriptions[li.textContent.trim()] || [];
          descriptionEl.innerHTML = descArr.map(line => `<p>${line}</p>`).join('');
        }
      }

      // ⭐ ОБЯЗАТЕЛЬНО закрываем dropdown
      dropdown.classList.remove('open');
      calculatePrice();
    });
  });

  // При инициализации — сбрасываем описание
  if (descriptionEl) {
    descriptionEl.innerHTML = '';
  }
  // === ФОРМА SUBMIT ===
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const sendBtn = form.querySelector('.btn-submit');
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.textContent = 'Senden...';
    }

    // Собираем данные
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.final_price = priceEl.textContent;
    data.discount_info = discountEl.textContent;

    // Деталь услуги для письма
    if ([data.service, data.weekly, data.months].includes('custom')) {
      data.service_details = 'Telefonisch besprechen (Anfrage Custom-Preis)';
    } else {
      data.service_details = `${data.service} (${data.weekly}, ${data.months})`;
    }

    try {
      console.info('DEBUG: sending /api/fixed_price', { url: '/api/fixed_price', payloadSize: JSON.stringify(data).length });
      const response = await fetch('/api/fixed_price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.info('DEBUG: /api/fixed_price response status', response.status);

      let result = null;
      try {
        result = await response.json();
      } catch (jsonErr) {
        console.error('DEBUG_CODE: INVALID_JSON_RESPONSE', { err: jsonErr });
        alert('❌ Ein ungültiges Server-Antwortformat wurde empfangen. (CODE: INVALID_JSON_RESPONSE)');
        return;
      }

      // Map common server responses to diagnostic codes
      if (response.ok && result && result.success) {
        console.info('DEBUG_CODE: SUCCESS_200', result);
        alert('✅ Anfrage erfolgreich gesendet! Wir melden uns in Kürze. (CODE: SUCCESS_200)');
        form.reset();
        selections.service = null;
        selections.weekly = null;
        selections.months = null;
        calculatePrice();
        container.querySelector('.fixed-price__card-title').textContent = '';
        container.querySelectorAll('.fixed-price__dropdown li').forEach(x => x.classList.remove('active'));
        container.querySelectorAll('.fixed-price__card-btn').forEach(btn => {
          const type = btn.dataset.dropdown;
          if (type === 'service') btn.textContent = 'Auswählen';
          else if (type === 'weekly') btn.textContent = 'pro Woche';
          else if (type === 'months') btn.textContent = 'Monate';
        });
      } else {
        // Not OK — determine code
        const codeInfo = { httpStatus: response.status, serverError: result && result.error, missing: result && result.missing };
        if (response.status === 400 && result && result.missing) {
          console.error('DEBUG_CODE: VALIDATION_400', codeInfo);
          alert(`❌ Validierungsfehler. Fehlende Felder: ${result.missing.join(', ')} (CODE: VALIDATION_400)`);
        } else if (response.status === 500 && result && result.error === 'Mailjet credentials missing') {
          console.error('DEBUG_CODE: MAILJET_CREDS_500', codeInfo);
          alert('❌ Server konfiguriert nicht korrekt (Mailjet). (CODE: MAILJET_CREDS_500)');
        } else if (response.status === 500 && result && result.error === 'Email send failed') {
          console.error('DEBUG_CODE: MAILJET_SEND_500', codeInfo);
          alert('❌ Mailversand fehlgeschlagen. (CODE: MAILJET_SEND_500)');
        } else {
          console.error('DEBUG_CODE: UNKNOWN_SERVER_ERROR', codeInfo);
          alert(`❌ Fehler beim Senden: ${result && result.error ? result.error : 'Unbekannter Fehler'} (CODE: UNKNOWN_SERVER_ERROR, HTTP ${response.status})`);
        }
      }

    } catch (error) {
      // Network-level errors (DNS, CORS blocking, TLS, offline)
      console.error('DEBUG_CODE: NETWORK_ERROR', error);
      alert('❌ Ein Verbindungsfehler ist aufgetreten. (CODE: NETWORK_ERROR)');
    } finally {
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Anfrage absenden';
      }
    }
  });

  // Начальная инициализация
  calculatePrice();
};// ---------------------------------------------
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