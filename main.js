/* =============================================
   main.js — Apex Infra Solutions Interactions
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll state ───────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ─── Mobile hamburger ──────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Animate burger → X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu when link clicked
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });

  // ─── Hero headline word-wrap into spans ────
  const headline = document.getElementById('heroHeadline');
  if (headline) {
    const lines = headline.innerHTML.trim().split('<br>');
    headline.innerHTML = lines.map((line, i) =>
      `<span class="line"><span class="line-inner" style="animation-delay:${0.1 + i * 0.08}s">${line.trim()}</span></span>`
    ).join('');
  }

  // ─── Scroll Reveal ─────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── Add reveal classes dynamically ────────
  const revealTargets = [
    { el: document.querySelector('.section-header'), delay: '' },
    ...Array.from(document.querySelectorAll('.service-card')).map((el, i) => ({ el, delay: `reveal-delay-${i + 1}` })),
    { el: document.querySelector('.featured-label'), delay: '' },
    { el: document.querySelector('.featured-text'), delay: '' },
    { el: document.querySelector('.featured-visual'), delay: 'reveal-delay-2' },
    { el: document.querySelector('.stats-band-text'), delay: '' },
    { el: document.querySelector('.stats-band-numbers'), delay: 'reveal-delay-2' },
    { el: document.querySelector('.cta-text'), delay: '' },
    { el: document.querySelector('.contact-form'), delay: 'reveal-delay-2' },
  ];

  revealTargets.forEach(({ el, delay }) => {
    if (!el) return;
    el.classList.add('reveal');
    if (delay) el.classList.add(delay);
    revealObserver.observe(el);
  });

  // ─── Animated stat counters ────────────────
  function animateCounter(el, target, suffix = '', duration = 1600) {
    let start = 0;
    const isDecimal = String(target).includes('.');
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = (isDecimal ? start.toFixed(1) : Math.floor(start)) + suffix;
    }, 16);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        section.querySelectorAll('.band-num').forEach(el => {
          const raw = el.textContent.trim();
          const match = raw.match(/^([0-9.]+)(.*)$/);
          if (match) {
            const num = parseFloat(match[1]);
            const suffix = match[2];
            animateCounter(el, num, suffix);
          }
        });
        statsObserver.unobserve(section);
      }
    });
  }, { threshold: 0.4 });

  const statsBand = document.querySelector('.stats-band-numbers');
  if (statsBand) statsObserver.observe(statsBand);

  // ─── Contact form submit ────────────────────
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const message = document.getElementById('messageInput').value.trim();

    if (!name || !email) {
      shakeEl(submitBtn);
      return;
    }

    submitBtn.textContent = 'Sent! ✓';
    submitBtn.style.background = '#16a34a';
    submitBtn.style.borderColor = '#16a34a';
    submitBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = `Send Message <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      submitBtn.style.background = '';
      submitBtn.style.borderColor = '';
      submitBtn.style.pointerEvents = '';
    }, 3000);
  });

  function shakeEl(el) {
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  }

  // Inject shake keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

  // ─── Smooth active nav highlight ───────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  });

});
