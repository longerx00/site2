// ====== MOCK API (имитация запросов с задержкой) ======
const mockData = {
  users: [
    { username: 'admin', password: '1234', name: 'Администратор' },
    { username: 'student1', password: 'abcd', name: 'Иван Иванов' },
  ],
  schedule: {
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
  },
  reviews: JSON.parse(localStorage.getItem('bot_reviews') || '[]'),
};

function mockFetchSchedule(group, date) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.schedule[group]?.[date] || []);
    }, 700);
  });
}

function mockFetchReviews() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.reviews);
    }, 400);
  });
}

function mockAddReview(review) {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockData.reviews.push(review);
      localStorage.setItem('bot_reviews', JSON.stringify(mockData.reviews));
      resolve(true);
    }, 500);
  });
}

// ====== AUTH ======
const authContainer = document.getElementById('auth-container');
const loginForm = document.getElementById('login-form');
const loginInput = document.getElementById('login-username');
const passInput = document.getElementById('login-password');
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');

function setUserSession(user) {
  localStorage.setItem('bot_user', JSON.stringify(user));
  updateAuthUI();
}

function getUserSession() {
  return JSON.parse(localStorage.getItem('bot_user'));
}

function clearUserSession() {
  localStorage.removeItem('bot_user');
  updateAuthUI();
}

function updateAuthUI() {
  const user = getUserSession();
  if (user) {
    loginForm.style.display = 'none';
    userDisplay.textContent = `Привет, ${user.name}!`;
    userDisplay.style.display = 'inline-block';
    logoutBtn.style.display = 'inline-block';
  } else {
    loginForm.style.display = 'flex';
    userDisplay.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = loginInput.value.trim();
  const password = passInput.value.trim();

  const foundUser = mockData.users.find(u => u.username === username && u.password === password);
  if (foundUser) {
    setUserSession(foundUser);
    loginForm.reset();
    formStatus.textContent = '';
  } else {
    formStatus.textContent = 'Неверное имя пользователя или пароль';
    formStatus.style.color = '#ff6b6b';
  }
});

logoutBtn.addEventListener('click', () => {
  clearUserSession();
});

// ====== TABS ======
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

// ====== SCHEDULE WITH FILTERS ======
const groupSelect = document.getElementById('group-select');
const dateSelect = document.getElementById('date-select');
const teacherFilter = document.getElementById('teacher-filter');
const roomFilter = document.getElementById('room-filter');
const scheduleContainer = document.getElementById('schedule-results');

function getUniqueTeachers(schedule) {
  const teachers = new Set();
  for (const group in schedule) {
    for (const date in schedule[group]) {
      schedule[group][date].forEach(lesson => teachers.add(lesson.teacher));
    }
  }
  return [...teachers].sort();
}
function getUniqueRooms(schedule) {
  const rooms = new Set();
  for (const group in schedule) {
    for (const date in schedule[group]) {
      schedule[group][date].forEach(lesson => rooms.add(lesson.room));
    }
  }
  return [...rooms].sort();
}

function populateFilters() {
  // Populate teacher filter
  const teachers = getUniqueTeachers(mockData.schedule);
  teacherFilter.innerHTML = '<option value="">Все преподаватели</option>';
  teachers.forEach(t => {
    const option = document.createElement('option');
    option.value = t;
    option.textContent = t;
    teacherFilter.appendChild(option);
  });
  // Populate rooms filter
  const rooms = getUniqueRooms(mockData.schedule);
  roomFilter.innerHTML = '<option value="">Все аудитории</option>';
  rooms.forEach(r => {
    const option = document.createElement('option');
    option.value = r;
    option.textContent = r;
    roomFilter.appendChild(option);
  });
}

