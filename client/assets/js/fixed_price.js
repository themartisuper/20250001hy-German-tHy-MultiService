document.addEventListener("DOMContentLoaded", () => {
  const priceEl = document.querySelector(".fixed-price__card-price");

  const servicePrices = {
    "Fahrzeugüberführung": 120,
    "Kurierdienste": 90,
    "Lieferant": 85,
    "Möbeltransport / Umzugshilfe": 150,
    "Tragehilfe": 70,
    "Zum Flughafen hin-zurück fahren": 110
  };

  const frequencyMultiplier = {
    "1 mal pro Woche": 1,
    "2 mal pro Woche": 2,
    "3 mal pro Woche": 3,
    "4 mal pro Woche": 4,
    "5 mal pro Woche": 5,
    "6 mal pro Woche": 6,
    "7 mal pro Woche": 7
  };

  let selectedService = null;
  let selectedFrequency = null;

  const updatePrice = () => {
    if (!selectedService || !selectedFrequency) {
      priceEl.textContent = "xxx€";
      return;
    }
    const base = servicePrices[selectedService];
    const mult = frequencyMultiplier[selectedFrequency];
    const total = base * mult;
    priceEl.textContent = total + "€";
  };

  document
    .querySelectorAll(".fixed-price__dropdown-service ul li")
    .forEach(li => {
      li.addEventListener("click", () => {
        selectedService = li.dataset.value;
        updatePrice();
      });
    });

  document
    .querySelectorAll(".fixed-price__dropdown-monthly ul li")
    .forEach(li => {
      li.addEventListener("click", () => {
        selectedFrequency = li.dataset.value;
        updatePrice();
      });
    });
});
