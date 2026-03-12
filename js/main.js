// ===== JuztExplore Main JS =====

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSearch();
  initFilters();
  initScrollAnimations();
  initHeaderScroll();
});

// ===== Mobile Menu =====
function initMobileMenu() {
  const toggle = document.querySelector('.header__menu-toggle');
  const nav = document.querySelector('.header__nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ===== Search =====
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  const guideCards = document.querySelectorAll('.card--guide');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    guideCards.forEach(card => {
      const title = (card.getAttribute('data-title') || card.textContent).toLowerCase();
      const game = (card.getAttribute('data-game') || '').toLowerCase();
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const searchText = `${title} ${game} ${tags}`;

      if (query === '' || searchText.includes(query)) {
        card.style.display = '';
        card.style.opacity = '1';
        card.style.transform = '';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (!searchText.includes(searchInput.value.toLowerCase().trim())) {
            card.style.display = 'none';
          }
        }, 250);
      }
    });

    // Show/hide no results message
    const visibleCards = [...guideCards].filter(c => c.style.display !== 'none');
    let noResults = document.getElementById('no-results');
    if (visibleCards.length === 0 && query !== '') {
      if (!noResults) {
        noResults = document.createElement('div');
        noResults.id = 'no-results';
        noResults.style.cssText = 'text-align:center;padding:3rem 1rem;color:var(--text-muted);font-size:1.1rem;grid-column:1/-1;';
        noResults.innerHTML = `<p>🔍 No guides found for "<strong style="color:var(--text-primary)">${query}</strong>"</p><p style="font-size:0.9rem;margin-top:0.5rem;">Try searching for a different game or error code.</p>`;
        const grid = document.querySelector('.grid--guide');
        if (grid) grid.appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  });
}

// ===== Category Filters =====
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const guideCards = document.querySelectorAll('.card--guide');
  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      guideCards.forEach(card => {
        const game = card.getAttribute('data-game') || '';

        if (filter === 'all' || game.toLowerCase() === filter.toLowerCase()) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });

      // Remove no results if filter changed
      const noResults = document.getElementById('no-results');
      if (noResults) noResults.remove();
    });
  });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ===== Header Scroll Effect =====
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.4)';
    } else {
      header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// ===== Contact Form Handler =====
function handleContactForm(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = '✓ Message Sent!';
  submitBtn.style.background = 'var(--success)';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.style.background = '';
    submitBtn.disabled = false;
    form.reset();
  }, 3000);
}
