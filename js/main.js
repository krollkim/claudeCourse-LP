// Remove no-js class immediately so CSS fallback is clean
document.documentElement.classList.remove('no-js');

window.addEventListener('load', () => {

  // Guard: GSAP should be available via defer-ordered CDN load
  if (typeof gsap === 'undefined') {
    console.warn('[LP] GSAP not loaded — animations skipped, content visible.');
    // Make all animated elements visible
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    initModal();
    return;
  }

  // ─── REGISTER PLUGINS ─────────────────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  // ─── NAV ENTRY ────────────────────────────────────────────────────────
  gsap.from('#nav', {
    y: -20,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  });

  // ─── NAV SCROLL BEHAVIOR ──────────────────────────────────────────────
  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: (self) => {
      const nav = document.getElementById('nav');
      if (!nav) return;
      if (self.progress > 0) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });

  // ─── HERO TIMELINE ────────────────────────────────────────────────────
  const heroLabel = document.querySelector('.hero-label');
  const heroLines = document.querySelectorAll('.hero-headline .line');
  const heroSub   = document.querySelector('.hero-sub');
  const heroActions = document.querySelector('.hero-actions');
  const scrollInd = document.querySelector('.scroll-indicator');

  const heroTL = gsap.timeline({ delay: 0.15 });

  if (heroLabel) {
    heroTL.from(heroLabel, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' });
  }

  if (heroLines.length) {
    heroTL.from(heroLines, {
      y: 60,
      opacity: 0,
      duration: 0.85,
      stagger: 0.12,
      ease: 'power3.out'
    }, '-=0.3');
  }

  if (heroSub) {
    heroTL.from(heroSub, { y: 20, opacity: 0, duration: 0.65, ease: 'power2.out' }, '-=0.5');
  }

  if (heroActions) {
    heroTL.from(heroActions, { y: 15, opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.4');
  }

  if (scrollInd) {
    heroTL.from(scrollInd, { opacity: 0, duration: 0.4 }, '-=0.2');
  }

  // ─── SCROLL-TRIGGERED FADE-UPS ────────────────────────────────────────
  /**
   * fadeUp — animate elements up from 30px with opacity 0
   * @param {string} selector - CSS selector
   * @param {number} stagger  - stagger delay between elements (seconds)
   * @param {string} triggerSelector - optional different trigger element
   */
  const fadeUp = (selector, stagger = 0, triggerSelector = null) => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    gsap.from(selector, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: stagger,
      scrollTrigger: {
        trigger: triggerSelector || selector,
        start: 'top 85%',
        once: true
      }
    });
  };

  // Section headings
  fadeUp('.promise-header',  0,    '#promise');
  fadeUp('.curriculum-header', 0,  '#curriculum');
  fadeUp('.pricing-header',  0,    '#pricing');

  // Pillar cards (Promise section)
  fadeUp('.pillar-card', 0.12);

  // Terminal lines (Curriculum)
  fadeUp('.terminal-line', 0.06, '.terminal-window');
  fadeUp('.module-row',    0.08, '.terminal-window');

  // Pricing card
  fadeUp('.pricing-card', 0, '#pricing');

  // Footer
  fadeUp('.footer-inner', 0, '#footer');

  // ─── MODAL LOGIC ──────────────────────────────────────────────────────
  initModal();

}); // end window.load


// ─────────────────────────────────────────────────────────────────────────────
// MODAL
// Separated so it always runs — even without GSAP
// ─────────────────────────────────────────────────────────────────────────────
function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close');
  const fallbackLink = modal.querySelector('.modal-fallback a');

  // ── CHECKOUT URL ──────────────────────────────────────────────────────
  // TODO: Replace with your actual Gumroad / Stripe / LemonSqueezy URL
  const CHECKOUT_URL = '#'; // e.g. 'https://gumroad.com/l/yourproduct'

  const openModal = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Redirect to checkout (if URL is set)
    if (CHECKOUT_URL && CHECKOUT_URL !== '#') {
      // Update the fallback link href dynamically
      if (fallbackLink) fallbackLink.href = CHECKOUT_URL;
      // Auto-redirect after short delay for UX
      setTimeout(() => {
        window.location.href = CHECKOUT_URL;
      }, 1200);
    }
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Trigger: all CTA buttons
  document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close: X button
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close: click overlay (not card)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close: Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}
