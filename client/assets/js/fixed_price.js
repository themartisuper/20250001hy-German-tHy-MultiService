// === DROPDOWNS ===
const serviceBtn = document.querySelector('.fixed-price__card-service-button');
const weeklyBtn = document.querySelector('.fixed-price__card-weekly-button');
const monthsBtn = document.querySelector('.fixed-price__card-months-button');

const ddService = document.querySelector('.fixed-price__dropdown-service');
const ddWeekly = document.querySelector('.fixed-price__dropdown-weekly');
const ddMonths = document.querySelector('.fixed-price__dropdown-months');

function closeAll() {
  ddService.classList.remove('open');
  ddWeekly.classList.remove('open');
  ddMonths.classList.remove('open');
}

// Открытие
serviceBtn.addEventListener('click', () => {
  const isOpen = ddService.classList.contains('open');
  closeAll();
  ddService.classList.toggle('open', !isOpen);
});

weeklyBtn.addEventListener('click', () => {
  const isOpen = ddWeekly.classList.contains('open');
  closeAll();
  ddWeekly.classList.toggle('open', !isOpen);
});

monthsBtn.addEventListener('click', () => {
  const isOpen = ddMonths.classList.contains('open');
  closeAll();
  ddMonths.classList.toggle('open', !isOpen);
});

// Закрытие кликом вне
document.addEventListener('click', (e) => {
  if (!e.target.closest('.fixed-price__card-oprions')) {
    closeAll();
  }
});

// === PRICE SYSTEM ===
const priceEl = document.querySelector('.fixed-price__card-price');

// selections
let selectedService = null;
let selectedWeekly = null;
let selectedMonths = null;

// base prices
const basePrice = {
  "Fahrzeugüberführung": 30,
  "Kurierdienste": 25,
  "Lieferant": 28,
  "Möbeltransport / Umzugshilfe": 40,
  "Tragehilfe": 22,
  "Zum Flughafen hin-zurück fahren": 35
};

// discounts
function getDiscount(months) {
  if (months >= 12) return 0.20;
  if (months >= 6) return 0.10;
  if (months >= 3) return 0.05;
  return 0;
}

function calculatePrice() {
  if ([selectedService, selectedWeekly, selectedMonths].includes(null)) {
    priceEl.textContent = "xxx€";
    return;
  }

  const base = basePrice[selectedService];
  const days = parseInt(selectedWeekly, 10);
  const months = parseInt(selectedMonths, 10);
  const discount = getDiscount(months);

  let total = base * days * months;
  total -= total * discount;

  priceEl.textContent = total.toFixed(2) + "€";
}

// === SERVICE selection ===
document.querySelectorAll('.fixed-price__dropdown-service li').forEach(li => {
  li.addEventListener('click', () => {
    selectedService = li.dataset.value;

    // UI обновление
    document.querySelectorAll('.fixed-price__dropdown-service li').forEach(x => x.classList.remove('active'));
    li.classList.add('active');
    serviceBtn.textContent = selectedService;

    ddService.classList.remove('open');
    calculatePrice();
  });
});

// === WEEKLY selection ===
document.querySelectorAll('.fixed-price__dropdown-weekly li').forEach(li => {
  li.addEventListener('click', () => {
    selectedWeekly = parseInt(li.dataset.value.match(/\d+/)[0], 10);

    document.querySelectorAll('.fixed-price__dropdown-weekly li').forEach(x => x.classList.remove('active'));
    li.classList.add('active');
    weeklyBtn.textContent = li.dataset.value;

    ddWeekly.classList.remove('open');
    calculatePrice();
  });
});

// === MONTHS selection ===
document.querySelectorAll('.fixed-price__dropdown-months li').forEach(li => {
  li.addEventListener('click', () => {
    selectedMonths = parseInt(li.dataset.value.match(/\d+/)[0], 10);

    document.querySelectorAll('.fixed-price__dropdown-months li').forEach(x => x.classList.remove('active'));
    li.classList.add('active');
    monthsBtn.textContent = li.dataset.value;

    ddMonths.classList.remove('open');
    calculatePrice();
  });
});
