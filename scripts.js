// Переключение вкладок
const tabs = document.querySelectorAll('nav ul.tabs li');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    tabContents.forEach(tc => {
      tc.classList.remove('active');
      if (tc.id === target) {
        tc.classList.add('active');
      }
    });
  });
});

// Имитация расписания (данные)
const fakeSchedule = {
  group_101: {
    '2025-10-20': [
      { time: '09:00 - 10:30', subject: 'Математика', teacher: 'Иванов И.И.', room: '101' },
      { time: '10:45 - 12:15', subject: 'Физика', teacher: 'Петров П.П.', room: '102' },
    ],
    '2025-10-21': [
      { time: '09:00 - 10:30', subject: 'Информатика', teacher: 'Сидоров С.С.', room: '201' },
    ],
  },
  group_102: {
    '2025-10-20': [
      { time: '08:30 - 10:00', subject: 'История', teacher: 'Козлова А.А.', room: '105' },
      { time: '10:15 - 11:45', subject: 'Английский язык', teacher: 'Смирнова М.М.', room: '106' },
    ],
  },
  group_103: {
    '2025-10-20': [
      { time: '09:00 - 10:30', subject: 'Биология', teacher: 'Николаев Н.Н.', room: '103' },
    ],
  },
};

// Функция для отображения расписания
function renderSchedule(group, date) {
  const scheduleContainer = document.getElementById('schedule-results');
  scheduleContainer.innerHTML = '';

  if (!group || !date) {
    scheduleContainer.innerHTML = '<p>Пожалуйста, выберите группу и дату.</p>';
    return;
  }

  const daySchedule = fakeSchedule[group]?.[date];
  if (!daySchedule || daySchedule.length === 0) {
    scheduleContainer.innerHTML = `<p>Расписание на выбранную дату отсутствует.</p>`;
    return;
  }

  const table = document.createElement('table');
  table.setAttribute('aria-label', `Расписание группы ${group} на дату ${date}`);
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Время', 'Предмет', 'Преподаватель', 'Аудитория'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    th.style.borderBottom = '2px solid #00ffff';
    th.style.padding = '8px';
    th.style.textAlign = 'left';
    th.style.color = '#00ffff';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  daySchedule.forEach(lesson => {
    const tr = document.createElement('tr');
    ['time', 'subject', 'teacher', 'room'].forEach(key => {
      const td = document.createElement('td');
      td.textContent = lesson[key];
      td.style.padding = '8px';
      td.style.borderBottom = '1px solid #004444';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  scheduleContainer.appendChild(table);
}

// Обработчики фильтров расписания
const groupSelect = document.getElementById('group-select');
const dateSelect = document.getElementById('date-select');

function updateSchedule() {
  renderSchedule(groupSelect.value, dateSelect.value);
}

// По умолчанию ставим сегодняшнюю дату, если она есть в расписании
const today = new Date().toISOString().split('T')[0];
dateSelect.value = today;

updateSchedule();

groupSelect.addEventListener('change', updateSchedule);
dateSelect.addEventListener('change', updateSchedule);

// Валидация и имитация отправки формы обратной связи
const form = document.getElementById('feedback-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', e => {
  e.preventDefault();

  if (!form.checkValidity()) {
    formStatus.textContent = 'Пожалуйста, заполните все поля корректно.';
    formStatus.style.color = '#ff6b6b';
    return;
  }

  formStatus.style.color = '#00ffff';
  formStatus.textContent = 'Отправка...';

  // Имитация отправки (2 секунды)
  setTimeout(() => {
    formStatus.textContent = 'Спасибо за ваш отзыв! Мы свяжемся с вами в ближайшее время.';
    form.reset();
  }, 2000);
});
