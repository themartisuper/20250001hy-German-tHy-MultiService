// === ИНИЦИАЛИЗАЦИЯ ФОРМЫ С КОНТЕЙНЕРОМ ===
import { serviceDescriptions } from './fixed_price_descriptions.js';
window.initFixedPriceForm = function(container) {
  if (!container) return;
  console.log('DEBUG: initFixedPriceForm called', { containerClass: container.className, containerKey: container.dataset.contentKey });

  // Ссылки на элементы ВНУТРИ контейнера
  const priceEl = container.querySelector('.fixed-price__card-price');
  const discountEl = container.querySelector('.fixed-price__discount');
  let form = container.querySelector('form');
  const descriptionEl = container.querySelector('.fixed-price__card-description');
  
  if (!form || !priceEl || !discountEl) {
    console.error('DEBUG: Missing required elements', { form: !!form, priceEl: !!priceEl, discountEl: !!discountEl });
    return;
  }
  console.log('DEBUG: All elements found, proceeding with init');

  // ВАЖНО: Каждый раз при инициализации (переключение вкладок) удаляем форму
  // и пересоздаём её, чтобы очистить ВСЕ обработчики
  // Это полностью решает проблему дублирования listeners
  const formParent = form.parentNode;
  const formClone = form.cloneNode(true);
  formParent.replaceChild(formClone, form);
  form = formClone;

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
  console.log('DEBUG: Dropdown button clicked', { dropdownType, ddFound: !!dd });

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
      e.stopPropagation();
      const dropdown = li.closest('.fixed-price__dropdown');
        console.log('DEBUG: Li clicked', { liText: li.textContent.trim(), dropdownType: dropdown?.dataset.type, isCustom: li.dataset.custom });
      if (!dropdown) return;
      
      const type = dropdown.dataset.type;
      const isCustom = li.dataset.custom === "true";

      if (isCustom) {
        selections[type] = "custom";

        const btn = container.querySelector(`.fixed-price__card-btn[data-dropdown="${type}"]`);
        if (btn) btn.textContent = li.textContent.trim();

        if (type === 'service') {
          const title = container.querySelector('.fixed-price__card-title');
          if (title) title.textContent = li.textContent.trim();
          if (descriptionEl) {
            const descArr = serviceDescriptions[li.dataset.value] || serviceDescriptions[li.textContent.trim()] || [];
            descriptionEl.innerHTML = descArr.map(line => `<p>${line}</p>`).join('');
          }
        }

        priceEl.textContent = "nach Vereinbarung";
        discountEl.textContent = '';

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
          console.log('DEBUG: Selection updated', { type, selections, finalPrice: priceEl.textContent });
        if (descriptionEl) {
          const descArr = serviceDescriptions[li.dataset.value] || serviceDescriptions[li.textContent.trim()] || [];
          descriptionEl.innerHTML = descArr.map(line => `<p>${line}</p>`).join('');
        }
      }

      dropdown.classList.remove('open');
      calculatePrice();
    });
  });

  // При инициализации — сбрасываем описание
  if (descriptionEl) {
    descriptionEl.innerHTML = '';
  }

  // === ФОРМА SUBMIT (ЕДИНСТВЕННЫЙ ОБРАБОТЧИК) ===
  let isSubmitting = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    isSubmitting = true;

    const sendBtn = form.querySelector('.btn-submit');
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.textContent = 'Senden...';
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.final_price = priceEl.textContent;
    data.discount_info = discountEl.textContent;

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
      console.error('DEBUG_CODE: NETWORK_ERROR', error);
      alert('❌ Ein Verbindungsfehler ist aufgetreten. (CODE: NETWORK_ERROR)');
    } finally {
      isSubmitting = false;
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Anfrage absenden';
      }
    }
  });

  calculatePrice();
};
