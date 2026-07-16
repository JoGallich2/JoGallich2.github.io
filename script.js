/* ============================================================
   Joseph Gallichio — Portfolio Interactions
   Vanilla JS. No dependencies.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  setActiveNavLink();
  initNavScrollState();
  initMobileMenuAutoClose();
  initTypedRoles();
  initScrollReveal();
  initBackToTop();
  initCopyEmail();
  initFooterYear();
});

/* ---------- Highlight the current page in the nav ---------- */
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links > li > a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('is-active');
    }
  });
}

/* ---------- Give the nav a "scrolled" state (tighter, more opaque) ---------- */
function initNavScrollState() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 12) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Close the mobile hamburger menu after a link is tapped ---------- */
function initMobileMenuAutoClose() {
  const checkbox = document.getElementById('hamburger-active');
  if (!checkbox) return;
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      checkbox.checked = false;
    });
  });
}

/* ---------- Typed "role" effect in the hero (terminal-style) ---------- */
function initTypedRoles() {
  const el = document.getElementById('typed-roles');
  if (!el) return;

  const roles = JSON.parse(el.dataset.roles || '[]');
  if (!roles.length) return;

  // Respect users who've asked for reduced motion — just show the first role.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPE_SPEED = 55;
  const DELETE_SPEED = 30;
  const HOLD_TIME = 1400;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, HOLD_TIME);
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  tick();
}

/* ---------- Fade/slide elements in as they enter the viewport ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((t) => observer.observe(t));
}

/* ---------- Back-to-top button ---------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- "Copy email" buttons with a small confirmation toast ---------- */
function initCopyEmail() {
  document.querySelectorAll('[data-copy-email]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.dataset.copyEmail;
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Copied ${email} to clipboard`);
      } catch (err) {
        // Clipboard API unavailable — fall back to a mailto link.
        window.location.href = `mailto:${email}`;
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

/* ---------- Auto-update copyright year in the footer ---------- */
function initFooterYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}
