const header = document.querySelector('.header__content');
const logo = header.querySelector('.logo');
const maxScroll = 150;
const startTop = 40;

window.addEventListener('scroll', () => {
  let scroll = Math.min(window.scrollY, maxScroll);
  let progress = scroll / maxScroll;
  header.style.top = `${startTop * (1 - progress)}px`;
  let paddingY = 1 + (0.4 - 1) * progress;
  let paddingX = 1.5 - 0.5 * progress;
  header.style.padding = `${paddingY}rem ${paddingX}rem`;
  let scale = 1 - 0.2 * progress;
  logo.style.transform = `scale(${scale})`;
  header.style.boxShadow = `0 ${5 + 3 * progress}px ${10 + 5 * progress}px rgba(0,0,0,${0.2 + 0.1 * progress})`;
});

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }
  document.querySelectorAll('.card').forEach(card => {
    const flipBtns = card.querySelectorAll('.flip-btn');
    flipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".faq__item");
  items.forEach((item) => {
    const question = item.querySelector(".faq__question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      items.forEach((el) => el.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    });
  });
});

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
  e.preventDefault();
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
  velocity *= 0.95;
  if (Math.abs(velocity) > 0.5) {
    momentumID = requestAnimationFrame(momentumLoop);
  }
};

slider.addEventListener('mousedown', startDragging);
slider.addEventListener('mouseleave', stopDragging);
slider.addEventListener('mouseup', stopDragging);
slider.addEventListener('mousemove', moveDragging);
slider.addEventListener('touchstart', (e) => startDragging(e.touches[0]));
slider.addEventListener('touchend', stopDragging);
slider.addEventListener('touchmove', (e) => moveDragging(e.touches[0]));

// === TAB SWITCHING LOGIC ===
document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".services-tabs__button");
    const contentItems = document.querySelectorAll(".services-tabs__content-item");

    if (tabButtons.length === 0 || contentItems.length === 0) return;

    function switchTab(button) {
        tabButtons.forEach(btn => btn.classList.remove("services-tabs__button--active"));
        contentItems.forEach(item => item.classList.remove("active-content"));

        button.classList.add("services-tabs__button--active");

        const contentKey = button.dataset.content;
        const targetContent = document.querySelector(`.services-tabs__content-item[data-content-key="${contentKey}"]`);

        if (targetContent) {
            targetContent.classList.add("active-content");

            if (typeof initFixedPriceForm === 'function') {
                initFixedPriceForm(targetContent);
            }
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            switchTab(button);
        });
    });

    // Initialize for first active tab at page load
    const initialActiveContent = document.querySelector(".services-tabs__content-item.active-content");
    if (initialActiveContent && typeof initFixedPriceForm === 'function') {
        initFixedPriceForm(initialActiveContent);
    }
});
