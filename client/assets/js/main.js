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





document.addEventListener('DOMContentLoaded', () => {
  // HEADER
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }

  // CARD FLIP
  document.querySelectorAll('.card').forEach(card => {
    const flipBtns = card.querySelectorAll('.flip-btn');
    flipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  });
});










// FAQ
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".faq__item");

  items.forEach((item) => {
    const question = item.querySelector(".faq__question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // закрываем все остальные
      items.forEach((el) => el.classList.remove("active"));

      // открываем только выбранный
      if (!isActive) item.classList.add("active");
    });
  });
});

// End FAQ





// === scroll reviews //

const slider = document.querySelector('.reviews__customers');

let isDown = false;
let startX;
let scrollLeft;
let velocity = 0;
let momentumID;

const startDragging = (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
  velocity = 0;
  cancelMomentum();
};

const stopDragging = () => {
  if (!isDown) return;
  isDown = false;
  slider.classList.remove('active');
  startMomentum();
};

const moveDragging = (e) => {
  if (!isDown) return;
  e.preventDefault(); // не даём выделять текст
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX);
  const prevScroll = slider.scrollLeft;
  slider.scrollLeft = scrollLeft - walk;
  velocity = slider.scrollLeft - prevScroll;
};

const startMomentum = () => {
  cancelMomentum();
  momentumID = requestAnimationFrame(momentumLoop);
};

const cancelMomentum = () => {
  cancelAnimationFrame(momentumID);
};

const momentumLoop = () => {
  slider.scrollLeft += velocity;
  velocity *= 0.95; // коэффициент затухания
  if (Math.abs(velocity) > 0.5) {
    momentumID = requestAnimationFrame(momentumLoop);
  }
};

slider.addEventListener('mousedown', startDragging);
slider.addEventListener('mouseleave', stopDragging);
slider.addEventListener('mouseup', stopDragging);
slider.addEventListener('mousemove', moveDragging);

// Поддержка тачей
slider.addEventListener('touchstart', (e) => startDragging(e.touches[0]));
slider.addEventListener('touchend', stopDragging);
slider.addEventListener('touchmove', (e) => moveDragging(e.touches[0]));

// === End scroll reviews //



// Открытие/закрытие dropdown
//document.querySelectorAll(".fixed-price__card").forEach(card => {

 //const monthlyBtn = card.querySelector(".fixed-price__card-monthly-button");
  //const monthlyDropdown = card.querySelector(".fixed-price__dropdown-monthly");

  //const serviceBtn = card.querySelector(".fixed-price__card-service-button");
  //const serviceDropdown = card.querySelector(".fixed-price__dropdown-service");

  // toggle для monthly
  //if (monthlyBtn && monthlyDropdown) {
  //  monthlyBtn.addEventListener("click", () => {
  //    monthlyDropdown.classList.toggle("active");
//      serviceDropdown?.classList.remove("active"); // закрываем второй
//    });
//
//    monthlyDropdown.querySelectorAll("li").forEach(li => {
//      li.addEventListener("click", () => {
//        monthlyBtn.textContent = li.dataset.value; // устанавливаем текст
//        monthlyDropdown.classList.remove("active");
//      });
//    });
//  }
//
//  // toggle для service
//  if (serviceBtn && serviceDropdown) {
//    serviceBtn.addEventListener("click", () => {
//      serviceDropdown.classList.toggle("active");
//      monthlyDropdown?.classList.remove("active"); // закрываем первый
//    });
//
//    serviceDropdown.querySelectorAll("li").forEach(li => {
//      li.addEventListener("click", () => {
//        serviceBtn.textContent = li.dataset.value;
//        serviceDropdown.classList.remove("active");
//      });
//    });
//  }
//});




















// Используем новые селекторы
const tabButtons = document.querySelectorAll(".services-tabs__button");

// Функция для обработки клика по кнопке-табу
function handleTabClick(btn) {
    // Получаем текущую активную кнопку и контент
    const activeBtn = document.querySelector(".services-tabs__button--active");
    const currentContent = document.querySelector(".services-tabs__content-item.active-content");

    // Если кликнули по активной кнопке, ничего не делаем
    if (activeBtn === btn) return;

    // Смена активной кнопки
    if (activeBtn) {
        activeBtn.classList.remove("services-tabs__button--active");
    }
    btn.classList.add("services-tabs__button--active");

    const key = btn.getAttribute("data-content");
    const targetContent = document.querySelector(`.services-tabs__content-item[data-content-key="${key}"]`);

    if (currentContent && targetContent) {
        // 1. Запускаем плавное скрытие текущего контента
        // Удаляем класс 'fade-in' и устанавливаем opacity: 0 (переход начнется)
        currentContent.classList.remove("fade-in");
        currentContent.style.opacity = 0;

        // 2. Ждем 300мс (время transition)
        setTimeout(() => {
            // 3. Скрываем предыдущий элемент (display: none)
            currentContent.classList.remove("active-content");

            // 4. Показываем новый элемент (display: block)
            targetContent.classList.add("active-content");
            
            // 5. Запускаем плавное появление нового контента
            // Устанавливаем opacity: 1 (через класс fade-in), которое 
            // гарантированно сработает, даже если мы переключимся обратно
            // на вкладку, так как transition не будет "заморожен"
            targetContent.classList.add("fade-in"); 
            targetContent.style.opacity = 1; // Добавим для надежности, если transition не успел сработать
            
        }, 300); // 300ms соответствует времени transition в CSS
    }
}

// Прикрепляем слушатели событий к кнопкам
tabButtons.forEach(btn => {
    btn.addEventListener("click", () => handleTabClick(btn));
});

// Инициализация при загрузке страницы: убедитесь, что активный контент виден
document.addEventListener('DOMContentLoaded', () => {
    const initialContent = document.querySelector(".services-tabs__content-item.active-content");
    if (initialContent) {
        // Устанавливаем начальную прозрачность в 1 и добавляем класс для старта
        initialContent.style.opacity = 1;
        initialContent.classList.add("fade-in");
    }
});