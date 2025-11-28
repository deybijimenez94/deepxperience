/**
 * Lazy Loading Avanzado
 * Mejora el loading="lazy" nativo con Intersection Observer
 * y efectos de fade-in suaves
 */

export class LazyLoadManager {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px 0px',
      threshold: 0.01,
      loadingClass: 'is-loading',
      loadedClass: 'is-loaded',
      errorClass: 'has-error',
      ...options
    };

    this.observer = null;
    this.init();
  }

  init() {
    // Si el navegador no soporta IntersectionObserver, usar loading nativo
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, using native lazy loading');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      }
    );

    this.observeImages();
  }

  observeImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(img => {
      // Agregar clase de loading
      img.classList.add(this.options.loadingClass);

      // Observar la imagen
      this.observer.observe(img);

      // Agregar listeners de carga
      img.addEventListener('load', () => this.onImageLoad(img));
      img.addEventListener('error', () => this.onImageError(img));
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // Si la imagen ya tiene src o ya está cargada, skip
        if (img.complete || img.classList.contains(this.options.loadedClass)) {
          this.observer.unobserve(img);
          return;
        }

        // Precargar la imagen si tiene data-src
        if (img.dataset.src) {
          this.loadImage(img);
        }

        // Dejar de observar
        this.observer.unobserve(img);
      }
    });
  }

  loadImage(img) {
    const src = img.dataset.src || img.src;

    if (!src) return;

    // Crear una nueva imagen para precargar
    const tempImg = new Image();

    tempImg.onload = () => {
      img.src = src;
      img.removeAttribute('data-src');
    };

    tempImg.onerror = () => {
      this.onImageError(img);
    };

    tempImg.src = src;
  }

  onImageLoad(img) {
    img.classList.remove(this.options.loadingClass);
    img.classList.add(this.options.loadedClass);

    // Fade in suave
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease-in-out';

    requestAnimationFrame(() => {
      img.style.opacity = '1';
    });
  }

  onImageError(img) {
    img.classList.remove(this.options.loadingClass);
    img.classList.add(this.options.errorClass);

    console.error('Error loading image:', img.src || img.dataset.src);

    // Opcional: mostrar imagen de placeholder
    // img.src = '/path/to/placeholder.jpg';
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

/**
 * Preload de recursos críticos
 */
export function preloadCriticalResources() {
  // Preload de imágenes críticas del hero
  const heroImg = document.querySelector('.hero-bg');
  if (heroImg) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = 'Imagenes/Portada-optimized.webp';
    document.head.appendChild(link);
  }

  // Preload de fuentes críticas (opcional)
  const fontLinks = [
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
  ];

  fontLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
}
