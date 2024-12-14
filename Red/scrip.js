document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    const currentYearSpan = document.getElementById('current-year');
    const articleCards = document.querySelectorAll('.article-card');
    
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainMenu.classList.toggle('show');
    }

    function updateCurrentYear() {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }

    function initializeIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(handleIntersection, options);

        articleCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            observer.observe(card);
        });
    }

    function handleImageError(e) {
        const img = e.target;
        img.src = 'images/fallback.jpg';
        img.alt = 'Image not available';
    }

    function initializeImageErrorHandling() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', handleImageError);
        });
    }

    function initializeTimeUpdates() {
        const timeElements = document.querySelectorAll('time');
        
        timeElements.forEach(timeElement => {
            const datetime = timeElement.getAttribute('datetime');
            if (datetime) {
                const date = new Date(datetime);
                const now = new Date();
                const diffInMinutes = Math.floor((now - date) / (1000 * 60));

                if (diffInMinutes < 60) {
                    timeElement.textContent = `${diffInMinutes} minutes ago`;
                } else if (diffInMinutes < 1440) {
                    const hours = Math.floor(diffInMinutes / 60);
                    timeElement.textContent = `${hours} hours ago`;
                }
            }
        });
    }

    menuToggle.addEventListener('click', toggleMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainMenu.classList.contains('show')) {
            toggleMenu();
        }
    });

    mainMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            toggleMenu();
        }
    });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initializeIntersectionObserver();
    }

    updateCurrentYear();
    initializeImageErrorHandling();
    initializeTimeUpdates();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && mainMenu.classList.contains('show')) {
                mainMenu.classList.remove('show');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }, 250);
    });
});