/**
 * Script para formulario de lista de espera
 * Maneja el envío de emails y validación
 */

import { EmailService, FormValidator } from "./modules/emailService.js";

class WaitlistForm {
  constructor() {
    this.form = document.getElementById("waitlistForm");
    this.emailService = new EmailService();
    this.submitButton = this.form?.querySelector('button[type="submit"]');
    this.successMessage = document.getElementById("successMessage");

    this.init();
  }

  init() {
    if (!this.form) {
      console.error("Waitlist form not found");
      return;
    }

    this.attachEventListeners();
    this.enhanceFormFields();
  }

  attachEventListeners() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Validación en tiempo real del email
    const emailInput = this.form.querySelector("#email");
    if (emailInput) {
      emailInput.addEventListener("blur", () => {
        if (
          emailInput.value &&
          !FormValidator.validateEmail(emailInput.value)
        ) {
          this.showFieldError(emailInput, "Email no válido");
        } else {
          this.clearFieldError(emailInput);
        }
      });
    }

    // Validación en tiempo real del teléfono
    const phoneInput = this.form.querySelector("#telefono");
    if (phoneInput) {
      phoneInput.addEventListener("blur", () => {
        if (
          phoneInput.value &&
          !FormValidator.validatePhone(phoneInput.value)
        ) {
          this.showFieldError(phoneInput, "Formato: +56 9 1234 5678");
        } else {
          this.clearFieldError(phoneInput);
        }
      });
    }
  }

  enhanceFormFields() {
    // Agregar indicadores visuales de campos requeridos
    const requiredInputs = this.form.querySelectorAll("[required]");
    requiredInputs.forEach((input) => {
      const label = this.form.querySelector(`label[for="${input.id}"]`);
      if (label && !label.querySelector(".required-indicator")) {
        label.innerHTML += ' <span class="required-indicator">*</span>';
      }
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    // Obtener datos del formulario
    const formData = {
      nombre: this.form.querySelector("#nombre").value.trim(),
      email: this.form.querySelector("#email").value.trim(),
      telefono: this.form.querySelector("#telefono").value.trim(),
      experiencia_interes: this.form.querySelector("#interes").value,
    };

    // Validar
    const validation = FormValidator.validateForm(formData);
    if (!validation.isValid) {
      this.showErrors(validation.errors);
      return;
    }

    // Deshabilitar botón y mostrar loading
    this.setSubmitting(true);

    try {
      // Verificar si EmailJS está configurado
      if (this.emailService.isConfigured) {
        await this.sendWithEmailJS(formData);
      } else {
        // Fallback: usar FormSubmit (el que ya tienes)
        await this.sendWithFormSubmit(formData);
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      this.showError(
        "Hubo un error. Por favor intenta nuevamente o escríbenos por WhatsApp."
      );
      this.setSubmitting(false);
    }
  }

  async sendWithEmailJS(formData) {
    try {
      console.log("📧 Enviando emails con EmailJS...");

      // Enviar ambos emails
      const results = await this.emailService.sendBothEmails(formData);

      // Guardar en Google Sheets (opcional)
      await this.emailService.saveToGoogleSheets(formData);

      // Mostrar mensaje de éxito
      this.showSuccess();

      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = "gracias.html";
      }, 2000);
    } catch (error) {
      throw error;
    }
  }

  async sendWithFormSubmit(formData) {
    console.log("📧 Usando FormSubmit fallback...");

    // FormSubmit maneja el envío automáticamente con el action del form
    // Solo necesitamos enviar el formulario normalmente
    this.form.submit();
  }

  showSuccess() {
    if (this.successMessage) {
      this.successMessage.classList.add("show");
      this.successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <strong>¡Perfecto!</strong> Revisa tu email (${
          this.form.querySelector("#email").value
        })
        para confirmar tu registro.
      `;
    }

    // Limpiar formulario
    this.form.reset();
  }

  showError(message) {
    if (this.successMessage) {
      this.successMessage.classList.add("show");
      this.successMessage.style.background = "rgba(244, 67, 54, 0.1)";
      this.successMessage.style.borderColor = "rgba(244, 67, 54, 0.3)";
      this.successMessage.style.color = "#f44336";
      this.successMessage.innerHTML = `
        <i class="fas fa-exclamation-circle"></i> ${message}
      `;
    }
  }

  showErrors(errors) {
    const errorMessage = errors.join("<br>");
    this.showError(errorMessage);

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      if (this.successMessage) {
        this.successMessage.classList.remove("show");
      }
    }, 5000);
  }

  showFieldError(input, message) {
    this.clearFieldError(input);

    input.style.borderColor = "#f44336";

    const errorSpan = document.createElement("span");
    errorSpan.className = "field-error";
    errorSpan.style.cssText =
      "color: #f44336; font-size: 13px; margin-top: 5px; display: block;";
    errorSpan.textContent = message;

    input.parentElement.appendChild(errorSpan);
  }

  clearFieldError(input) {
    input.style.borderColor = "";

    const existingError = input.parentElement.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }
  }

  setSubmitting(isSubmitting) {
    if (!this.submitButton) return;

    if (isSubmitting) {
      this.submitButton.disabled = true;
      this.submitButton.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i> Enviando...
      `;
    } else {
      this.submitButton.disabled = false;
      this.submitButton.innerHTML = `
        <i class="fas fa-paper-plane"></i> Guarda mi lugar
      `;
    }
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new WaitlistForm();
  });
} else {
  new WaitlistForm();
}
