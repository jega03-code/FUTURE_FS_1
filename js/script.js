/* ═══════════════════════════════════════════════════════════
   Jegan Portfolio — script.js
   Covers: Loader, Cursor, Scroll Progress, Typed.js, AOS,
           Particles, Navbar, Skills, Projects Filter,
           Testimonials, Theme Toggle, Back-to-Top, Contact
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Helper ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ════════════════════════════════════════
   1. LOADER
════════════════════════════════════════ */
(function initLoader() {
  const loader   = $('#loader');
  const loaderEl = $('#loader-typed');
  const words    = ['loading…', 'init_jegan()', 'portfolio ready!'];
  let  wi = 0, ci = 0;

  function typeWord() {
    if (!words[wi]) return finishLoad();
    if (ci < words[wi].length) {
      loaderEl.textContent += words[wi][ci++];
      setTimeout(typeWord, 60);
    } else {
      setTimeout(() => {
        loaderEl.textContent = '';
        ci = 0; wi++;
        typeWord();
      }, 400);
    }
  }
  typeWord();

  function finishLoad() {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      // Kick off AOS after loader
      AOS.init({
        duration: 700,
        once: true,
        easing: 'ease-out-cubic',
        offset: 60
      });
    }, 200);
  }

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';
})();

/* ════════════════════════════════════════
   2. CUSTOM CURSOR
════════════════════════════════════════ */
(function initCursor() {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  // Smooth ring follow
  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover state on interactive elements
  const hoverEls = 'a, button, .glass-card, .filter-btn, .project-card, .tech-pill';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) ring.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) ring.classList.remove('cursor-hover');
  });
})();

/* ════════════════════════════════════════
   3. SCROLL PROGRESS BAR
════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = $('#scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((scrollTop / docHeight) * 100) + '%';
  }, { passive: true });
})();

/* ════════════════════════════════════════
   4. NAVBAR – sticky + active link
════════════════════════════════════════ */
(function initNavbar() {
  const nav  = $('#mainNav');
  const hamburger = $('#hamburger');
  const navCollapse = $('#navLinks');
  const links = $$('.nav-link');
  const sections = $$('section[id]');

  // Sticky
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  // Hamburger
  hamburger?.addEventListener('click', () => {
    const expanded = hamburger.classList.toggle('open');
    navCollapse.classList.toggle('show');
    hamburger.setAttribute('aria-expanded', expanded);
  });

  // Close on nav link click (mobile)
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navCollapse?.classList.remove('show');
    });
  });

  // Active link highlight on scroll
  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
})();

/* ════════════════════════════════════════
   5. TYPED.JS
════════════════════════════════════════ */
(function initTyped() {
  if (typeof Typed === 'undefined') return;
  new Typed('#typed-text', {
    strings: [
      'Modern Websites.',
      'Scalable Backends.',
      'AI-Powered Apps.',
      'Great Experiences.'
    ],
    typeSpeed: 55,
    backSpeed: 30,
    backDelay: 1800,
    loop: true,
    smartBackspace: true
  });
})();

/* ════════════════════════════════════════
   6. PARTICLE CANVAS
════════════════════════════════════════ */
(function initParticles() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const COUNT = Math.min(60, Math.floor(window.innerWidth / 20));

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.r  = Math.random() * 1.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.5 ? '0,212,255' : '108,99,255';
  };
  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  };

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ════════════════════════════════════════
   7. SKILL BARS – animate on scroll
════════════════════════════════════════ */
(function initSkillBars() {
  const fills = $$('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = el.dataset.width + '%';
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => {
    fill.style.width = '0%';
    observer.observe(fill);
  });
})();

/* ════════════════════════════════════════
   8. PROJECT FILTER
════════════════════════════════════════ */
(function initProjectFilter() {
  const btns  = $$('.filter-btn');
  const cards = $$('.project-card-wrap');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.classList.toggle('hidden', !match);
          if (match) {
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          }
        }, 150);
        card.style.transition = 'opacity 0.3s, transform 0.3s';
      });
    });
  });
})();

