/**
 * Gestor de Scroll y Animaciones
 * Maneja parallax y animaciones al hacer scroll
 */

export class ScrollManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupParallax();
    this.setupScrollAnimations();
  }

  setupParallax() {
    // Solo en desktop para mejor performance
    if (window.innerWidth <= 768) return;

    const heroBackground = document.querySelector('.hero-bg');
    if (!heroBackground) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observar elementos para animar
    const elements = document.querySelectorAll(
      '.experience-row, .host-card, .azores-card, .about-text'
    );

    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.8s ease';
      observer.observe(el);
    });
  }
}
