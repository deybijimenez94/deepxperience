/**
 * FAQ Accordion Manager
 * Maneja la funcionalidad de acordeón para la sección de preguntas frecuentes
 */

export class FAQManager {
  constructor() {
    this.faqButtons = document.querySelectorAll('.faq-question');
    this.init();
  }

  init() {
    if (this.faqButtons.length === 0) {
      console.warn('No FAQ questions found');
      return;
    }

    this.attachEventListeners();
    console.log(`FAQ Manager initialized with ${this.faqButtons.length} questions`);
  }

  attachEventListeners() {
    this.faqButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleClick(e));

      // Soporte para teclado (accessibility)
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleClick(e);
        }
      });
    });
  }

  handleClick(event) {
    const button = event.currentTarget;
    const answer = button.nextElementSibling;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    // Cerrar todos los otros items (accordion single)
    this.closeAll(button);

    // Toggle el item actual
    if (!isExpanded) {
      this.openItem(button, answer);
    } else {
      this.closeItem(button, answer);
    }
  }

  openItem(button, answer) {
    button.setAttribute('aria-expanded', 'true');
    answer.classList.add('active');

    // Scroll suave hacia la pregunta si está parcialmente fuera de vista
    setTimeout(() => {
      this.scrollToItem(button);
    }, 100);
  }

  closeItem(button, answer) {
    button.setAttribute('aria-expanded', 'false');
    answer.classList.remove('active');
  }

  closeAll(exceptButton = null) {
    this.faqButtons.forEach(button => {
      if (button !== exceptButton) {
        const answer = button.nextElementSibling;
        this.closeItem(button, answer);
      }
    });
  }

  scrollToItem(button) {
    const rect = button.getBoundingClientRect();
    const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;

    if (!isInViewport) {
      const offset = 100; // Espacio desde el top
      const elementPosition = button.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Método público para abrir una pregunta específica por índice
  openQuestion(index) {
    if (index >= 0 && index < this.faqButtons.length) {
      const button = this.faqButtons[index];
      const answer = button.nextElementSibling;
      this.closeAll();
      this.openItem(button, answer);
    }
  }

  // Método público para cerrar todas las preguntas
  closeAllQuestions() {
    this.closeAll();
  }
}
