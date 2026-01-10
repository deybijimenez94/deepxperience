# 🧪 Guía de Prueba - Descarga de PDF

## ✅ Solución Implementada - Triple Capa de Seguridad

He implementado **3 sistemas diferentes** que trabajan en cascada para garantizar que el PDF se descargue:

### 1️⃣ Sistema JavaScript Principal (pdfDownload.js)
- **Método 1:** Fetch API + Blob (moderno, funciona en móviles)
- **Método 2:** Creación de enlace temporal con download attribute
- **Método 3:** window.open() como último recurso

### 2️⃣ Script de Respaldo Inline
- Si los módulos ES6 fallan, un script simple en el HTML permite la descarga nativa

### 3️⃣ Descarga Nativa del Navegador
- El atributo `download` y `target="_blank"` del HTML funcionan sin JavaScript

---

## 🔍 Cómo Probar Localmente (ANTES de subir al servidor)

### Opción A: Servidor Local con Python (Recomendado)

1. **Abre la terminal** en la carpeta del proyecto
2. **Ejecuta uno de estos comandos:**

   ```bash
   # Python 3
   python -m http.server 8000

   # O Python 2
   python -m SimpleHTTPServer 8000
   ```

3. **Abre tu navegador** en: `http://localhost:8000`
4. **Prueba el botón** de descarga del PDF

### Opción B: Servidor Local con Node.js

1. **Instala http-server** (solo la primera vez):
   ```bash
   npm install -g http-server
   ```

2. **Ejecuta en la carpeta del proyecto:**
   ```bash
   http-server -p 8000
   ```

3. **Abre:** `http://localhost:8000`

### Opción C: Live Server de VS Code

1. **Instala la extensión** "Live Server" en VS Code
2. **Haz clic derecho** en `index.html`
3. **Selecciona:** "Open with Live Server"

---

## 🌐 Cómo Probar en el Servidor (deepxperience.cl)

### Paso 1: Subir Archivos

Sube estos archivos a tu servidor (vía FTP, cPanel, FileZilla, etc.):

```
✅ ARCHIVOS MODIFICADOS:
   - index.html
   - js/main.js
   - styles.css

✅ ARCHIVOS NUEVOS:
   - js/modules/pdfDownload.js
   - PDF/.htaccess

✅ ARCHIVO PDF:
   - PDF/Experiencias Fiordocumao.pdf
```

### Paso 2: Verificar Permisos (en servidor Linux)

Si tienes acceso SSH:
```bash
chmod 644 PDF/Experiencias\ Fiordocumao.pdf
chmod 644 PDF/.htaccess
```

### Paso 3: Probar la Descarga

1. **Limpia el caché** del navegador: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
2. **Ve a:** `https://www.deepxperience.cl`
3. **Haz clic** en "Ver Itinerario Completo"
4. **Haz clic** en "Descargar Itinerario Completo PDF"

---

## 🔧 Qué Debería Pasar

### ✅ Comportamiento Esperado:

**En Desktop:**
- El archivo se descarga automáticamente como: `Expedicion-Fiordo-Comau-2025.pdf`
- Aparece en tu carpeta de Descargas

**En Móvil:**
- Se descarga el archivo O se abre en el visor de PDF del sistema
- Desde el visor puedes compartir/guardar el archivo

### 📊 Mensajes en la Consola del Navegador:

Abre la consola (F12) y deberías ver:

```
Intentando descargar PDF: PDF/Experiencias Fiordocumao.pdf
Iniciando descarga del PDF con fetch...
PDF descargado, creando blob...
Blob creado: 1234567 bytes
✅ PDF descargado exitosamente
```

---

## ❌ Solución de Problemas

### Problema 1: "Error 404 - Not Found"

**Causa:** El archivo PDF no está en el servidor

**Solución:**
1. Verifica que el archivo esté en: `public_html/PDF/` o `www/PDF/`
2. Verifica que el nombre sea exacto: `Experiencias Fiordocumao.pdf` (con espacio)

### Problema 2: "Error 403 - Forbidden"

**Causa:** Permisos incorrectos

**Solución:**
```bash
chmod 755 PDF/
chmod 644 PDF/*.pdf
chmod 644 PDF/.htaccess
```

### Problema 3: El PDF se abre en vez de descargarse

**Esto es NORMAL en algunos casos:**
- En navegadores modernos, los PDFs se abren en el visor integrado
- El usuario puede descargarlo desde ahí haciendo clic en el ícono de descarga
- En móviles, esto depende del sistema operativo

**Si quieres forzar la descarga directa:**
- El archivo `.htaccess` ya está configurado para esto
- Verifica que tu servidor Apache tenga `mod_headers` habilitado

### Problema 4: No pasa nada al hacer clic

**Diagnóstico:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Haz clic en el botón
4. Envíame los mensajes de error que aparezcan

**Causas comunes:**
- El módulo `pdfDownload.js` no se cargó
- Hay un error JavaScript bloqueando la ejecución
- El navegador está bloqueando la descarga (popup blocker)

---

## 📱 Probar en Diferentes Dispositivos

### Desktop
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari

### Móvil
- ✅ iPhone (Safari)
- ✅ Android (Chrome)
- ✅ Tablets

---

## 🚨 Si NADA Funciona

Si después de probar todo, el PDF aún no se descarga:

### Solución de Emergencia: Enlace Directo Simple

Reemplaza el botón en `index.html` (línea 494) con esto:

```html
<a href="PDF/Experiencias Fiordocumao.pdf" class="download-pdf-btn btn-primary" target="_blank" rel="noopener noreferrer">
    <i class="fas fa-download"></i>
    <span data-lang-key="modal-patagonia-download-cta">Descargar Itinerario Completo PDF</span>
</a>
```

Esto abrirá el PDF en una nueva pestaña, desde donde el usuario puede descargarlo manualmente.

---

## 📞 Información para Soporte

Si necesitas ayuda, envíame:

1. **URL donde no funciona:** (ejemplo: https://www.deepxperience.cl)
2. **Navegador y versión:** (ejemplo: Chrome 120, Firefox 121, etc.)
3. **Dispositivo:** (Desktop Windows, iPhone 14, Android, etc.)
4. **Screenshot de la consola** con los errores (F12 > Console)
5. **Qué pasa al hacer clic:** (nada, error, se abre en nueva pestaña, etc.)

---

**Creado:** 2025-01-09
**Objetivo:** Garantizar que el PDF se descargue en todos los dispositivos y navegadores
