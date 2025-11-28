# 📧 CONFIGURACIÓN DE SISTEMA DE EMAILS

Sistema completo para envío de emails profesionales con confirmación al usuario y notificación a DeepXperience.

---

## 🎯 LO QUE TIENES

✅ **Opción 1 (ACTUAL)**: FormSubmit - Ya funciona, básico
✅ **Opción 2 (NUEVO)**: EmailJS - Emails HTML hermosos, mejor experiencia

**RECOMENDACIÓN**: Usar EmailJS para emails profesionales

---

## 🚀 CONFIGURACIÓN EMAILJS (15 minutos)

### Paso 1: Crear cuenta EmailJS (GRATIS)

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click en "Sign Up" (arriba derecha)
3. Regístrate con tu email (info@deepxperience.cl o el que prefieras)
4. Confirma tu email

**Plan gratuito**: 200 emails/mes (más que suficiente para empezar)

---

### Paso 2: Conectar tu servicio de email

1. En el dashboard de EmailJS, ve a "Email Services"
2. Click en "Add New Service"
3. Selecciona **Gmail** (el más fácil)
4. Conecta con tu cuenta de Gmail (info@deepxperience.cl)
5. Copia el **Service ID** (ej: `service_abc123`)

**IMPORTANTE**: Guarda el Service ID, lo necesitarás después.

---

### Paso 3: Crear Template 1 - Confirmación al Usuario

1. Ve a "Email Templates"
2. Click en "Create New Template"
3. Nombre del template: **Confirmación Usuario - Lista Espera**
4. Usa estos valores:

**Template ID**: `template_user_confirmation`

**From Email**: `{{from_name}}`
**From Name**: `DeepXperience`
**To Email**: `{{to_email}}`
**Subject**: `🌍 ¡Bienvenido a la Travesía 2026!`

**Content (HTML)**:
Copia TODO el contenido de: `email-templates/template-confirmacion-usuario.html`

**Variables que usa** (EmailJS las reemplaza automáticamente):
- `{{user_name}}` - Nombre del usuario
- `{{user_email}}` - Email del usuario
- `{{user_phone}}` - Teléfono del usuario
- `{{experience_interest}}` - Experiencia de interés
- `{{current_date}}` - Fecha actual
- `{{current_year}}` - Año actual

5. Click en "Save"

---

### Paso 4: Crear Template 2 - Notificación a DeepXperience

1. Click en "Create New Template" de nuevo
2. Nombre: **Notificación Admin - Nuevo Lead**
3. Usa estos valores:

**Template ID**: `template_admin_notification`

**From Email**: `noreply@deepxperience.cl`
**From Name**: `Sistema DeepXperience`
**To Email**: `info@deepxperience.cl`
**CC**: `joaquinurzuad@gmail.com`
**Subject**: `🎉 Nuevo Lead - {{user_name}} - Lista de Espera 2026`

**Content (HTML)**:
Copia TODO el contenido de: `email-templates/template-notificacion-admin.html`

4. Click en "Save"

---

### Paso 5: Obtener tu Public Key

1. Ve a "Account" (tu perfil, arriba derecha)
2. En "General" encontrarás tu **Public Key**
3. Copia el Public Key (ej: `abc123xyz456`)

---

### Paso 6: Configurar en tu código

Abre: `js/modules/emailService.js`

Busca las líneas 11-17 y reemplaza con tus datos:

```javascript
this.config = {
  publicKey: 'TU_PUBLIC_KEY_AQUI',  // ← Pegar aquí tu Public Key
  serviceId: 'service_abc123',      // ← Pegar aquí tu Service ID
  templateUserConfirmation: 'template_user_confirmation',  // ✅ Ya está
  templateAdminNotification: 'template_admin_notification' // ✅ Ya está
};
```

**EJEMPLO COMPLETO**:
```javascript
this.config = {
  publicKey: 'vR8xKp2QmYx_H3nL9',
  serviceId: 'service_deepx2026',
  templateUserConfirmation: 'template_user_confirmation',
  templateAdminNotification: 'template_admin_notification'
};
```

---

### Paso 7: Agregar script de EmailJS al HTML

Abre: `lista-espera.html`

ANTES del cierre de `</head>`, agrega:

