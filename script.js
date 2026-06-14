// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isActive);
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const isLight = document.body.classList.contains('light-theme');
    const scrollState = window.scrollY > 100 ? '0.95' : '0.8';
    const bg = isLight
        ? `rgba(255, 255, 255, ${scrollState})`
        : `rgba(28, 28, 30, ${scrollState})`;
    navbar.style.background = bg;
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const animateOnScroll = document.querySelectorAll('.about-card, .skill-category, .project-card, .stat-item, .contact-item');
animateOnScroll.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Theme toggle functionality
const createThemeToggle = () => {
    const toggleButton = document.createElement('button');
    toggleButton.className = 'theme-toggle';
    toggleButton.setAttribute('aria-label', 'Switch to light mode');

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.body.classList.add('light-theme');
        toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
        toggleButton.setAttribute('aria-label', 'Switch to dark mode');
    } else {
        toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        toggleButton.setAttribute('aria-label', 'Switch to light mode');
    }

    toggleButton.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        if (isLight) {
            document.body.classList.remove('light-theme');
            toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
            toggleButton.setAttribute('aria-label', 'Switch to light mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-theme');
            toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
            toggleButton.setAttribute('aria-label', 'Switch to dark mode');
            localStorage.setItem('theme', 'light');
        }
        toggleButton.style.transform = 'scale(0.8)';
        setTimeout(() => {
            toggleButton.style.transform = 'scale(1)';
        }, 150);
    });

    document.body.appendChild(toggleButton);
};

document.addEventListener('DOMContentLoaded', createThemeToggle);
