/**
 * Gestor de Navegación
 * Maneja el menú móvil, scroll suave y navbar sticky
 */

export class NavigationManager {
  constructor(languageManager) {
    this.languageManager = languageManager;
    this.menuToggle = document.getElementById('menu-toggle');
    this.navLinks = document.getElementById('nav-links');
    this.navbar = document.getElementById('navbar');
    this.lastScroll = 0;

    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupStickyNavbar();
    this.setupFooterAccordion();
  }

  setupMobileMenu() {
    if (!this.menuToggle || !this.navLinks) return;

    // Toggle menu
    this.menuToggle.addEventListener('click', () => {
      const isActive = this.navLinks.classList.contains('active');
      if (isActive) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    });

    // Cerrar menú al hacer clic en enlaces
    this.navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          setTimeout(() => this.closeMenu(), 300);
        }
      });
    });
  }

  openMenu() {
    this.navLinks.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.menuToggle.innerHTML = '<i class="fas fa-times"></i>';

    // Crear selector de idioma móvil
    if (this.languageManager) {
      this.languageManager.createMobileLangSelector(this.navLinks);
    }
  }

  closeMenu() {
    this.navLinks.classList.remove('active');
    document.body.style.overflow = 'auto';
    this.menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const navHeight = window.innerWidth <= 768 ? 70 : 100;
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - navHeight,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupStickyNavbar() {
    if (!this.navbar) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.pageYOffset;
          this.navbar.classList.toggle('scrolled', currentScroll > 100);
          this.lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  setupFooterAccordion() {
    if (window.innerWidth > 768) return;

    document.querySelectorAll('.footer-column h3').forEach(header => {
      header.addEventListener('click', function() {
        const column = this.parentElement;
        const isActive = column.classList.contains('active');

        // Cerrar todos
        document.querySelectorAll('.footer-column').forEach(col =>
          col.classList.remove('active')
        );

        // Abrir el clickeado si no estaba activo
        if (!isActive) {
          column.classList.add('active');
        }
      });
    });
  }
}
