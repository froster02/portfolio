(function () {
  'use strict';

  /* ─── Current Year ─── */
  document.getElementById('current-year').textContent = new Date().getFullYear();

  /* ─── Navbar Scroll ─── */
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  function updateNavbar() {
    const scrollY = window.scrollY;
    const isLight = document.body.classList.contains('light-theme');
    if (scrollY > 50) {
      navbar.style.background = isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(5, 5, 6, 0.85)';
      navbar.style.backdropFilter = 'blur(24px)';
      navbar.style.borderBottomColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    } else {
      navbar.style.background = isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(5, 5, 6, 0.8)';
      navbar.style.backdropFilter = 'blur(20px)';
      navbar.style.borderBottomColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)';
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ─── Hamburger Menu ─── */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  let menuOpen = false;

  const closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>';
  const menuIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>';

  function toggleMenu(forceClose) {
    menuOpen = forceClose ? false : !menuOpen;
    navMenu.classList.toggle('active', menuOpen);
    hamburger.innerHTML = menuOpen ? closeIcon : menuIcon;
    hamburger.setAttribute('aria-expanded', menuOpen);
  }

  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', function (e) {
    if (menuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      toggleMenu(true);
    }
  });

  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (menuOpen) toggleMenu(true);
    });
  });

  /* ─── Scroll Reveal (Intersection Observer) ─── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ─── Hero Scroll Parallax ─── */
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  function updateHeroParallax() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;
    const progress = Math.min(scrollY / heroHeight, 0.5);

    if (scrollY > 0 && heroContent) {
      heroContent.style.transform = 'translateY(' + (progress * -60) + 'px)';
      heroContent.style.opacity = 1 - progress * 2;
    } else if (heroContent) {
      heroContent.style.transform = 'translateY(0)';
      heroContent.style.opacity = 1;
    }

    if (scrollIndicator) {
      scrollIndicator.style.opacity = Math.max(0, 0.4 - progress * 2);
    }
  }

  window.addEventListener('scroll', updateHeroParallax, { passive: true });
  updateHeroParallax();

  /* ─── Spotlight Mouse Tracking ─── */
  var spotlightCards = document.querySelectorAll(
    '.about-card, .stat-item, .experience-item, .education-card, .certification-card, .skill-category, .project-card, .contact-link, .leetcode-stats, .github-stats-card'
  );

  spotlightCards.forEach(function (card) {
    card.setAttribute('data-spotlight', '');

    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--spotlight-x', x + '%');
      card.style.setProperty('--spotlight-y', y + '%');
    });

    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--spotlight-x', '50%');
      card.style.setProperty('--spotlight-y', '50%');
    });
  });

  /* ─── Theme Toggle ─── */
  const themeBtn = document.createElement('button');
  themeBtn.className = 'theme-toggle';
  themeBtn.setAttribute('aria-label', 'Toggle theme');
  document.body.appendChild(themeBtn);

  var savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  function updateThemeIcon() {
    var isLight = document.body.classList.contains('light-theme');
    themeBtn.innerHTML = isLight
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  updateThemeIcon();

  themeBtn.addEventListener('click', function () {
    document.body.classList.toggle('light-theme');
    var isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon();
    updateNavbar();
  });

})();
