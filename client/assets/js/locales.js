// ===== Localisation & Custom Select =====

// Ссылки на элементы
const languageSelector = document.getElementById("language-selector"); // скрытый <select>
const customSelect = document.querySelector(".custom-select");
const selectedDiv = customSelect.querySelector(".selected");
const optionItems = customSelect.querySelectorAll(".options li");

// Путь к JSON-файлам локализации
const LOCALE_PATH = "./assets/js/locales/";

// Функция загрузки JSON с переводами
async function loadLanguage(lang) {
  try {
    const response = await fetch(`${LOCALE_PATH}${lang}.json`); // путь относительно HTML
    if (!response.ok) throw new Error(`Cannot load language file: ${lang}`);
    const translations = await response.json();
    applyTranslations(translations);
    localStorage.setItem("lang", lang); // сохраняем выбранный язык
  } catch (err) {
    console.error(err);
  }
}

// Функция применения переводов на страницу
function applyTranslations(translations) {
  // Текстовые элементы
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = translations[key] ?? el.textContent; // fallback если ключ не найден
  });

  // Placeholder'ы для input/textarea
  document.querySelectorAll("[data-placeholder]").forEach((el) => {
    const key = el.dataset.placeholder;
    el.placeholder = translations[key] ?? el.placeholder;
  });
}

// ===== Инициализация языка при старте =====
const savedLang = localStorage.getItem("lang") || "de";
loadLanguage(savedLang);

// Обновляем скрытый select и кастомный div при старте
languageSelector.value = savedLang;
const initialOption = Array.from(optionItems).find(li => li.dataset.value === savedLang);
if (initialOption) selectedDiv.innerHTML = initialOption.innerHTML;

// ===== Работа кастомного селекта =====

// Открытие/закрытие списка опций
selectedDiv.addEventListener("click", () => {
  customSelect.classList.toggle("open");
});

// Выбор опции
optionItems.forEach(option => {
  option.addEventListener("click", () => {
    const newLang = option.dataset.value;

    // 1. Загружаем язык
    loadLanguage(newLang);

    // 2. Обновляем скрытый <select> для формы
    languageSelector.value = newLang;

    // 3. Обновляем визуальный выбранный элемент
    selectedDiv.innerHTML = option.innerHTML;

    // 4. Закрываем кастомный селект
    customSelect.classList.remove("open");
  });
});

// Закрытие селекта при клике вне его
document.addEventListener("click", e => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove("open");
  }
});
// ===== End Localisation & Custom Select =====