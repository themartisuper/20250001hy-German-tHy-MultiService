const customSelect = document.querySelector(".custom-select");
const selected = customSelect.querySelector(".selected");
const options = customSelect.querySelectorAll(".options li");
const realSelect = document.getElementById("language-selector");

selected.addEventListener("click", () => {
  customSelect.classList.toggle("open");
});

options.forEach(option => {
  option.addEventListener("click", () => {
    selected.innerHTML = option.innerHTML;
    realSelect.value = option.dataset.value; // обновляем настоящий select
    customSelect.classList.remove("open");
  });
});

document.addEventListener("click", e => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove("open");
  }
});