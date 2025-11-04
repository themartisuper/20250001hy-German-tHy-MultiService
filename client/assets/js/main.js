const header = document.querySelector('.header__content');
const logo = header.querySelector('.logo');
const maxScroll = 150; // на сколько пикселей скролла header плавно поднимается

window.addEventListener('scroll', () => {
  let scroll = Math.min(window.scrollY, maxScroll);
  let progress = scroll / maxScroll; // от 0 до 1

  // плавно меняем top
  header.style.top = `${0 * progress}px`; // от 84px до 0px

  // плавно уменьшаем padding
  let padding = 1 + (0.4 - 1) * progress; // от 1rem до 0.4rem
  header.style.padding = `${padding}rem ${1.5 - 0.5 * progress}rem`;

  // плавно уменьшаем логотип
  let scale = 1 - 0.2 * progress; // от 1 до 0.8
  logo.style.transform = `scale(${scale})`;

  // плавно усиливаем тень
  header.style.boxShadow = `0 ${5 + 3 * progress}px ${10 + 5 * progress}px rgba(0,0,0,${0.2 + 0.1 * progress})`;
});






