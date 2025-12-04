document.addEventListener('DOMContentLoaded', () => {
  const reviewBtn = document.getElementById('review-btn');
  const popup = document.getElementById('review-popup');
  const closeBtn = popup?.querySelector('.review-popup-close');
  const form = document.getElementById('review-form');
  
  const dropdownBtn = popup?.querySelector('.review-form__dropdown-btn');
  const dropdown = popup?.querySelector('.review-form__dropdown');
  const dropdownItems = popup?.querySelectorAll('.review-form__dropdown li');
  const hiddenInput = document.getElementById('review-service-value');

  // Открытие popup
  reviewBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    popup?.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку
  });

  // Закрытие popup при клике на кнопку закрытия
  closeBtn?.addEventListener('click', () => {
    popup?.classList.add('hidden');
    document.body.style.overflow = ''; // Восстанавливаем прокрутку
  });

  // Закрытие popup при клике вне контента
  popup?.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  // Закрытие popup при нажатии Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !popup?.classList.contains('hidden')) {
      popup?.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  // Логика dropdown
  dropdownBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown?.classList.toggle('open');
  });

  // Выбор элемента из dropdown
  dropdownItems?.forEach(item => {
    item.addEventListener('click', () => {
      const value = item.dataset.value;
      dropdownBtn.textContent = value;
      dropdownBtn.classList.add('selected');
      hiddenInput.value = value;
      dropdown?.classList.remove('open');
    });
  });

  // Закрытие dropdown при клике вне его
  document.addEventListener('click', (e) => {
    if (!dropdown?.contains(e.target) && e.target !== dropdownBtn) {
      dropdown?.classList.remove('open');
    }
  });

  // Обработка отправки формы
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Валидация
    const lastname = form.querySelector('[name="review_lastname"]').value.trim();
    const rating = form.querySelector('[name="review_rating"]:checked')?.value;
    const service = hiddenInput.value;

    if (!lastname) {
      alert('Bitte geben Sie Ihren Namen ein.');
      return;
    }

    if (!rating) {
      alert('Bitte wählen Sie eine Bewertung (Sterne) aus.');
      return;
    }

    if (!service) {
      alert('Bitte wählen Sie eine Dienstleistung aus.');
      dropdownBtn.style.borderColor = 'red';
      setTimeout(() => dropdownBtn.style.borderColor = '#ddd', 2000);
      return;
    }

    // Сбор данных формы
    const formData = {
      name: lastname,
      rating: rating,
      service: service,
      comment: form.querySelector('[name="review_comment"]').value.trim() || ''
    };

    console.log('Review data:', formData);

    // Отправка на сервер через Vercel + Mailjet
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Vielen Dank für Ihre Bewertung!');
        
        // Закрываем popup и очищаем форму
        popup?.classList.add('hidden');
        document.body.style.overflow = '';
        form.reset();
        dropdownBtn.textContent = 'Auswählen';
        dropdownBtn.classList.remove('selected');
        hiddenInput.value = '';
      } else {
        console.error('Server error:', result);
        alert('Es gab einen Fehler beim Senden Ihrer Bewertung. Bitte versuchen Sie es später erneut.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Es gab einen Fehler beim Senden Ihrer Bewertung. Bitte versuchen Sie es später erneut.');
    }
  });
});