```html
<!-- EmailJS SDK -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

---

### Paso 8: Agregar el script del formulario

ANTES del cierre de `</body>`, reemplaza el script actual por:

```html
<!-- JavaScript modular con ES6 modules -->
<script type="module" src="js/waitlist-form.js"></script>
```

---

### Paso 9: ¡PROBAR!

1. Abre `lista-espera.html` en un servidor local
2. Llena el formulario con TU email
3. Envía el formulario
4. Deberías recibir DOS emails:
   - ✅ Email hermoso de confirmación (a ti)
   - ✅ Email de notificación con tus datos (a DeepXperience)

---

## 📊 BONUS: GOOGLE SHEETS PARA GUARDAR LEADS

### ¿Por qué?
- Base de datos automática de todos los registros
- Fácil de compartir con tu equipo
- Puedes exportar a Excel
- Backup automático

### Configuración (10 minutos):

#### Paso 1: Crear Google Sheet

1. Ve a [https://sheets.google.com](https://sheets.google.com)
2. Crea una nueva hoja
3. Nómbrala: **DeepXperience - Lista Espera 2026**
4. En la primera fila, agrega estos encabezados:

| Fecha | Hora | Nombre | Email | Teléfono | Experiencia | Fuente |
|-------|------|--------|-------|----------|-------------|--------|

#### Paso 2: Crear Google Apps Script

1. En tu Google Sheet, ve a **Extensiones > Apps Script**
2. Borra el código que aparece
3. Pega este código:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Obtener fecha y hora
    var now = new Date();
    var fecha = Utilities.formatDate(now, "GMT-3", "dd/MM/yyyy");
    var hora = Utilities.formatDate(now, "GMT-3", "HH:mm:ss");

    // Agregar fila con datos
    sheet.appendRow([
      fecha,
      hora,
      data.nombre,
      data.email,
      data.telefono,
      data.experiencia_interes,
      data.source
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'error': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click en **Guardar** (icono de disco)
5. Click en **Implementar > Nueva implementación**
6. Tipo: **Aplicación web**
7. Configuración:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
8. Click en **Implementar**
9. **IMPORTANTE**: Copia la URL que aparece (ej: `https://script.google.com/macros/s/ABC123.../exec`)

#### Paso 3: Configurar en el código

Abre: `js/modules/emailService.js`

Busca la línea 75 y pega tu URL:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/ABC123.../exec';
```

**¡LISTO!** Ahora cada registro se guardará automáticamente en Google Sheets.

---

## 📋 CHECKLIST FINAL

Antes de poner en producción, verifica:

- [ ] EmailJS configurado con Public Key y Service ID
- [ ] Template de confirmación al usuario creado
- [ ] Template de notificación a admin creado
- [ ] Script de EmailJS agregado al HTML
- [ ] Script waitlist-form.js agregado al HTML
- [ ] Google Sheets configurado (opcional pero recomendado)
- [ ] Probado con tu propio email
- [ ] Emails recibidos correctamente
- [ ] Datos guardados en Google Sheets (si lo configuraste)

---

## 🆘 TROUBLESHOOTING

### "EmailJS not configured"
**Solución**: Verifica que hayas pegado correctamente el Public Key en `emailService.js`

### No recibo emails
**Solución**:
1. Verifica que el Service ID sea correcto
2. Verifica que los Template IDs coincidan
3. Revisa la consola del navegador (F12) para ver errores

### Error CORS en Google Sheets
**Solución**: Es normal, el modo 'no-cors' no muestra respuesta pero funciona. Verifica tu Google Sheet para confirmar que se guardó.

### FormSubmit sigue enviando
**Solución**: Si no quieres usar FormSubmit, cambia el atributo `action` del form a `#`:
```html
<form id="waitlistForm" action="#" method="POST">
```

---

## 💰 COSTOS

| Servicio | Plan Gratuito | Plan Pago |
|----------|---------------|-----------|
| **EmailJS** | 200 emails/mes | $15/mes - 1000 emails |
| **FormSubmit** | Ilimitado gratis | N/A |
| **Google Sheets** | Gratis | Gratis |

**RECOMENDACIÓN**: Empieza con EmailJS gratis. Si superas 200 emails/mes, ¡significa que tu negocio está creciendo! 🚀

---

## 🎨 PERSONALIZACIÓN

### Cambiar colores de los emails
Edita los archivos en `email-templates/` y cambia:
- `#f59b22` - Color naranja principal
- `#00d4ff` - Color azul acento

### Agregar tu logo
Reemplaza la URL del logo en los templates:
```html
<img src="https://TU-DOMINIO.com/ruta-a-tu-logo.png" alt="Tu Logo">
```

### Cambiar textos
Edita directamente los templates HTML en `email-templates/`

---

## 📞 SOPORTE

¿Problemas configurando?
- Revisa los errores en la consola del navegador (F12)
- Lee la documentación de EmailJS: https://www.emailjs.com/docs/
- Escríbeme tus dudas

---

**Creado por Claude Code para DeepXperience** 🚀
