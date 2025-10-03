// script.js
// Handles theme toggle, mobile nav, pub search, contact form validation, and small UX helpers.

(function () {
  // Elements
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  const pubFilter = document.getElementById('pub-filter');
  const pubList = document.getElementById('pub-list');
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  const yearSpan = document.getElementById('year');

  // Set year in footer
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Theme: remember user choice in localStorage
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
    themeToggle.textContent = storedTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', storedTheme === 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? '' : 'dark';
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-pressed', 'false');
    }
  });

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if (!expanded) {
      navList.style.display = 'flex';
    } else {
      navList.style.display = '';
    }
  });

  // Close mobile nav when link clicked (mobile)
  navList.addEventListener('click', (evt) => {
    if (evt.target.tagName.toLowerCase() === 'a' && window.innerWidth <= 720) {
      navToggle.setAttribute('aria-expanded', 'false');
      navList.style.display = '';
    }
  });

  // Simple publications client-side search/filter
  function filterPubs(q) {
    const term = q.trim().toLowerCase();
    const items = pubList.querySelectorAll('.pub');
    items.forEach(item => {
      const title = item.querySelector('.pub-title')?.textContent.toLowerCase() || '';
      const year = item.getAttribute('data-year') || '';
      const keywords = (item.getAttribute('data-keywords') || '').toLowerCase();
      const match = !term || title.includes(term) || year.includes(term) || keywords.includes(term);
      item.style.display = match ? '' : 'none';
    });
  }

  pubFilter.addEventListener('input', (e) => {
    filterPubs(e.target.value);
  });

  // Contact form handling (client-side). No backend — change to POST to your endpoint.
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactStatus.textContent = '';
    const formData = new FormData(contactForm);

    // Simple validation
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!name || !email || !message) {
      contactStatus.textContent = 'Please fill in all fields.';
      return;
    }
    if (!validateEmail(email)) {
      contactStatus.textContent = 'Please provide a valid email address.';
      return;
    }

    // Example: show success. To actually send, POST to a server or use a service like Formspree.
    contactStatus.textContent = 'Thanks — your message is ready to be sent (demo mode).';
    contactForm.reset();
  });

  function validateEmail(email) {
    // Basic, permissive email regex — for strict rules, use server-side validation
    return /\S+@\S+\.\S+/.test(email);
  }

  // Accessibility: smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // focus target for keyboard users
          el.setAttribute('tabindex', '-1');
          el.focus({ preventScroll: true });
          window.setTimeout(() => el.removeAttribute('tabindex'), 1000);
        }
      }
    });
  });

})();
