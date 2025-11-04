const header = document.querySelector('.header__content');
const logo = header.querySelector('.logo');
const maxScroll = 150; // на сколько пикселей скролла header плавно поднимается
const startTop = 40; // начальное смещение сверху в px

window.addEventListener('scroll', () => {
  let scroll = Math.min(window.scrollY, maxScroll);
  let progress = scroll / maxScroll; // от 0 до 1

  // плавно меняем top от startTop до 0
  header.style.top = `${startTop * (1 - progress)}px`;

  // плавно уменьшаем padding
  let paddingY = 1 + (0.4 - 1) * progress; // от 1rem до 0.4rem
  let paddingX = 1.5 - 0.5 * progress;      // от 1.5rem до 1rem
  header.style.padding = `${paddingY}rem ${paddingX}rem`;

  // плавно уменьшаем логотип
  let scale = 1 - 0.2 * progress; // от 1 до 0.8
  logo.style.transform = `scale(${scale})`;

  // плавно усиливаем тень
  header.style.boxShadow = `0 ${5 + 3 * progress}px ${10 + 5 * progress}px rgba(0,0,0,${0.2 + 0.1 * progress})`;
});