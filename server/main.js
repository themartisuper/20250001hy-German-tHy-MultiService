document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  let index = 0;

  // дублируем слайды, чтобы создать цикл
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  let currentIndex = 1; // начинаем с первого оригинального
  const slideWidth = slides[0].offsetWidth + 20;
  track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;

  function moveTo(indexShift) {
    currentIndex += indexShift;
    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
  }

  nextBtn.addEventListener("click", () => moveTo(1));
  prevBtn.addEventListener("click", () => moveTo(-1));

  track.addEventListener("transitionend", () => {
    const items = track.querySelectorAll("article");
    if (items[currentIndex].isSameNode(firstClone)) {
      track.style.transition = "none";
      currentIndex = 1;
      track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
    }
    if (items[currentIndex].isSameNode(lastClone)) {
      track.style.transition = "none";
      currentIndex = slides.length;
      track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
    }
  });

  // Автопрокрутка
  let auto = setInterval(() => moveTo(1), 3000);
  track.addEventListener("mouseenter", () => clearInterval(auto));
  track.addEventListener("mouseleave", () => auto = setInterval(() => moveTo(1), 3000));
});
