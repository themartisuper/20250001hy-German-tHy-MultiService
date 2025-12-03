document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.before-after__carousel-track');
  const prevBtn = document.querySelector('.before-after__nav--prev');
  const nextBtn = document.querySelector('.before-after__nav--next');
  const indicators = document.querySelectorAll('.before-after__indicator');
  const items = document.querySelectorAll('.before-after__item');
  
  if (!track || !prevBtn || !nextBtn || items.length === 0) return;

  let currentIndex = 0;
  const totalItems = items.length;

  // Функция обновления карусели
  function updateCarousel() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;

    // Обновление индикаторов
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add('before-after__indicator--active');
      } else {
        indicator.classList.remove('before-after__indicator--active');
      }
    });
  }

  // Навигация: следующий слайд
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
  });

  // Навигация: предыдущий слайд
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
  });

  // Клик по индикаторам
  indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => {
      currentIndex = parseInt(indicator.dataset.index, 10);
      updateCarousel();
    });
  });

  // Инициализация
  updateCarousel();

  // Опционально: автоматическое переключение каждые 5 секунд
  // setInterval(() => {
  //   currentIndex = (currentIndex + 1) % totalItems;
  //   updateCarousel();
  // }, 5000);
});
