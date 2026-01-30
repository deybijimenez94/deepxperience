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
      // Información Personal
      to_email: userData.email,
      user_name: userData.nombre,
      user_email: userData.email,

      // Fechas de Viaje
      fecha_preferida: userData.fecha_preferida || "No especificada",
      fecha_alternativa: userData.fecha_alternativa || "Sin fecha alternativa",
      flexibilidad: userData.flexibilidad || "No especificada",

      // Detalles del Grupo
      num_personas: userData.num_personas || "1",
      certificacion_buceo: userData.certificacion_buceo || "No especificada",
      presupuesto_estimado: userData.presupuesto_estimado || "No especificado",

      // Contacto
      pais: userData.pais || "No especificado",
      codigo_pais: userData.codigo_pais || "",
      user_phone: userData.telefono || "No proporcionado",

      // Preferencias
      intereses: userData.intereses || "No especificado",
      destino_preferido: userData.destino_preferido || "Sin preferencia",
      comentarios: userData.comentarios || "Sin comentarios",

      // Metadata
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
      // Destinatarios
      to_email: "info@deepxperience.cl",
      cc_email: "joaquinurzuad@gmail.com",

      // Información Personal
      user_name: userData.nombre,
      user_email: userData.email,

      // Fechas de Viaje
      fecha_preferida: userData.fecha_preferida || "No especificada",
      fecha_alternativa: userData.fecha_alternativa || "Sin fecha alternativa",
      flexibilidad: userData.flexibilidad || "No especificada",

      // Detalles del Grupo
      num_personas: userData.num_personas || "1",
      certificacion_buceo: userData.certificacion_buceo || "No especificada",
      presupuesto_estimado: userData.presupuesto_estimado || "No especificado",

      // Contacto
      pais: userData.pais || "No especificado",
      codigo_pais: userData.codigo_pais || "",
      user_phone: userData.telefono || "No proporcionado",

      // Preferencias
      intereses: userData.intereses || "No especificado",
      destino_preferido: userData.destino_preferido || "Sin preferencia",
      comentarios: userData.comentarios || "Sin comentarios",

      // Metadata
      submission_date: new Date().toLocaleString("es-CL"),
      message_preview: `Nueva pre-reserva: ${userData.nombre} - ${userData.fecha_preferida || "Sin fecha"} - ${userData.num_personas} personas`,
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
      // Información Personal
      nombre: userData.nombre,
      email: userData.email,
      // Fechas de Viaje
      fecha_preferida: userData.fecha_preferida || "",
      fecha_alternativa: userData.fecha_alternativa || "",
      flexibilidad: userData.flexibilidad || "",
      // Detalles del Grupo
      num_personas: userData.num_personas || "",
      certificacion_buceo: userData.certificacion_buceo || "",
      presupuesto_estimado: userData.presupuesto_estimado || "",
      // Contacto
      pais: userData.pais || "",
      codigo_pais: userData.codigo_pais || "",
      telefono: userData.telefono || "",
      // Preferencias
      intereses: userData.intereses || "",
      destino_preferido: userData.destino_preferido || "",
      comentarios: userData.comentarios || "",
      source: "Pre-Reserva 2025",
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
    // Validación flexible para números internacionales
    if (!phone) return true; // Opcional

    // Aceptar números de 6 a 15 dígitos (estándar internacional)
    // Permitir espacios, guiones y paréntesis opcionales
    const phoneRegex = /^[\d\s\-()]{6,20}$/;

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