/* ════════════════════════════════════════
   9. TESTIMONIALS SLIDER
════════════════════════════════════════ */
(function initTestimonials() {
  const track    = $('#testimonialsTrack');
  const dotsWrap = $('#testiDots');
  const prevBtn  = $('#testiPrev');
  const nextBtn  = $('#testiNext');
  if (!track) return;

  const cards = $$('.testimonial-card', track);
  let current = 0;
  let perView = window.innerWidth >= 768 ? 2 : 1;
  const total = Math.ceil(cards.length / perView);

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'testi-dot' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - 1));
    const cardW   = cards[0].offsetWidth + 24; // gap
    const offset  = -current * perView * cardW;
    track.style.transform = `translateX(${offset}px)`;
    $$('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Auto-advance
  let autoTimer = setInterval(() => goTo((current + 1) % total), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => goTo((current + 1) % total), 5000);
  });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  });

  // Resize
  window.addEventListener('resize', () => {
    perView = window.innerWidth >= 768 ? 2 : 1;
    buildDots();
    goTo(0);
  }, { passive: true });

  buildDots();
  goTo(0);
})();

/* ════════════════════════════════════════
   10. THEME TOGGLE (Dark / Light)
════════════════════════════════════════ */
(function initTheme() {
  const btn  = $('#themeToggle');
  const icon = $('#themeIcon');
  const html = document.documentElement;

  // Persist preference
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  btn?.addEventListener('click', () => {
    const cur  = html.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
})();

/* ════════════════════════════════════════
   11. BACK TO TOP
════════════════════════════════════════ */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ════════════════════════════════════════
   12. CONTACT FORM (EmailJS stub)
════════════════════════════════════════ */
function sendMessage() {
  const name    = $('#contactName')?.value.trim();
  const email   = $('#contactEmail')?.value.trim();
  const subject = $('#contactSubject')?.value.trim();
  const message = $('#contactMessage')?.value.trim();

  // Simple validation
  if (!name || !email || !subject || !message) {
    showFormError('Please fill in all fields.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormError('Please enter a valid email address.');
    return;
  }

  const sendBtn = $('#sendBtn');
  sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Sending…';
  sendBtn.disabled = true;

  /* ── EmailJS Integration ────────────────────────────────
     To connect EmailJS:
     1. Sign up at https://www.emailjs.com/
     2. Create a Service ID, Template ID, and get your Public Key
     3. Add the EmailJS SDK script in index.html before script.js:
        <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
     4. Initialize: emailjs.init('YOUR_PUBLIC_KEY')
     5. Replace the setTimeout below with:

     emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
       from_name: name,
       from_email: email,
       subject: subject,
       message: message
     }).then(() => {
       showSuccess();
     }).catch(err => {
       sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i>Send Message';
       sendBtn.disabled = false;
       showFormError('Something went wrong. Please try again.');
       console.error('EmailJS error:', err);
     });
  ─────────────────────────────────────────────────────── */

  // Simulated send (replace with real EmailJS call above)
  setTimeout(() => {
    showSuccess();
  }, 1800);
}

function showSuccess() {
  const form    = $('#contactForm');
  const success = $('#formSuccess');
  form.classList.add('d-none');
  success.classList.remove('d-none');
  // Reset after 5s for demo
  setTimeout(() => {
    form.classList.remove('d-none');
    success.classList.add('d-none');
    $$('#contactForm input, #contactForm textarea').forEach(el => el.value = '');
    const sendBtn = $('#sendBtn');
    if (sendBtn) {
      sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i>Send Message';
      sendBtn.disabled = false;
    }
  }, 5000);
}

function showFormError(msg) {
  // Remove old error
  $$('.form-error-msg').forEach(e => e.remove());
  const err = document.createElement('p');
  err.className = 'form-error-msg mt-2 mb-0';
  err.style.cssText = 'color:#FF6B6B;font-size:0.85rem;';
  err.textContent = msg;
  $('#contactForm .col-12:last-child').appendChild(err);
  setTimeout(() => err.remove(), 3000);
}

/* ════════════════════════════════════════
   13. SMOOTH SECTION REVEAL – fallback for
       browsers without AOS support
════════════════════════════════════════ */
(function initRevealFallback() {
  if (typeof IntersectionObserver === 'undefined') {
    $$('[data-aos]').forEach(el => el.style.opacity = '1');
  }
})();

/* ════════════════════════════════════════
   14. ACTIVE NAV HIGHLIGHT on page load
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Ensure hero nav link is active on load
  const heroLink = $('a.nav-link[href="#about"]');
  // (active link is set dynamically via scroll listener above)
});
