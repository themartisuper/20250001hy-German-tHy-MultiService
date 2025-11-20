const priceEl = document.querySelector('.fixed-price__card-price');
const discountEl = document.querySelector('.fixed-price__discount');

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

  // Показываем "nach Vereinbarung" только если выбран кастомный пункт
  if ([service, weekly, months].includes("custom")) {
    priceEl.textContent = "nach Vereinbarung";
    discountEl.textContent = '';
    return;
  }

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

// --- DROPDOWN --- 
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

// --- SELECTION --- 
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
