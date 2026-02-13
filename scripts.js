document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Магия Прелоадера и Тряски Экрана ---
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const preloaderMessage = document.getElementById('preloaderMessage');
    const mainContent = document.getElementById('mainContent');

    let progress = 0;

    function updateProgress(targetProgress, duration, callback) {
        const startProgress = progress;
        const startTime = Date.now();

        const animate = () => {
            const elapsedTime = Date.now() - startTime;
            const percentage = Math.min(1, elapsedTime / duration);
            progress = startProgress + (targetProgress - startProgress) * percentage;
            
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${Math.floor(progress)}%`;

            if (percentage < 1) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        };
        requestAnimationFrame(animate);
    }

    // Этап 1: Достигаем 99%
    updateProgress(99, 1500, () => {
        // Этап 2: Висим на 99% 3 секунды
        setTimeout(() => {
            if (preloaderMessage) preloaderMessage.textContent = "Почти готово... или нет?";
            
            if (mainContent) {
                mainContent.classList.add('shake-active');
            }

            // Этап 3: Откат с 99% до 0%
            updateProgress(0, 1000, () => {
                // Этап 4: Финальное сообщение
                if (preloaderMessage) {
                    preloaderMessage.textContent = "HAHHAAHHAAHAAHAHA!";
                    preloaderMessage.style.color = 'var(--cyber-pink)';
                    preloaderMessage.style.fontSize = '2.5em';
                    preloaderMessage.style.textShadow = '0 0 20px var(--cyber-pink)';
                    preloaderMessage.style.fontWeight = 'bold';
                }

                setTimeout(() => {
                    if (mainContent) {
                        mainContent.classList.remove('shake-active');
                    }
                    if (preloader) preloader.classList.add('preloader-hidden');
                    document.body.classList.remove('no-scroll');
                }, 1000);
            });
        }, 3000);
    });

    // --- 1. Бургер-меню для мобильных ---
    const burgerMenu = document.getElementById('burgerMenu');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (burgerMenu && mainNav) {
        const toggleMenu = () => {
            burgerMenu.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        };

        burgerMenu.addEventListener('click', toggleMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // --- 2. Плавный скролл по якорям ---
    document.querySelectorAll('a.nav-link, .cta-button').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const header = document.querySelector('.main-header');
                    const headerOffset = header ? header.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- 3. Анимации при скролле (Intersection Observer) ---
    const animatedSections = document.querySelectorAll('.animated-section');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedSections.forEach(section => sectionObserver.observe(section));

    // --- 4. Динамическая анимация иконок скиллов ---
    const skillSection = document.getElementById('skills');
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // ИСПРАВЛЕНО: используем класс .skills-grid вместо ID
                const skillCards = document.querySelectorAll('.skills-grid .skill-card');
                skillCards.forEach((card, index) => {
                    const icon = card.querySelector('i');
                    if (icon) icon.style.setProperty('--delay', `${index * 0.1}s`);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (skillSection) skillObserver.observe(skillSection);

    // --- 5. Модальное окно галереи ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const closeButton = document.querySelector('.close-button');

    if (modal && modalImage) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                modal.style.display = 'block';
                modalImage.src = item.dataset.src || item.querySelector('img').src;
                document.body.classList.add('no-scroll');
            });
        });

        const closeModal = () => {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        };

        if (closeButton) closeButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    }

    // --- 6. Динамический год и время ---
    const currentYearSpan = document.getElementById('currentYear');
    const timeSpans = [document.getElementById('currentLocalTime'), document.getElementById('currentLocalTime2')];

    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    function updateLocalTime() {
        const timeString = new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZone: 'Asia/Tashkent', timeZoneName: 'short'
        });
        timeSpans.forEach(span => { if (span) span.textContent = timeString; });
    }
    updateLocalTime();
    setInterval(updateLocalTime, 1000);

    // --- 7. Кастомный курсор (Логика движения внутри DOMContentLoaded) ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            // Используем requestAnimationFrame для максимальной плавности
            requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
                follower.style.left = `${e.clientX}px`;
                follower.style.top = `${e.clientY}px`;
            });
        });

        // Элементы, на которые реагирует курсор
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .social-icon-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('cursor-active'));
            el.addEventListener('mouseleave', () => follower.classList.remove('cursor-active'));
        });
    }
});

// Глобальная функция (если нужна в HTML)
function smoothScroll(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const header = document.querySelector('.main-header');
        const offset = header ? header.offsetHeight : 0;
        window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.pageYOffset - offset,
            behavior: 'smooth'
        });
    }
}
