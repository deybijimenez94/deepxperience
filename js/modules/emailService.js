/**
 * Servicio de Email para formularios
 * Usa EmailJS para enviar emails profesionales
 *
 * CONFIGURACIÓN NECESARIA:
 * 1. Crear cuenta en https://www.emailjs.com (GRATIS)
 * 2. Crear servicio de email (Gmail, Outlook, etc)
 * 3. Crear 2 templates (ver instrucciones abajo)
 * 4. Copiar las credenciales aquí
 */

export class EmailService {
  constructor() {
    // ⚠️ CONFIGURAR ESTAS CREDENCIALES DE EMAILJS
    this.config = {
      publicKey: "6IiDwhK_bmdHp7u3d",
      serviceId: "service_siovfrr",

      // Template para confirmación al usuario
      templateUserConfirmation: "template_user_confirmati",

      // Template para notificación a DeepXperience
      templateAdminNotification: "template_admin_notificat",
    };

    this.isConfigured = false;
    this.init();
  }

  init() {
    // Verificar si EmailJS está disponible
    if (typeof emailjs === "undefined") {
      console.error("EmailJS library not loaded. Add script to HTML.");
      return;
    }

    // Verificar configuración
    if (this.config.publicKey === "TU_PUBLIC_KEY_AQUI") {
      console.warn("⚠️ EmailJS not configured. Using FormSubmit fallback.");
      return;
    }

    // Inicializar EmailJS
    emailjs.init(this.config.publicKey);
    this.isConfigured = true;
    console.log("✅ EmailJS initialized successfully");
  }

  /**
   * Enviar email de confirmación al usuario
   */
  async sendUserConfirmation(userData) {
    if (!this.isConfigured) {
      throw new Error("EmailJS not configured");
    }

    const templateParams = {
      to_email: userData.email,
      user_name: userData.nombre,
      user_email: userData.email,
      user_phone: userData.telefono || "No proporcionado",
      experience_interest: userData.experiencia_interes || "No especificado",
      current_year: new Date().getFullYear(),
      current_date: new Date().toLocaleDateString("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    try {
      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateUserConfirmation,
        templateParams
      );

      console.log("✅ User confirmation sent:", response);
      return { success: true, response };
    } catch (error) {
      console.error("❌ Error sending user confirmation:", error);
      throw error;
    }
  }

  /**
   * Enviar notificación a DeepXperience con datos del usuario
   */
  async sendAdminNotification(userData) {
    if (!this.isConfigured) {
      throw new Error("EmailJS not configured");
    }

    const templateParams = {
      to_email: "info@deepxperience.cl",
      cc_email: "joaquinurzuad@gmail.com",
      user_name: userData.nombre,
      user_email: userData.email,
      user_phone: userData.telefono || "No proporcionado",
      experience_interest: userData.experiencia_interes || "No especificado",
      submission_date: new Date().toLocaleString("es-CL"),
      message_preview: `Nueva persona en lista de espera: ${userData.nombre}`,
    };

    try {
      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateAdminNotification,
        templateParams
      );

      console.log("✅ Admin notification sent:", response);
      return { success: true, response };
    } catch (error) {
      console.error("❌ Error sending admin notification:", error);
      throw error;
    }
  }

  /**
   * Enviar ambos emails (confirmación + notificación)
   */
  async sendBothEmails(userData) {
    const results = {
      userConfirmation: null,
      adminNotification: null,
      success: false,
    };

    try {
      // Enviar confirmación al usuario
      results.userConfirmation = await this.sendUserConfirmation(userData);

      // Enviar notificación a DeepXperience
      results.adminNotification = await this.sendAdminNotification(userData);

      results.success = true;
      return results;
    } catch (error) {
      console.error("Error sending emails:", error);
      throw error;
    }
  }

  /**
   * Guardar en Google Sheets (opcional pero recomendado)
   */
  async saveToGoogleSheets(userData) {
    // Configurar con Google Apps Script Web App
    const GOOGLE_SCRIPT_URL = "TU_GOOGLE_SCRIPT_URL_AQUI";

    if (GOOGLE_SCRIPT_URL === "TU_GOOGLE_SCRIPT_URL_AQUI") {
      console.warn("Google Sheets not configured, skipping...");
      return { success: false, message: "Not configured" };
    }

    const dataToSend = {
      timestamp: new Date().toISOString(),
      nombre: userData.nombre,
      email: userData.email,
      telefono: userData.telefono || "",
      experiencia_interes: userData.experiencia_interes || "",
      source: "Lista de Espera 2026",
    };

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      console.log("✅ Saved to Google Sheets");
      return { success: true };
    } catch (error) {
      console.error("❌ Error saving to Google Sheets:", error);
      return { success: false, error };
    }
  }
}

/**
 * Validador de formularios
 */
export class FormValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone) {
    // Validación básica para números chilenos
    if (!phone) return true; // Opcional
    const phoneRegex = /^(\+?56)?[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/;
    return phoneRegex.test(phone);
  }

  static validateForm(formData) {
    const errors = [];

    // Validar nombre
    if (!formData.nombre || formData.nombre.trim().length < 2) {
      errors.push("El nombre debe tener al menos 2 caracteres");
    }

    // Validar email
    if (!formData.email || !this.validateEmail(formData.email)) {
      errors.push("El email no es válido");
    }

    // Validar teléfono (opcional pero si está, debe ser válido)
    if (formData.telefono && !this.validatePhone(formData.telefono)) {
      errors.push("El teléfono no tiene un formato válido");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
