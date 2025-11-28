/**
 * Gestor de Modales
 * Maneja la apertura, cierre y eventos de modales
 */

export class ModalManager {
  constructor() {
    this.modals = [];
    this.init();
  }

  init() {
    // Setup modal Torres del Paine
    this.setupModal(
      'open-torres-paine',
      'modal-torres-paine',
      'close-torres-paine'
    );

    // Setup modal Quiénes Somos
    this.setupModal(
      'open-quienes-somos',
      'modal-quienes-somos',
      'close-modal'
    );

    // Cerrar modales con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  setupModal(linkId, modalId, closeId) {
    const link = document.getElementById(linkId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);

    if (!modal) {
      console.warn(`Modal not found: ${modalId}`);
      return;
    }

    this.modals.push({ id: modalId, element: modal });

    // Abrir modal
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal(modal);
      });
    }

    // Cerrar modal con botón
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal(modal);
      });
    }

    // Cerrar modal al hacer click fuera
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    });
  }

  openModal(modal) {
    try {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Capturar el foco en el modal
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }

  closeModal(modal) {
    try {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  }

  closeAllModals() {
    this.modals.forEach(({ element }) => {
      this.closeModal(element);
    });
  }
}
