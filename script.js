// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== НАВИГАЦИЯ ====================
    
    // Элементы навигации
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Эффект прокрутки для навбара
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Показать/скрыть кнопку "наверх"
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Мобильное меню
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Анимация гамбургера
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Закрытие мобильного меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // ==================== ПЛАВНАЯ ПРОКРУТКА ====================
    
    // Плавная прокрутка для всех якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // учитываем высоту навбара
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Кнопка "наверх"
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ==================== АКТИВНАЯ НАВИГАЦИЯ ====================
    
    // Обновление активного пункта меню при прокрутке
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // ==================== АНИМАЦИИ ПРИ ПРОКРУТКЕ ====================
    
    // Intersection Observer для анимаций
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Добавляем наблюдение за элементами
    const animatedElements = document.querySelectorAll('.service-card, .achievement, .about-text, .about-image, .contact-item, .contact-form, .job-card, .benefit-item, .careers-contact');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // ==================== СТАТИСТИКА С АНИМАЦИЕЙ ====================
    
    // Анимация счетчиков
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            const duration = 2000; // 2 секунды
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Форматирование числа
                const formatted = Math.floor(current).toLocaleString('ru-RU');
                if (counter.textContent.includes('+')) {
                    counter.textContent = formatted + '+';
                } else if (counter.textContent.includes(',')) {
                    counter.textContent = formatted.replace(',', '.');
                } else {
                    counter.textContent = formatted;
                }
            }, 16);
        });
    }
    
    // Запуск анимации счетчиков при попадании в зону видимости
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    animateCounters();
                    entry.target.dataset.animated = 'true';
                }
            });
        }, observerOptions);
        
        statsObserver.observe(statsSection);
    }
    
    // ==================== ФОРМА ОБРАТНОЙ СВЯЗИ ====================
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Имитация отправки (в реальном проекте здесь был бы AJAX запрос)
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Отправляется...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Показываем сообщение об успехе
                showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                
                // Очищаем форму
                this.reset();
                
                // Возвращаем кнопку в исходное состояние
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // ==================== ВАКАНСИИ ====================
    
    // Обработчики для кнопок отклика на вакансии
    const jobApplyButtons = document.querySelectorAll('.job-apply-btn');
    jobApplyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobCard = this.closest('.job-card');
            const jobTitle = jobCard.querySelector('h3').textContent;
            
            // Имитация отправки отклика
            const originalText = this.textContent;
            this.textContent = 'Отправляется...';
            this.disabled = true;
            
            setTimeout(() => {
                showNotification(`Ваш отклик на вакансию "${jobTitle}" успешно отправлен! Мы свяжемся с вами в ближайшее время.`, 'success');
                this.textContent = 'Отправлено ✓';
                this.style.background = '#4CAF50';
                
                // Через 3 секунды возвращаем к исходному состоянию
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                    this.style.background = '';
                }, 3000);
            }, 1500);
        });
    });
    
    // Кнопка "Отправить резюме"
    const sendResumeBtn = document.getElementById('sendResumeBtn');
    if (sendResumeBtn) {
        sendResumeBtn.addEventListener('click', function() {
            // Создаем модальное окно для отправки резюме
            createResumeModal();
        });
    }
    
    // ==================== УВЕДОМЛЕНИЯ ====================
    
    function showNotification(message, type = 'info') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Добавляем стили, если их еще нет
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    z-index: 10000;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification-success {
                    border-left: 4px solid #4CAF50;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .notification i:first-child {
                    color: #4CAF50;
                    font-size: 1.2rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #666;
                    margin-left: auto;
                }
                
                .notification-close:hover {
                    color: #333;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Добавляем уведомление в DOM
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Закрытие уведомления
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // ==================== ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ ====================
    
    // Параллакс эффект для главного экрана
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero');
        
        if (heroSection && scrolled < heroSection.offsetHeight) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Эффект набора текста для заголовка
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Плавное появление элементов при загрузке
    window.addEventListener('load', function() {
        // Добавляем класс loaded для дополнительных анимаций
        document.body.classList.add('loaded');
        
        // Небольшая задержка перед запуском анимаций
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-stats, .hero-buttons, .hero-image');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 500);
    });
    
    // ==================== ПРОИЗВОДИТЕЛЬНОСТЬ ====================
    
    // Throttle функция для оптимизации скролла
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Применяем throttle к обработчикам scroll
    window.addEventListener('scroll', throttle(function() {
        updateActiveNavLink();
    }, 16)); // ~60fps
    
    // ==================== ACCESSIBILITY ====================
    
    // Поддержка клавиатурной навигации
    document.addEventListener('keydown', function(e) {
        // ESC для закрытия мобильного меню
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // Улучшение доступности для кнопок
    const buttons = document.querySelectorAll('.btn, .hamburger, .scroll-to-top');
    buttons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // ==================== ОТЛАДКА ====================
    
    // Консольное сообщение для разработчиков
    console.log('🌾 Сайт колхоза "Полесская опытная станция" успешно загружен!');
    console.log('📧 Для связи: info@polesstation.by');
    
});

// ==================== ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ ====================

// Функция для плавного изменения цвета элементов
function animateColor(element, fromColor, toColor, duration = 1000) {
    const start = performance.now();
    
    function step(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Простая интерполяция цвета (можно расширить)
        element.style.color = progress < 1 ? fromColor : toColor;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// Функция для создания конфетти (праздничный эффект)
function createConfetti() {
    const colors = ['#2E7D32', '#4CAF50', '#FFC107', '#FF9800'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        // Анимация падения
        const animation = confetti.animate([
            { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 10}px) rotate(720deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Функция для создания модального окна отправки резюме
function createResumeModal() {
    // Проверяем, не открыто ли уже модальное окно
    if (document.querySelector('.resume-modal')) {
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'resume-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Отправить резюме</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form class="resume-form">
                    <div class="form-group">
                        <label for="resume-name">Ваше имя *</label>
                        <input type="text" id="resume-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="resume-email">Email *</label>
                        <input type="email" id="resume-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="resume-phone">Телефон *</label>
                        <input type="tel" id="resume-phone" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="resume-position">Желаемая должность</label>
                        <select id="resume-position" name="position">
                            <option value="">Выберите вакансию</option>
                            <option value="tractor">Тракторист-машинист</option>
                            <option value="milker">Оператор машинного доения</option>
                            <option value="agronomer">Агроном</option>
                            <option value="mechanic">Слесарь-ремонтник</option>
                            <option value="accountant">Бухгалтер</option>
                            <option value="driver">Водитель</option>
                            <option value="other">Другая должность</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="resume-experience">Опыт работы</label>
                        <textarea id="resume-experience" name="experience" rows="3" placeholder="Расскажите о своем опыте работы..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="resume-file">Прикрепить резюме</label>
                        <input type="file" id="resume-file" name="resume" accept=".pdf,.doc,.docx">
                        <small>Принимаются файлы: PDF, DOC, DOCX (до 5MB)</small>
                    </div>
                    <div class="form-group">
                        <label for="resume-message">Сопроводительное письмо</label>
                        <textarea id="resume-message" name="message" rows="4" placeholder="Расскажите, почему вы хотите работать у нас..."></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-cancel">Отмена</button>
                        <button type="submit" class="btn btn-primary">Отправить резюме</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Добавляем стили для модального окна
    if (!document.querySelector('#modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .resume-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                cursor: pointer;
            }
            
            .modal-content {
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                z-index: 1;
                cursor: default;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 25px 30px 20px;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #2C2C2C;
                font-size: 1.4rem;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #666;
                padding: 5px;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: #f5f5f5;
                color: #333;
            }
            
            .resume-form {
                padding: 30px;
            }
            
            .resume-form .form-group {
                margin-bottom: 20px;
            }
            
            .resume-form label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #2C2C2C;
            }
            
            .resume-form input,
            .resume-form select,
            .resume-form textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-family: inherit;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            
            .resume-form input:focus,
            .resume-form select:focus,
            .resume-form textarea:focus {
                outline: none;
                border-color: #2E7D32;
            }
            
            .resume-form small {
                color: #666;
                font-size: 0.85rem;
                margin-top: 5px;
                display: block;
            }
            
            .modal-footer {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .modal-footer .btn {
                flex: 1;
                padding: 12px 20px;
                justify-content: center;
            }
            
            @media (max-width: 480px) {
                .modal-content {
                    margin: 10px;
                    max-height: 95vh;
                }
                
                .resume-form {
                    padding: 20px;
                }
                
                .modal-header {
                    padding: 20px 20px 15px;
                }
                
                .modal-footer {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    
    // Анимация появления
    setTimeout(() => {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        modal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    // Обработчики событий
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const overlay = modal.querySelector('.modal-overlay');
    const form = modal.querySelector('.resume-form');
    
    function closeModal() {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => modal.remove(), 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Обработка формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Отправляется...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Ваше резюме успешно отправлено! Мы рассмотрим его и свяжемся с вами в ближайшее время.', 'success');
            closeModal();
        }, 2000);
    });
    
    // Фокус на первом поле
    setTimeout(() => {
        modal.querySelector('#resume-name').focus();
    }, 100);
} 