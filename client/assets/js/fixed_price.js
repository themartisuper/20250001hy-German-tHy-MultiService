// dropdown

const serviceBtn = document.querySelector('.fixed-price__card-service-button');
const weeklyBtn = document.querySelector('.fixed-price__card-weekly-button');
const monthsBtn = document.querySelector('.fixed-price__card-months-button');

const ddService = document.querySelector('.fixed-price__dropdown-service');
const ddWeekly = document.querySelector('.fixed-price__dropdown-weekly');
const ddMonths = document.querySelector('.fixed-price__dropdown-months');

function closeAll() {
  ddService.style.display = 'none';
  ddWeekly.style.display = 'none';
  ddMonths.style.display = 'none';
}

serviceBtn.addEventListener('click', () => {
  const isOpen = ddService.style.display === 'block';
  closeAll();
  ddService.style.display = isOpen ? 'none' : 'block';
});

weeklyBtn.addEventListener('click', () => {
  const isOpen = ddWeekly.style.display === 'block';
  closeAll();
  ddWeekly.style.display = isOpen ? 'none' : 'block';
});

monthsBtn.addEventListener('click', () => {
  const isOpen = ddMonths.style.display === 'block';
  closeAll();
  ddMonths.style.display = isOpen ? 'none' : 'block';
});

// price
const priceEl = document.querySelector('.fixed-price__card-price');

// selections
let selectedService = null;
let selectedWeekly = null;
let selectedMonths = null;

// базовые цены
const basePrice = {
  "Fahrzeugüberführung": 30,
  "Kurierdienste": 25,
  "Lieferant": 28,
  "Möbeltransport / Umzugshilfe": 40,
  "Tragehilfe": 22,
  "Zum Flughafen hin-zurück fahren": 35
};

// скидки
function getDiscount(months) {
  if (months >= 12) return 0.20;
  if (months >= 6) return 0.10;
  if (months >= 3) return 0.05;
  return 0;
}

function calculatePrice() {
  if (!selectedService || !selectedWeekly || !selectedMonths) {
    priceEl.textContent = "xxx€";
    return;
  }

  const base = basePrice[selectedService];
  const days = parseInt(selectedWeekly);
  const months = parseInt(selectedMonths);

  const discount = getDiscount(months);

  let total = base * days * months;
  total = total - (total * discount);

  priceEl.textContent = total.toFixed(2) + "€";
}

// SERVICE selection
document.querySelectorAll('.fixed-price__dropdown-service li').forEach(li => {
  li.addEventListener('click', () => {
    selectedService = li.dataset.value;
    calculatePrice();
  });
});

// WEEKLY selection
document.querySelectorAll('.fixed-price__dropdown-weekly li').forEach(li => {
  li.addEventListener('click', () => {
    selectedWeekly = li.dataset.value.match(/\d+/)[0];
    calculatePrice();
  });
});

// MONTHS selection
document.querySelectorAll('.fixed-price__dropdown-months li').forEach(li => {
  li.addEventListener('click', () => {
    selectedMonths = li.dataset.value.match(/\d+/)[0];
    calculatePrice();
  });
});