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

// Typing animation for hero subtitle
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = txtElement.textContent || '';
        this.wordIndex = words.indexOf(this.txt) >= 0 ? words.indexOf(this.txt) : 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
        setTimeout(() => this.type(), 2000);
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typing animation for hero subtitle
document.addEventListener('DOMContentLoaded', () => {
    const txtElement = document.querySelector('.hero-title');
    const words = ['Senior Backend Engineer', 'System Architect', 'Problem Solver', 'Continuous Learner'];
    if (txtElement) {
        new TypeWriter(txtElement, words, 2000);
    }
});

// Skills animation on hover
document.querySelectorAll('.skill-item').forEach(skill => {
    skill.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    skill.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Project cards 3D tilt effect (disabled on touch devices)
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Dynamic copyright year
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 1;
        transition: opacity 0.5s ease;
    `;
    preloader.innerHTML = `
        <div style="text-align:center">
            <div style="
                width: 50px; height: 50px;
                border: 3px solid rgba(255,255,255,0.1);
                border-top: 3px solid #007AFF;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            "></div>
            <div style="color: #8E8E93; font-size: 1rem;">Loading...</div>
        </div>
    `;
    document.body.prepend(preloader);
});

// Contact form validation utility
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Number animation for stat items
const animateNumbers = () => {
    const statItems = document.querySelectorAll('.stat-item h3');
    statItems.forEach(heading => {
        const text = heading.textContent.replace(/\D/g, '');
        const targetNumber = parseInt(text, 10);
        if (isNaN(targetNumber)) return;

        const increment = targetNumber / 100;
        let currentNumber = 0;

        const updateNumber = () => {
            if (currentNumber < targetNumber) {
                currentNumber += increment;
                heading.textContent = Math.ceil(currentNumber) + '+';
                requestAnimationFrame(updateNumber);
            } else {
                heading.textContent = targetNumber + '+';
            }
        };

        const numberObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateNumber();
                    numberObserver.unobserve(entry.target);
                }
            });
        });
        numberObserver.observe(heading);
    });
};

document.addEventListener('DOMContentLoaded', animateNumbers);

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

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            this.style.display = 'none';
        });
    });
});

// Scroll progress indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

document.addEventListener('DOMContentLoaded', createScrollProgress);
