// Extended JavaScript functionality for StudyBot Pro

// Premium Features Counter Animation
function animatePremiumStats() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace('+', '');
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment) + '+';
            setTimeout(() => animatePremiumStats(counter, target, speed), 1);
        } else {
            counter.innerText = target + '+';
        }
    });
}

// Pricing Card Interaction
function initPricingCards() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('popular')) {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('popular')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'var(--shadow)';
            } else {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        // Purchase button click
        const purchaseBtn = this.querySelector('.btn-primary');
        if (purchaseBtn) {
            purchaseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showPurchaseModal(this.closest('.pricing-card'));
            });
        }
    });
}

// Purchase Modal
function showPurchaseModal(pricingCard) {
    const planName = pricingCard.querySelector('.pricing-name').textContent;
    const planPrice = pricingCard.querySelector('.pricing-price').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'purchase-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h3>Выбор способа оплаты - ${planName}</h3>
                <p class="modal-price">${planPrice}/месяц</p>
                <div class="payment-methods">
                    <div class="payment-method active" data-method="card">
                        <i class="fas fa-credit-card"></i>
                        <span>Банковская карта</span>
                    </div>
                    <div class="payment-method" data-method="yoomoney">
                        <i class="fas fa-wallet"></i>
                        <span>ЮMoney</span>
                    </div>
                    <div class="payment-method" data-method="crypto">
                        <i class="fab fa-bitcoin"></i>
                        <span>Криптовалюта</span>
                    </div>
                </div>
                <form class="payment-form">
                    <div class="form-group">
                        <label>Email для доступа</label>
                        <input type="email" placeholder="your@email.com" required>
                    </div>
                    <div class="form-group card-fields">
                        <label>Номер карты</label>
                        <input type="text" placeholder="1234 5678 9012 3456" maxlength="19">
                    </div>
                    <button type="submit" class="btn btn-primary">Оплатить ${planPrice}</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Modal functionality
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            modal.remove();
        }
    });
    
    // Payment method selection
    modal.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            modal.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide card fields based on selection
            const cardFields = modal.querySelector('.card-fields');
            if (this.dataset.method === 'card') {
                cardFields.style.display = 'block';
            } else {
                cardFields.style.display = 'none';
            }
        });
    });
}

// Testimonials Carousel
function initTestimonialsCarousel() {
    const testimonialGrid = document.querySelector('.testimonials-grid');
    const testimonials = Array.from(testimonialGrid.children);
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.opacity = i === index ? '1' : '0.3';
            testimonial.style.transform = i === index ? 'scale(1)' : 'scale(0.9)';
        });
    }
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
    
    showTestimonial(currentIndex);
}

// FAQ Accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulate API call
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('success', 'Вы успешно подписались на рассылку!');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Notification System
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Вернуться наверх');
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Loading Progress Bar
function initLoadingBar() {
    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    document.body.appendChild(loadingBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        loadingBar.style.width = scrollPercent + '%';
    });
}

// Intersection Observer for Advanced Animations
function initAdvancedAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add specific animations based on data attributes
                const animation = entry.target.dataset.animation;
                if (animation) {
                    entry.target.style.animation = `${animation} 0.6s ease-out forwards`;
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-animation attribute
    document.querySelectorAll('[data-animation]').forEach(el => {
        observer.observe(el);
    });
}

// Real-time User Counter
function initUserCounter() {
    const userCountElement = document.querySelector('.user-counter');
    if (userCountElement) {
        // Simulate real-time user count updates
        setInterval(() => {
            const currentCount = parseInt(userCountElement.textContent);
            const increment = Math.floor(Math.random() * 3);
            userCountElement.textContent = currentCount + increment;
        }, 5000);
    }
}

// Theme Switcher
function initThemeSwitcher() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Переключить тему');
    
    document.querySelector('.nav-container').appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
}

// Language Switcher
function initLanguageSwitcher() {
    const langToggle = document.createElement('div');
    langToggle.className = 'language-switcher';
    langToggle.innerHTML = `
        <button class="lang-btn">RU</button>
        <div class="lang-dropdown">
            <button data-lang="en">EN</button>
            <button data-lang="es">ES</button>
            <button data-lang="de">DE</button>
        </div>
    `;
    
    document.querySelector('.nav-container').appendChild(langToggle);
    
    langToggle.querySelector('.lang-btn').addEventListener('click', () => {
        langToggle.classList.toggle('active');
    });
    
    langToggle.querySelectorAll('.lang-dropdown button').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            // Here you would typically load language files
            showNotification('info', `Language switched to ${lang}`);
            langToggle.querySelector('.lang-btn').textContent = lang.toUpperCase();
            langToggle.classList.remove('active');
        });
    });
}

// Performance Monitoring
function initPerformanceMonitor() {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            console.log(`${entry.name}: ${entry.value}`);
            
            // Report to analytics
            if (entry.name === 'LCP') {
                gtag('event', 'LCP', { value: Math.round(entry.value) });
            }
        });
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
}

// Initialize all extended functionality
document.addEventListener('DOMContentLoaded', function() {
    initPricingCards();
    initTestimonialsCarousel();
    initFAQAccordion();
    initNewsletterForm();
    initBackToTop();
    initLoadingBar();
    initAdvancedAnimations();
    initUserCounter();
    initThemeSwitcher();
    initLanguageSwitcher();
    initPerformanceMonitor();
    
    // Start counter animations when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animatePremiumStats();
                observer.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.premium-features');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Error Boundary
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Report to error monitoring service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: e.error.message,
            fatal: false
        });
    }
});

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
