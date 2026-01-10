# 🔧 Solución: Descarga de PDF en Dominio

## ❌ Problema Identificado

El PDF no se descargaba correctamente porque:
1. La ruta relativa `./PDF/Experiencias Fiordocumau.pdf` no funcionaba en el dominio
2. El nombre del archivo tiene un espacio que causa problemas en algunos servidores
3. Faltaba configuración del servidor para forzar la descarga

## ✅ Soluciones Implementadas

### 1. **Ruta Actualizada en index.html**

**Antes:**
```html
<a href="./PDF/Experiencias Fiordocumau.pdf" download>
```

**Ahora:**
```html
<a href="/PDF/Experiencias%20Fiordocumau.pdf"
   download="Expedicion-Fiordo-Comau-2025.pdf"
   target="_blank">
```

**Cambios:**
- ✅ Ruta absoluta desde la raíz: `/PDF/...`
- ✅ Espacio codificado como `%20` para compatibilidad
- ✅ Atributo `download` con nombre limpio (sin espacios)
- ✅ `target="_blank"` para abrir en nueva pestaña

### 2. **Archivo .htaccess Creado**

Ubicación: `PDF/.htaccess`

Este archivo asegura que:
- ✅ Los PDFs tengan el Content-Type correcto
- ✅ Se fuerce la descarga automáticamente
- ✅ Cache habilitado para mejor rendimiento
- ✅ CORS permitido si es necesario

### 3. **Sitemap Actualizado**

La ruta en `sitemap.xml` ahora apunta correctamente al PDF con la URL completa del dominio.

---

## 🧪 Cómo Verificar que Funciona

### Opción 1: Probar en Local (antes de subir)

1. Abre tu navegador
2. Ve a: `file:///ruta-completa/Pagina DeepX/index.html`
3. Haz clic en "Ver Itinerario Completo"
4. Clic en el botón "Descargar Itinerario Completo PDF"
5. **Debería:** Abrirse en nueva pestaña o descargarse automáticamente

### Opción 2: Probar en el Dominio (después de subir)

1. Sube todos los archivos a tu servidor:
   - `index.html` (actualizado)
   - `PDF/Experiencias Fiordocumau.pdf` (el PDF)
   - `PDF/.htaccess` (configuración)

2. Ve a: `https://www.deepxperience.cl`

3. Prueba el botón de descarga

4. **Debería descargar como:** `Expedicion-Fiordo-Comau-2025.pdf`

### Opción 3: Probar el PDF Directamente

Abre en el navegador:
```
https://www.deepxperience.cl/PDF/Experiencias%20Fiordocumau.pdf
```

**Debería:** Descargarse automáticamente o abrirse en el navegador

---

## ⚠️ Solución de Problemas

### Problema: "404 Not Found"

**Causa:** El archivo no está en el servidor o la ruta es incorrecta

**Solución:**
1. Verifica que el archivo PDF esté en: `public_html/PDF/` o `www/PDF/`
2. Verifica que el nombre sea EXACTAMENTE: `Experiencias Fiordocumau.pdf` (con espacio)

### Problema: "403 Forbidden"

**Causa:** Permisos incorrectos del archivo

**Solución:**
```bash
chmod 644 PDF/Experiencias\ Fiordocumau.pdf
chmod 644 PDF/.htaccess
```

### Problema: El PDF se abre en vez de descargarse

**Causa:** El .htaccess no está funcionando

**Solución Alternativa:**
Usa este botón en HTML:
```html
<a href="/PDF/Experiencias%20Fiordocumau.pdf"
   download="Expedicion-Fiordo-Comau-2025.pdf"
   onclick="window.open(this.href, '_blank'); return false;">
```

### Problema: El servidor no soporta .htaccess

**Causa:** Servidor Nginx o configuración especial

**Solución para Nginx:**
Agrega esto a tu configuración de Nginx:
```nginx
location ~* \.pdf$ {
    add_header Content-Disposition "attachment";
    add_header Content-Type "application/pdf";
}
```

---

## 📋 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `index.html` | ✅ Ruta del PDF actualizada |
| `PDF/.htaccess` | ✅ NUEVO - Configuración de descarga |
| `sitemap.xml` | ✅ URL del PDF actualizada |

---

## 🚀 Próximos Pasos

1. **Sube los archivos** a tu servidor vía FTP/cPanel:
   - `index.html`
   - `PDF/Experiencias Fiordocumau.pdf`
   - `PDF/.htaccess`
   - `sitemap.xml`

2. **Limpia el caché** de tu navegador (Ctrl + Shift + R)

3. **Prueba la descarga** en tu dominio

4. **Si sigue sin funcionar**, envíame:
   - La URL completa del PDF
   - El mensaje de error exacto (screenshot)
   - El tipo de servidor (Apache, Nginx, etc.)

---

## 📞 Soporte Adicional

Si después de seguir estos pasos aún no funciona:

1. Verifica la consola del navegador (F12 > Console) para errores
2. Verifica la pestaña Network (F12 > Network) para ver el status code
3. Contacta a tu proveedor de hosting para verificar:
   - Si `.htaccess` está habilitado
   - Si los headers HTTP están permitidos
   - Si hay alguna restricción en la carpeta PDF

---

**Creado:** 2025-01-09
**Para:** DeepXperience (deepxperience.cl)
