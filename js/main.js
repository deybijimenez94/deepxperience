/**
 * DEEPXPERIENCE - Main Application
 * Punto de entrada principal que inicializa todos los módulos
 */

import { Carousel3D, ExperienceCarousel } from './modules/carousel.js';
import { LanguageManager } from './modules/language.js';
import { ModalManager } from './modules/modal.js';
import { NavigationManager } from './modules/navigation.js';
import { ScrollManager } from './modules/scroll.js';
import { LazyLoadManager, preloadCriticalResources } from './modules/lazyload.js';

class DeepXperienceApp {
  constructor() {
    this.modules = {};
    this.init();
  }

  async init() {
    try {
      console.log('DeepXperience loading...');

      // Precargar recursos críticos inmediatamente
      preloadCriticalResources();

      // Esperar a que el DOM esté listo
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Inicializar módulos en orden
      this.initLanguage();
      this.initLazyLoading();
      this.initCarousels();
      this.initModals();
      this.initNavigation();
      this.initScroll();

      // Hacer visible la página
      this.showPage();

      console.log('DeepXperience loaded successfully ✓');
    } catch (error) {
      console.error('Error initializing DeepXperience:', error);
      // Mostrar la página de todos modos
      this.showPage();
    }
  }

  initLanguage() {
    try {
      this.modules.language = new LanguageManager();
    } catch (error) {
      console.error('Error initializing LanguageManager:', error);
    }
  }

  initLazyLoading() {
    try {
      this.modules.lazyLoad = new LazyLoadManager();
    } catch (error) {
      console.error('Error initializing LazyLoadManager:', error);
    }
  }

  initCarousels() {
    try {
      // Carrusel 3D principal
      this.modules.carousel3D = new Carousel3D('.carousel-container');

      // Carrusel de experiencias (Torres del Paine)
      this.modules.experienceCarousel = new ExperienceCarousel('torres-paine-carousel');
    } catch (error) {
      console.error('Error initializing carousels:', error);
    }
  }

  initModals() {
    try {
      this.modules.modal = new ModalManager();
    } catch (error) {
      console.error('Error initializing ModalManager:', error);
    }
  }

  initNavigation() {
    try {
      this.modules.navigation = new NavigationManager(this.modules.language);
    } catch (error) {
      console.error('Error initializing NavigationManager:', error);
    }
  }

  initScroll() {
    try {
      this.modules.scroll = new ScrollManager();
    } catch (error) {
      console.error('Error initializing ScrollManager:', error);
    }
  }

  showPage() {
    document.body.style.opacity = '1';
  }

  destroy() {
    // Limpiar recursos si es necesario
    if (this.modules.carousel3D) this.modules.carousel3D.destroy();
    if (this.modules.experienceCarousel) this.modules.experienceCarousel.destroy();
    if (this.modules.lazyLoad) this.modules.lazyLoad.disconnect();
  }
}

// Inicializar la aplicación
const app = new DeepXperienceApp();

// Exponer globalmente para debugging (opcional)
if (window) {
  window.DeepXperience = app;
}

export default app;
