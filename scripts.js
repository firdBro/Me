function handleFeedback(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();

    if (username) {
        alert(`Пасяб за отзыв, ${username}! Ты красава!`);
        usernameInput.value = '';
    } else {
        alert('А че? мама имя не давала чтоли?');
    }
}

let likeCount = 0;
let dislikeCount = 0;

function incrementLikes() {
    likeCount++;
    document.getElementById('likeCount').textContent = likeCount;
    alert('Пасяб за лайк!');
}

function incrementDislikes() {
    dislikeCount++;
    document.getElementById('dislikeCount').textContent = dislikeCount;
    alert(' дизлайк поставил? черт чтоли?!');
}

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

window.addEventListener('DOMContentLoaded', initCarousel);
