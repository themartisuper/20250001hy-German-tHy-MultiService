// === ИНИЦИАЛИЗАЦИЯ ФОРМЫ С КОНТЕЙНЕРОМ (V3 - Form-scoped handlers) ===
import { serviceDescriptions } from './fixed_price_descriptions.js';

window.initFixedPriceForm = function(container) {
  if (!container) return;
  console.log('DEBUG: initFixedPriceForm called', { containerClass: container.className });

  // Найдём форму для клонирования
  let form = container.querySelector('form');
  
  if (!form) {
    console.error('DEBUG: Form not found in container');
    return;
  }

  // КРИТИЧЕСКИ: Удаляем форму и пересоздаём её, чтобы очистить ВСЕ обработчики
  const formParent = form.parentNode;
  const formClone = form.cloneNode(true);
  formParent.replaceChild(formClone, form);
  form = formClone;

  // ПОСЛЕ клонирования ищем все элементы внутри НОВОЙ формы
  const priceEl = form.querySelector('.fixed-price__card-price');
  const discountEl = form.querySelector('.fixed-price__discount');
  const descriptionEl = form.querySelector('.fixed-price__card-description');
  const titleEl = form.querySelector('.fixed-price__card-title') || form.querySelector('.fixed-price__card-tile');
  const serviceInput = form.querySelector('[name="service"]');
  const weeklyInput = form.querySelector('[name="weekly"]');
  const monthsInput = form.querySelector('[name="months"]');
  const averageEl = form.querySelector('.fixed-price__card-average');

  if (!priceEl || !discountEl) {
    console.error('DEBUG: Missing required elements after cloning', { priceEl: !!priceEl, discountEl: !!discountEl });
    return;
  }
  console.log('DEBUG: All elements found in cloned form, proceeding with init');

  // Локальное состояние для этой формы
  const selections = { service: null, weekly: null, months: null };
  
  const basePrice = {
  // Gruppe 1: Transport & Logistik
  "Fahrzeugüberführung": 0,
  "Kurierdienste (privat)": 0,
  "Kurierdienste (gewerblich)": 0,
  "Lieferant": 0,
  "Möbeltransport / Umzugshilfe": 0, // nach vereinbarung 01.01.2026
  "Tragehilfe": 0,
  "Zum Flughafen hin fahren": 0,
  "Zum Flughafen hin-zurück fahren": 0,
  "Hausverteilungsservice": 0,

  // 🟦 Gruppe 2: Reinigung & Pflege
  "Auto reinigen (privat)": 0,
  "Auto reinigen (gewerblich)": 0,
  "Büroreinigung": 0,
  "Dachhaut/Dachziegel reinigen": 0,
  "Endreinigung / Bauendreinigung": 0,
  "Fassadenreinigung (Schimmel-, Algen- & Moosentfernung)": 0,
  "Fensterreinigung": 0,
  "Fliesen Reiniger": 0,
  "Lauabholung": 0,
  "Haushaltreinigung": 0,
  "Schneeräumung": 0,
  "Streudienst": 0,
  "Teppichreinigung- und Polster-/Sofareinigung": 0,
  "Eis und Schneebeseitigung am Auto": 0,

  // 🟧 Gruppe 3: Haus & Garten
  "Gartenbewässerung": 0,
  "Gartenpflege": 0,
  "Haushüter": 0,
  "Kleinreparaturen (ohne Handwerksplicht)":0,
  "Rasenmäher": 0,
  "Regale und Gardinenmontage": 0,
  "Sträucherschnitt": 0,
  "Unkrautentfernung": 0,
  "Weihnachtsbeleuchtung Montage": 0,

  // 🟨 Persönliche Dienste & Events
  "Einkaufshilfe": 0,
  "Einzelhandelskaufmann": 0,
  "Eventhilfe / Servicekraft": 0, // nach vereinbarung 01.01.2026
  "Hundeausführen / Gassi-Service": 0,
  "Seniorenbetreuung (ohne Pflege)": 0,
  "Tierbetreuung": 0
};


  function getDiscount(months) {
    if (months >= 12) return 20;
    if (months >= 6) return 10;
    if (months >= 3) return 5;
    return 0;
  }

  function calculatePrice() {
    try {
      const { service, weekly, months } = selections;

      // --- ОБНОВЛЕНИЕ СКРЫТЫХ ПОЛЕЙ ---
      serviceInput.value = service || '';
      weeklyInput.value = weekly || '';
      monthsInput.value = months || '';

      // Показываем "nach Vereinbarung" только если выбран кастомный пункт
      if ([service, weekly, months].includes("custom")) {
        priceEl.textContent = "nach Vereinbarung";
        discountEl.textContent = '';
        
        // СКРЫТЬ averageEl при выборе "Telefonisch besprechen"
        if (averageEl) {
          averageEl.style.display = 'none';
        }

        // Убираем required для полей
        serviceInput.removeAttribute('required');
        weeklyInput.removeAttribute('required');
        monthsInput.removeAttribute('required');
        return;
      }

      // ПОКАЗАТЬ averageEl когда НЕ "Telefonisch besprechen"
      if (averageEl) {
        averageEl.style.display = '';
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

      // Защита: если для service нет базовой цены — логируем и показываем 0
      const unitPrice = basePrice[service];
      if (typeof unitPrice !== 'number' || Number.isNaN(unitPrice)) {
        console.warn('DEBUG: Unknown service price for', service);
        priceEl.textContent = "0.00€";
        discountEl.textContent = '';
        return;
      }

      // НОВАЯ ЛОГИКА: Если basePrice === 0, показываем "nach Vereinbarung"
      if (unitPrice === 0) {
        priceEl.textContent = "nach Vereinbarung";
        discountEl.textContent = '';
        
        // СКРЫТЬ averageEl для услуг с ценой 0
        if (averageEl) {
          averageEl.style.display = 'none';
        }
        
        return;
      }

      const total = unitPrice * weekly * months;
      const discount = getDiscount(months);
      const finalPrice = total - (total * discount / 100);

      priceEl.textContent = `${finalPrice.toFixed(2)}€`;
      discountEl.textContent = discount ? `zusätzlicher Rabatt ${discount}%` : '';
    } catch (err) {
      console.error('DEBUG_CODE: CALCULATE_PRICE_ERROR', err);
      priceEl.textContent = '0.00€';
      discountEl.textContent = '';
    }
  }

  // === ПРИВЯЗЫВАЕМ ОБРАБОТЧИКИ К ФОРМЕ (не к контейнеру!) ===
  // Это гарантирует, что обработчики удалятся при клонировании формы
  
  // 1. Клик на кнопку dropdown'а
  form.addEventListener('click', (e) => {
    const btn = e.target.closest('.fixed-price__card-btn');
    if (!btn) return;
    
    e.preventDefault();
    const dropdownType = btn.dataset.dropdown;
    console.log('DEBUG: Dropdown button clicked', { dropdownType });
    
    const dd = form.querySelector(`.fixed-price__dropdown[data-type="${dropdownType}"]`);
    if (!dd) {
      console.error('DEBUG: Dropdown not found', { dropdownType });
      return;
    }

    // Закрываем все другие
    form.querySelectorAll('.fixed-price__dropdown').forEach(d => {
      if (d !== dd) d.classList.remove('open');
    });
    dd.classList.toggle('open');
    console.log('DEBUG: Dropdown toggled', { dropdownType, isOpen: dd.classList.contains('open') });
  });

  // 2. Клик вне dropdown'а — закрываем всё (на document, но проверяем что клик не внутри формы)
  const closeDropdowns = (e) => {
    if (!form.contains(e.target)) {
      form.querySelectorAll('.fixed-price__dropdown').forEach(dd => dd.classList.remove('open'));
    }
  };
  document.addEventListener('click', closeDropdowns);

  // 3. Клик на элемент dropdown'а (li) — привязываем к форме
  form.addEventListener('click', (e) => {
    const li = e.target.closest('.fixed-price__dropdown li');
    if (!li) return;

    e.stopPropagation();
    const dropdown = li.closest('.fixed-price__dropdown');
    if (!dropdown) return;
    
    const type = dropdown.dataset.type;
    const isCustom = li.dataset.custom === "true";

    console.log('DEBUG: Li clicked', { liText: li.textContent.trim(), dropdownType: type, isCustom, liDataValue: li.dataset.value });

    if (isCustom) {
      selections[type] = "custom";

      const btn = form.querySelector(`.fixed-price__card-btn[data-dropdown="${type}"]`);
      if (btn) btn.textContent = li.textContent.trim();

      if (type === 'service') {
        if (titleEl) titleEl.textContent = li.textContent.trim();
        if (descriptionEl) {
          const descArr = serviceDescriptions[li.dataset.value] || serviceDescriptions[li.textContent.trim()] || [];
          descriptionEl.innerHTML = descArr.map(line => `<p>${line}</p>`).join('');
        }
      }

      priceEl.textContent = "nach Vereinbarung";
      discountEl.textContent = '';

      dropdown.classList.remove('open');
      calculatePrice();
      console.log('DEBUG: Custom selection updated', { type, selections });
      return;
    }

    // --- обычная логика ---
    selections[type] = type === 'service'
      ? li.dataset.value
      : parseInt(li.dataset.value.match(/\d+/)[0], 10);

    dropdown.querySelectorAll('li').forEach(x => x.classList.remove('active'));
    li.classList.add('active');

    const btn = form.querySelector(`.fixed-price__card-btn[data-dropdown="${type}"]`);
    if (btn) btn.textContent = li.dataset.value;

    if (type === 'service') {
      if (titleEl) titleEl.textContent = li.dataset.value;
      if (descriptionEl) {
        const descArr = serviceDescriptions[li.dataset.value] || serviceDescriptions[li.textContent.trim()] || [];
        descriptionEl.innerHTML = descArr.map(line => `<p>${line}</p>`).join('');
      }
    }

    dropdown.classList.remove('open');
    calculatePrice();
    console.log('DEBUG: Selection updated', { type, selections, finalPrice: priceEl.textContent });
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
        isSubmitting = false;
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.textContent = 'Anfrage absenden';
        }
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
        if (titleEl) titleEl.textContent = '';
        form.querySelectorAll('.fixed-price__dropdown li').forEach(x => x.classList.remove('active'));
        form.querySelectorAll('.fixed-price__card-btn').forEach(btn => {
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