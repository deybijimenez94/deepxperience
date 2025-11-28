/**
 * Módulo de Carrusel 3D
 * Maneja tanto el carrusel principal como los carruseles de experiencias
 */

export class Carousel3D {
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) {
      console.warn(`Carousel container not found: ${selector}`);
      return;
    }

    this.slides = this.container.querySelectorAll('.carousel-slide');
    this.dots = this.container.querySelectorAll('.carousel-dot');
    this.prevBtn = this.container.querySelector('.btn-carousel.prev');
    this.nextBtn = this.container.querySelector('.btn-carousel.next');

    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.autoPlayInterval = null;
    this.touchStartX = 0;

    this.options = {
      autoPlayInterval: window.innerWidth <= 768 ? 5000 : 4000,
      ...options
    };

    this.init();
  }

  init() {
    if (!this.totalSlides) return;

    this.updateCarousel();
    this.attachEventListeners();
    this.startAutoPlay();
  }

  updateCarousel() {
    try {
      this.slides.forEach((slide, index) => {
        let position = index - this.currentSlide;
        if (position > this.totalSlides / 2) position -= this.totalSlides;
        else if (position < -this.totalSlides / 2) position += this.totalSlides;
        slide.setAttribute('data-position', position);
      });

      this.dots.forEach((dot, i) =>
        dot.classList.toggle('active', i === this.currentSlide)
      );
    } catch (error) {
      console.error('Error updating carousel:', error);
    }
  }

  goToSlide(index) {
    if (!this.totalSlides) return;
    this.currentSlide = ((index % this.totalSlides) + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
  }

  nextSlide() {
    this.goToSlide(this.currentSlide + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentSlide - 1);
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.options.autoPlayInterval);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  attachEventListeners() {
    // Botones de navegación
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.startAutoPlay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.startAutoPlay();
      });
    }

    // Dots
    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        this.goToSlide(i);
        this.startAutoPlay();
      });
    });

    // Touch/Swipe
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = this.touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) this.nextSlide();
        else this.prevSlide();
        this.startAutoPlay();
      }
    });

    // Pausar al hover
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  destroy() {
    this.stopAutoPlay();
  }
}

/**
 * Carrusel de experiencias (más simple)
 */
export class ExperienceCarousel {
  constructor(id) {
    this.carousel = document.getElementById(id);
    if (!this.carousel) {
      console.warn(`Experience carousel not found: ${id}`);
      return;
    }

    this.slides = this.carousel.querySelectorAll('.experience-carousel-slide');
    this.dots = this.carousel.querySelectorAll('.experience-carousel-dot');
    this.prevBtn = this.carousel.querySelector('.experience-carousel-arrow.prev');
    this.nextBtn = this.carousel.querySelector('.experience-carousel-arrow.next');

    this.currentIndex = 0;
    this.autoInterval = null;

    this.init();
  }

  init() {
    if (!this.slides.length) return;

    this.showSlide(0);
    this.attachEventListeners();
    this.startAuto();
  }

  showSlide(index) {
    try {
      this.slides.forEach(s => s.classList.remove('active'));
      this.dots.forEach(d => d.classList.remove('active'));

      this.currentIndex = ((index % this.slides.length) + this.slides.length) % this.slides.length;

      this.slides[this.currentIndex].classList.add('active');
      this.dots[this.currentIndex].classList.add('active');
    } catch (error) {
      console.error('Error showing slide:', error);
    }
  }

  startAuto() {
    clearInterval(this.autoInterval);
    const interval = window.innerWidth <= 768 ? 4000 : 3500;
    this.autoInterval = setInterval(() => {
      this.showSlide(this.currentIndex + 1);
    }, interval);
  }

  attachEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.showSlide(this.currentIndex - 1);
        this.startAuto();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.showSlide(this.currentIndex + 1);
        this.startAuto();
      });
    }

    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        this.showSlide(idx);
        this.startAuto();
      });
    });

    // Touch support
    let touchStart = 0;
    this.carousel.addEventListener('touchstart', (e) => {
      touchStart = e.changedTouches[0].screenX;
    }, { passive: true });

    this.carousel.addEventListener('touchend', (e) => {
      const touchEnd = e.changedTouches[0].screenX;
      const diff = touchStart - touchEnd;

      if (Math.abs(diff) > 50) {
        if (diff > 0) this.showSlide(this.currentIndex + 1);
        else this.showSlide(this.currentIndex - 1);
      }
    });

    this.carousel.addEventListener('mouseenter', () => clearInterval(this.autoInterval));
    this.carousel.addEventListener('mouseleave', () => this.startAuto());
  }

  destroy() {
    clearInterval(this.autoInterval);
  }
}
