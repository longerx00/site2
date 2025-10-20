// Мобильное меню
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Закрыть меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Плавная прокрутка для навигационных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Наблюдаем за всеми секциями и карточками
document.querySelectorAll('.section, .feature-card, .about-card, .step').forEach(el => {
    observer.observe(el);
});

// Счетчик пользователей (анимированный)
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+ студентов';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+ студентов';
        }
    }, 16);
}

// Запускаем анимацию счетчика когда секция контактов видна
const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const userCount = document.querySelector('.user-count');
            if (userCount && !userCount.dataset.animated) {
                animateCounter(userCount, 250, 2000);
                userCount.dataset.animated = 'true';
            }
        }
    });
});

const contactSection = document.querySelector('#contact');
if (contactSection) {
    contactObserver.observe(contactSection);
}

// Динамическое обновление года в футере
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.querySelector('footer p');
    if (yearElement) {
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', new Date().getFullYear());
    }
});

// Добавляем интерактивность для кнопок бота в макете
document.querySelectorAll('.bot-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});
