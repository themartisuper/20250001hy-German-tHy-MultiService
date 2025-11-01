// ===== Localisation =====
const languageSelector = document.getElementById("language-selector");

async function loadLanguage(lang) {
  try {
    const response = await fetch(`./assets/js/locales/${lang}.json`) // путь относительно исполняемого html 
    if (!response.ok) throw new Error(`Cannot load language file: ${lang}`);
    const translations = await response.json();
    applyTranslations(translations);
    localStorage.setItem("lang", lang);
  } catch (err) {
    console.error(err);
  }
}

function applyTranslations(translations) {
  // Текстовые элементы
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) el.textContent = translations[key];
  });

  // Placeholder'ы
  document.querySelectorAll("[data-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-placeholder");
    if (translations[key]) el.placeholder = translations[key];
  });
}

// Загружаем язык при старте
const savedLang = localStorage.getItem("lang") || "en";
loadLanguage(savedLang);
languageSelector.value = savedLang;

// Смена языка вручную
languageSelector.addEventListener("change", (e) => {
  const newLang = e.target.value;
  loadLanguage(newLang);
});
// ===== End localisation =====