document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Магия Прелоадера и Тряски Экрана ---
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const preloaderMessage = document.getElementById('preloaderMessage');
    const mainContent = document.getElementById('mainContent'); // Получаем главный контент

    let progress = 0;

    function updateProgress(targetProgress, duration, callback) {
        const startProgress = progress;
        const startTime = Date.now();

        const animate = () => {
            const elapsedTime = Date.now() - startTime;
            const percentage = Math.min(1, elapsedTime / duration);
            progress = startProgress + (targetProgress - startProgress) * percentage;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.floor(progress)}%`;

            if (percentage < 1) {
                requestAnimationFrame(animate);
            } else {
                if (callback) callback();
            }
        };
        requestAnimationFrame(animate);
    }

    // Этап 1: Достигаем 99%
    updateProgress(99, 1500, () => { // Прогресс до 99% за 1.5 секунды
        // Этап 2: Висим на 99% 3 секунды
        setTimeout(() => {
            preloaderMessage.textContent = "Почти готово... или нет?";
            
            // Запускаем тряску экрана
            if (mainContent) {
                mainContent.classList.add('shake-active');
            }

            // Этап 3: Откат с 99% до 0%
            updateProgress(0, 1000, () => { // Откат за 1 секунду
                // Этап 4: Сообщение "Наебал" и скрытие
                preloaderMessage.textContent = "HAHHAAHHAAHAAHAHA!";
                preloaderMessage.style.color = 'var(--cyber-pink)'; // Яркий цвет для "Наебал"
                preloaderMessage.style.fontSize = '2.5em'; // Увеличим размер
                preloaderMessage.style.textShadow = '0 0 20px var(--cyber-pink)';
                preloaderMessage.style.fontWeight = 'bold'; // Жирный текст

                setTimeout(() => {
                    if (mainContent) {
                        mainContent.classList.remove('shake-active'); // Останавливаем тряску
                    }
                    preloader.classList.add('preloader-hidden');
                    document.body.classList.remove('no-scroll'); // Разрешаем скролл после загрузки
                }, 1000); // 1 секунда, чтобы прочитать "Наебал!"
            });
        }, 3000); // Висим 3 секунды на 99%
    });

    // --- 1. Бургер-меню для мобильных ---
    const burgerMenu = document.getElementById('burgerMenu');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

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
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = document.querySelector('.main-header').offsetHeight;
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

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 4. Динамическая анимация иконок скиллов ---
    const skillSection = document.getElementById('skills');

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillCards = document.querySelectorAll('#skillsGrid .skill-card');
                skillCards.forEach((card, index) => {
                    card.querySelector('i').style.setProperty('--delay', `${index * 0.1}s`);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (skillSection) {
        skillObserver.observe(skillSection);
    }

    // --- 5. Модальное окно галереи ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const closeButton = document.querySelector('.close-button');

    function openGalleryModal(imageSrc) {
        modal.style.display = 'block';
        modalImage.src = imageSrc;
        document.body.classList.add('no-scroll');
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            openGalleryModal(item.dataset.src);
        });
    });

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    });

    // --- 6. Динамический год и время в футере ---
    const currentYearSpan = document.getElementById('currentYear');
    const currentLocalTimeSpan = document.getElementById('currentLocalTime');
    const currentLocalTimeSpan2 = document.getElementById('currentLocalTime2');

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    if (currentLocalTimeSpan || currentLocalTimeSpan2) {
        function updateLocalTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Tashkent', // Часовой пояс для Ташкента/Ангрена
                timeZoneName: 'short'
            });
            if (currentLocalTimeSpan) {
                currentLocalTimeSpan.textContent = timeString;
            }
            if (currentLocalTimeSpan2) {
                currentLocalTimeSpan2.textContent = timeString;
            }
        }
        updateLocalTime();
        setInterval(updateLocalTime, 1000);
    }

});

// Функция для плавного скролла (если вызывается из HTML)
function smoothScroll(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const headerOffset = document.querySelector('.main-header').offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

}
