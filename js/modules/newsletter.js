/**
 * Newsletter Form Handler
 * Maneja el formulario de suscripción del newsletter en el footer
 */

import { FormValidator } from './emailService.js';

export class NewsletterManager {
  constructor() {
    this.form = null;
    this.submitButton = null;
    this.emailInput = null;
    // Rate limiting: 60 segundos entre envíos
    this.lastSubmit = 0;
    this.cooldown = 60000; // 1 minuto en milisegundos
    this.init();
  }

  init() {
    this.form = document.querySelector('.newsletter-form');

    if (!this.form) {
      console.warn('Newsletter form not found');
      return;
    }

    this.emailInput = this.form.querySelector('input[type="email"]');
    this.submitButton = this.form.querySelector('button[type="submit"]');

    this.attachEventListeners();
  }

  attachEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(event) {
    event.preventDefault();

    // ✅ Rate limiting: Prevenir spam
    const now = Date.now();
    const timeSinceLastSubmit = now - this.lastSubmit;

    if (timeSinceLastSubmit < this.cooldown) {
      const remainingSeconds = Math.ceil((this.cooldown - timeSinceLastSubmit) / 1000);
      this.showMessage(
        `Por favor espera ${remainingSeconds} segundos antes de enviar nuevamente`,
        'error'
      );
      return;
    }

    const email = this.emailInput.value.trim();

    // Validar email
    if (!FormValidator.validateEmail(email)) {
      this.showMessage('Por favor ingresa un email válido', 'error');
      return;
    }

    // Deshabilitar botón mientras se procesa
    this.setLoading(true);

    try {
      // Opción 1: Usar FormSubmit (simple y gratuito)
      await this.sendToFormSubmit(email);

      // Opción 2: Si quieres usar EmailJS, descomenta esto:
      // await this.sendToEmailJS(email);

      this.showMessage('¡Gracias por suscribirte! 🎉', 'success');
      this.form.reset();

      // Actualizar timestamp para rate limiting
      this.lastSubmit = Date.now();

      // Opcional: Guardar en localStorage para no mostrar el form de nuevo
      localStorage.setItem('newsletter_subscribed', 'true');

    } catch (error) {
      console.error('Error al suscribirse al newsletter:', error);
      this.showMessage('Hubo un error. Por favor intenta más tarde.', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Opción 1: Usar FormSubmit (más simple, sin configuración)
   */
  async sendToFormSubmit(email) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('_subject', 'Nueva suscripción al Newsletter - DeepXperience');
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');

    // Cambiar este email por el tuyo en FormSubmit.co
    const response = await fetch('https://formsubmit.co/info@deepxperience.cl', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al enviar formulario');
    }

    return response.json();
  }

  /**
   * Opción 2: Usar EmailJS (más control, requiere configuración)
   */
  async sendToEmailJS(email) {
    // Verificar si EmailJS está disponible
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS no está cargado');
    }

    const templateParams = {
      to_email: 'info@deepxperience.cl',
      subscriber_email: email,
      subscription_date: new Date().toLocaleString('es-CL'),
    };

    // Crear un template en EmailJS llamado "template_newsletter"
    const response = await emailjs.send(
      'service_siovfrr', // Tu Service ID
      'template_newsletter', // Template ID para newsletter
      templateParams
    );

    return response;
  }

  setLoading(isLoading) {
    if (!this.submitButton) return;

    if (isLoading) {
      this.submitButton.disabled = true;
      this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      this.emailInput.disabled = true;
    } else {
      this.submitButton.disabled = false;
      this.submitButton.innerHTML = this.submitButton.getAttribute('data-lang-key')
        ? document.querySelector(`[data-lang-key="${this.submitButton.getAttribute('data-lang-key')}"]`)?.textContent || 'Suscribir'
        : 'Suscribir';
      this.emailInput.disabled = false;
    }
  }

  showMessage(message, type = 'info') {
    // Eliminar mensaje anterior si existe
    const existingMessage = this.form.querySelector('.newsletter-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `newsletter-message newsletter-message--${type}`;
    messageDiv.textContent = message;

    // Insertar después del formulario
    this.form.parentNode.insertBefore(messageDiv, this.form.nextSibling);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      messageDiv.style.opacity = '0';
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
  }
}
