document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('nav ul.tabs li');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Снять выделение со всех вкладок
      tabs.forEach(t => t.classList.remove('active'));
      // Скрыть все контенты
      contents.forEach(c => c.classList.remove('active'));

      // Добавить активность на выбранную вкладку
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  // Обработка формы обратной связи
  const form = document.getElementById('feedback-form');
  const formMessage = document.getElementById('form-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Простая валидация
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      formMessage.style.color = 'red';
      formMessage.textContent = 'Пожалуйста, заполните все поля.';
      return;
    }

    // Проверка email простая (регулярка)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formMessage.style.color = 'red';
      formMessage.textContent = 'Пожалуйста, введите корректный email.';
      return;
    }

    // Здесь можно отправить данные на сервер (пока просто имитируем)
    formMessage.style.color = 'green';
    formMessage.textContent = 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.';

    // Очистить форму
    form.reset();
  });
});
