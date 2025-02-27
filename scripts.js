let lastScrollY = window.scrollY;
const header = document.querySelector('header');
let isHeaderHidden = false;

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + window.innerHeight;

    sections.forEach(section => {
        if (scrollPosition > section.offsetTop + section.offsetHeight / 4) {
            section.classList.add('visible');
        }
    });

    const footer = document.querySelector('.footer-banner');
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        footer.classList.add('visible');
    }

    // Скрытие хедера при прокрутке вниз
    if (window.scrollY > lastScrollY && !isHeaderHidden) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    lastScrollY = window.scrollY;
});

window.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    setTimeout(() => {
        const banner = document.querySelector('.top-banner');
        banner.classList.add('show');

        setTimeout(() => {
            banner.classList.remove('show');
        }, 5000);
    }, 1000);

    initCarousel();
    initBurgerMenu(); // Инициализация бургер-меню
});

let currentImageIndex = 0;
function initCarousel() {
    const images = document.querySelectorAll('.carousel img');
    const totalImages = images.length;

    setInterval(() => {
        images[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        images[currentImageIndex].classList.add('active');
    }, 3000);
}

// Функция для бургер-меню
function initBurgerMenu() {
    const burger = document.createElement('div');
    burger.classList.add('burger');
    burger.innerHTML = `<span></span><span></span><span></span>`;
    header.appendChild(burger);

    const nav = document.querySelector('header nav');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('open');

        // Показываем хедер при открытии меню
        if (nav.classList.contains('open')) {
            header.classList.remove('hidden');
            isHeaderHidden = false;
        }
    });
}
