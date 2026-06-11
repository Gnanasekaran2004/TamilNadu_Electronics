/* =============================================================
   TAMILNADU ELECTRONICS - JAVASCRIPT
   Interactions, Animations & Effects
   ============================================================= */

'use strict';

// ===== LOADER =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader?.classList.add('hidden');
    document.body.style.overflow = '';
    initAnimations();
  }, 1600);
});

document.body.style.overflow = 'hidden';

// ===== PARTICLE CANVAS =====
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.5 + 0.3;
      this.speed = Math.random() * 0.5 + 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.7 ? 280 : 200; // purple vs blue
    }

    update() {
      this.y -= this.speed;
      if (this.y < -5) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  };
  animate();
})();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  lastScroll = currentScroll;

  // Back to top button
  const btt = document.getElementById('back-to-top');
  if (currentScroll > 400) {
    btt?.classList.add('visible');
  } else {
    btt?.classList.remove('visible');
  }

  updateActiveNavLink();
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks?.classList.toggle('open');
});

// Close nav when link clicked
navLinks?.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK =====
function updateActiveNavLink() {
  const sections = ['home', 'about', 'products', 'brands', 'contact'];
  const scrollY = window.scrollY + 100;

  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

// ===== STAT COUNTER =====
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const tick = () => {
          current += step;
          if (current >= target) {
            el.textContent = target.toLocaleString();
          } else {
            el.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(tick);
          }
        };
        tick();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const revealEls = document.querySelectorAll(
    '.product-card, .why-card, .brand-card, .about-grid, .contact-grid, .section-header'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

// ===== PRODUCT FILTER =====
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards
      productCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fade-in 0.4s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitLabel = document.getElementById('submit-label');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name = document.getElementById('form-name')?.value.trim();
    const phone = document.getElementById('form-phone')?.value.trim();
    const product = document.getElementById('form-product')?.value;
    const message = document.getElementById('form-message')?.value.trim();

    if (!name || !phone || !product || !message) {
      shakeForm(form);
      return;
    }

    // Simulate submission
    submitLabel.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      form.style.display = 'none';
      successMsg.hidden = false;
    }, 1400);
  });
}

function shakeForm(form) {
  form.style.animation = 'shake 0.4s ease';
  form.addEventListener('animationend', () => {
    form.style.animation = '';
  }, { once: true });
}

// Add shake animation dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);

// ===== BACK TO TOP =====
document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SMOOTH NAV SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== NAVBAR LOGO CLICK =====
document.getElementById('nav-logo-link')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== BRAND CARD HOVER EFFECT =====
function initBrandCards() {
  document.querySelectorAll('.brand-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--hover-scale', '1.04');
    });
  });
}

// ===== CURSOR GLOW EFFECT =====
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(0,178,255,0.06) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 1;
    transition: transform 0.1s linear;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

// ===== INIT ALL =====
function initAnimations() {
  initCounters();
  initReveal();
  initProductFilter();
  initContactForm();
  initBrandCards();
  initCursorGlow();
}

// ===== SECTION TAG STAGGER ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
  // Stagger why-cards
  const whyCards = document.querySelectorAll('.why-card');
  whyCards.forEach((card, idx) => {
    card.style.transitionDelay = `${idx * 80}ms`;
  });

  // Stagger product-cards
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach((card, idx) => {
    card.style.transitionDelay = `${idx * 60}ms`;
  });

  // Stagger brand-cards
  const brandCards = document.querySelectorAll('.brand-card');
  brandCards.forEach((card, idx) => {
    card.style.transitionDelay = `${idx * 40}ms`;
  });
});