async function renderSchedule(group, date, teacher = '', room = '') {
  scheduleContainer.innerHTML = '<p>Загрузка расписания...</p>';
  if (!group || !date) {
    scheduleContainer.innerHTML = '<p>Пожалуйста, выберите группу и дату.</p>';
    return;
  }
  const lessons = await mockFetchSchedule(group, date);
  if (!lessons.length) {
    scheduleContainer.innerHTML = '<p>Расписание на выбранную дату отсутствует.</p>';
    return;
  }
  // Фильтруем по преподавателю и аудитории
  let filtered = lessons;
  if (teacher) {
    filtered = filtered.filter(lesson => lesson.teacher === teacher);
  }
  if (room) {
    filtered = filtered.filter(lesson => lesson.room === room);
  }
  if (!filtered.length) {
    scheduleContainer.innerHTML = '<p>Нет занятий по выбранным фильтрам.</p>';
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
  filtered.forEach(lesson => {
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

  scheduleContainer.innerHTML = '';
  scheduleContainer.appendChild(table);
}

function updateSchedule() {
  renderSchedule(
    groupSelect.value,
    dateSelect.value,
    teacherFilter.value,
    roomFilter.value
  );
}

// ====== CALENDAR (простая подсветка дат с занятиями) ======

const calendarContainer = document.getElementById('calendar-container');
const calendarDate = document.getElementById('date-select');

function buildCalendar(year, month) {
  calendarContainer.innerHTML = '';
  const firstDay = new Date(year, month, 1).getDay(); // 0-вс, 1-пн...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Шапка календаря
  const daysNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const headerRow = document.createElement('div');
  headerRow.className = 'calendar-header';
  daysNames.forEach(day => {
    const dayName = document.createElement('div');
    dayName.className = 'calendar-day-name';
    dayName.textContent = day;
    headerRow.appendChild(dayName);
  });
  calendarContainer.appendChild(headerRow);

  // Пустые дни перед началом месяца
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-cell empty';
    calendarContainer.appendChild(emptyCell);
  }

  // Дни месяца
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d
      .toString()
      .padStart(2, '0')}`;

    // Проверяем есть ли занятия на эту дату в выбранной группе
    const group = groupSelect.value;
    const hasLessons = !!(mockData.schedule[group]?.[dateStr]?.length);

    if (hasLessons) {
      cell.classList.add('active-date');
      cell.title = 'Есть занятия';
    }
    cell.textContent = d;

    // При клике выбираем дату
    cell.addEventListener('click', () => {
      calendarDate.value = dateStr;
      updateSchedule();
    });

    calendarContainer.appendChild(cell);
  }
}

// При загрузке страницы показываем текущий месяц
function initCalendar() {
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth();
  buildCalendar(year, month);
}

// ====== FEEDBACK / REVIEWS ======
const form = document.getElementById('feedback-form');
const formStatus = document.getElementById('form-status');
const reviewsList = document.getElementById('reviews-list');

async function loadReviews() {
  const reviews = await mockFetchReviews();
  reviewsList.innerHTML = '';
  if (!reviews.length) {
    reviewsList.innerHTML = '<p>Пока нет отзывов. Будьте первым!</p>';
    return;
  }
  reviews.slice().reverse().forEach(r => {
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `
      <strong>${r.name}</strong> (${new Date(r.date).toLocaleString()}):<br>
      <p>${r.message}</p>
    `;
    reviewsList.appendChild(div);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    formStatus.textContent = 'Пожалуйста, заполните все поля корректно.';
    formStatus.style.color = '#ff6b6b';
    return;
  }

  const user = getUserSession();
  if (!user) {
    formStatus.textContent = 'Для отправки отзыва необходимо войти в систему.';
    formStatus.style.color = '#ff6b6b';
    return;
  }

  formStatus.style.color = '#00ffff';
  formStatus.textContent = 'Отправка...';

  const newReview = {
    name: user.name,
    email: form.email.value.trim(),
    message: form.message.value.trim(),
    date: new Date().toISOString(),
  };

  await mockAddReview(newReview);
  formStatus.textContent = 'Спасибо за ваш отзыв!';
  form.reset();
  loadReviews();
});

// ====== ИНИЦИАЛИЗАЦИЯ ======
updateAuthUI();
populateFilters();

// Установка сегодняшней даты и начальная отрисовка
const today = new Date().toISOString().split('T')[0];
dateSelect.value = today;

initCalendar();
updateSchedule();
loadReviews();

// Обработчики фильтров и выбора даты
groupSelect.addEventListener('change', () => {
  initCalendar();
  updateSchedule();
});
dateSelect.addEventListener('change', updateSchedule);
teacherFilter.addEventListener('change', updateSchedule);
roomFilter.addEventListener('change', updateSchedule);
