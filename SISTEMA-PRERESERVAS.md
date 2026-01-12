# 🗓️ Sistema de Pre-Reservas - DeepXperience

## 🎯 OBJETIVO:
Captar leads cualificados de una empresa nueva SIN precios definidos, permitiendo que usuarios indiquen fechas preferidas.

---

## 📝 FORMULARIO PROPUESTO: "Reserva tu Lugar"

### Versión 1: Simple (Implementar YA)
```html
<form id="prereserva-form">
  <!-- Información Personal -->
  <h3>Tus Datos</h3>
  <input type="text" name="nombre" placeholder="Nombre completo" required>
  <input type="email" name="email" placeholder="Email" required>
  <input type="tel" name="whatsapp" placeholder="WhatsApp (+56...)" required>
  <input type="text" name="pais" placeholder="País de residencia" required>

  <!-- Preferencias de Fecha -->
  <h3>¿Cuándo te gustaría viajar?</h3>

  <label>Fecha Preferida (opción 1):
    <input type="date" name="fecha1" min="2025-02-01" required>
  </label>

  <label>Fecha Alternativa (opción 2):
    <input type="date" name="fecha2" min="2025-02-01">
  </label>

  <label>Flexibilidad de fechas:
    <select name="flexibilidad">
      <option value="fija">Solo esas fechas específicas</option>
      <option value="semana">Flexible ±1 semana</option>
      <option value="mes">Flexible ±1 mes</option>
      <option value="temporada">Cualquier fecha en esa temporada</option>
    </select>
  </label>

  <!-- Calificación del Lead -->
  <h3>Detalles de tu Viaje</h3>

  <label>Número de personas:
    <select name="personas" required>
      <option value="1">1 persona</option>
      <option value="2">2 personas</option>
      <option value="3-4">3-4 personas</option>
      <option value="5+">5+ personas (grupo)</option>
    </select>
  </label>

  <label>Certificación de buceo:
    <select name="certificacion" required>
      <option value="sin-certificar">No tengo (necesito curso)</option>
      <option value="open-water">Open Water</option>
      <option value="advanced">Advanced Open Water</option>
      <option value="rescue">Rescue Diver o superior</option>
    </select>
  </label>

  <label>¿Has buceado en aguas frías antes?
    <select name="experiencia-frio">
      <option value="no">No, sería mi primera vez</option>
      <option value="pocas">Sí, 1-5 veces</option>
      <option value="varias">Sí, 6+ veces</option>
    </select>
  </label>

  <label>Rango de presupuesto estimado por persona:
    <select name="presupuesto">
      <option value="">Prefiero no responder</option>
      <option value="2000-2500">$2,000 - $2,500 USD</option>
      <option value="2500-3000">$2,500 - $3,000 USD</option>
      <option value="3000-3500">$3,000 - $3,500 USD</option>
      <option value="3500+">$3,500+ USD</option>
    </select>
  </label>

  <!-- Intereses Adicionales -->
  <label>¿Qué te interesa más de esta expedición? (puedes elegir varios)
    <div class="checkbox-group">
      <label><input type="checkbox" name="interes" value="buceo"> Buceo en aguas frías</label>
      <label><input type="checkbox" name="interes" value="termas"> Termas naturales</label>
      <label><input type="checkbox" name="interes" value="trekking"> Trekking</label>
      <label><input type="checkbox" name="interes" value="fotografia"> Fotografía submarina</label>
      <label><input type="checkbox" name="interes" value="conservacion"> Conservación marina</label>
    </div>
  </label>

  <!-- Comentarios -->
  <label>Comentarios o necesidades especiales:
    <textarea name="comentarios" rows="3" placeholder="Alergias, dietas especiales, nivel de condición física, etc."></textarea>
  </label>

  <!-- CTA -->
  <button type="submit" class="btn-primary">
    ASEGURAR MI LUGAR
  </button>

  <p class="form-disclaimer">
    ✅ Te confirmaremos disponibilidad en 24-48 horas<br>
    ✅ No hay compromiso de pago hasta que confirmes<br>
    ✅ Recibirás el precio final según temporada y grupo
  </p>
</form>
```

**Beneficios de este formulario:**
1. ✅ Capturas fechas preferidas del usuario
2. ✅ Calificas el lead (presupuesto, experiencia, grupo)
3. ✅ No prometes precio específico
4. ✅ Das sensación de "reservar" sin comprometer pago
5. ✅ Recoges data valiosa para pricing futuro

---

## 🗓️ SISTEMA DE GESTIÓN DE FECHAS

### Opción A: Google Calendar + EmailJS (GRATIS)

**Cómo funciona:**
1. Usuario llena formulario → EmailJS envía a tu email
2. Tú revisas disponibilidad en tu Google Calendar personal
3. Respondes al cliente en 24h con confirmación
4. Actualizas tu calendario para bloquear fechas

**Ventaja**: Cero costo, simple
**Desventaja**: Manual, no escalable

---

### Opción B: Airtable como Base de Datos (GRATIS hasta 1,200 registros/mes)

**Estructura de tabla:**
```
Fecha Solicitada | Nombre | Email | WhatsApp | Estado | Prioridad
2025-03-15      | Juan   | ...   | +56...   | Pendiente | Alta
2025-03-15      | María  | ...   | +56...   | Confirmada | Alta
2025-04-10      | Pedro  | ...   | +56...   | Lista Espera | Media
```

**Cómo implementar:**
1. Crea cuenta en Airtable (gratis)
2. Crea tabla con columnas arriba
3. Conecta formulario a Airtable vía webhook
4. Tú gestionas todo desde Airtable (app móvil disponible)

**Webhook URL**: `https://api.airtable.com/v0/{baseId}/{tableName}`

**Ventaja**: Escalable, fácil de ver qué fechas tienen más demanda
**Desventaja**: Requiere configuración inicial (15 minutos)

---

### Opción C: Calendly + EmailJS (SEMI-AUTOMATIZADO)

**Cómo funciona:**
1. Creas cuenta Calendly (gratis)
2. Configuras tus "slots" disponibles:
   - Marzo 2025: 15-20
   - Abril 2025: 10-15
   - Mayo 2025: 5-10
3. Usuario elige fecha de tu calendario
4. Recibe confirmación automática
5. Tú recibes notificación

**Ventaja**: Semi-automático, profesional, integración fácil
**Desventaja**: En versión gratis solo 1 tipo de evento

---

## 📊 PROPUESTA: Sistema Híbrido (Recomendado para empezar)

### Fase 1 (Ahora - Primeros 3 meses):
```
Usuario llena formulario con fechas preferidas
  ↓
EmailJS envía email a info@deepxperience.cl
  ↓
Tú agregas a Google Sheets manualmente
  ↓
Respondes en 24h por email/WhatsApp
  ↓
Envías "Propuesta Personalizada" con precio
```

**Tools necesarias**: Solo EmailJS (ya lo tienes)

---

### Fase 2 (Después de 10+ reservas):
```
Usuario llena formulario
  ↓
Webhook automático a Airtable
  ↓
Sistema te envía resumen diario
  ↓
Dashboard muestra fechas más solicitadas
  ↓
Puedes habilitar/deshabilitar fechas en tiempo real
```

**Tools necesarias**: Airtable (gratis) + Zapier (gratis hasta 100/mes)

---

## 💡 ALTERNATIVAS A TESTIMONIOS (Empresa Nueva)

Como no tienes clientes previos, usa estas estrategias:

### 1. **Autoridad de las Guías**
```html
<section class="guias-certificadas">
  <h2>Guías Expertas y Certificadas</h2>

  <div class="guia-card">
    <img src="barbara.jpg" alt="Bárbara Sepúlveda">
    <h3>Bárbara Sepúlveda Arce</h3>
    <div class="certificaciones">
      <span class="badge">🤿 Divemaster PADI</span>
      <span class="badge">🌊 Especialista en Aguas Frías</span>
      <span class="badge">📚 Bióloga Marina</span>
      <span class="badge">⛰️ Guía CONAF</span>
    </div>
    <p>500+ inmersiones en Patagonia | 10 años de experiencia</p>
  </div>
</section>
```

---

### 2. **Proceso Transparente**
```html
<section class="nuestro-compromiso">
  <h2>Nuestro Compromiso Contigo</h2>

  <div class="compromiso-grid">
    <div class="compromiso-item">
      <i class="fas fa-shield-alt"></i>
      <h3>Seguridad Primero</h3>
      <p>Equipos certificados, chalecos, comunicación constante</p>
    </div>

    <div class="compromiso-item">
      <i class="fas fa-users"></i>
      <h3>Grupos Pequeños</h3>
      <p>Máximo 8 personas para atención personalizada</p>
    </div>

    <div class="compromiso-item">
      <i class="fas fa-undo"></i>
      <h3>Cancelación Flexible</h3>
      <p>60 días antes: reembolso 100% | 30 días: 50%</p>
    </div>

    <div class="compromiso-item">
      <i class="fas fa-leaf"></i>
      <h3>Turismo Sostenible</h3>
      <p>Certificados por SERNATUR, prácticas responsables</p>
    </div>
  </div>
</section>
```

---

### 3. **Pre-Launch Social Proof**
```html
<section class="pre-launch-badges">
  <h2>Respaldados Por</h2>

  <div class="badges-row">
    <img src="sernatur-logo.png" alt="Certificado SERNATUR">
    <img src="padi-logo.png" alt="Centro PADI">
    <img src="conaf-logo.png" alt="Autorizado CONAF">
  </div>

  <div class="early-adopter-cta">
    <h3>🎉 Oferta Lanzamiento</h3>
    <p>Primeros 20 viajeros reciben:</p>
    <ul>
      <li>✅ 15% de descuento</li>
      <li>✅ Sesión de fotos profesional incluida</li>
      <li>✅ Upgrade a suite (sujeto a disponibilidad)</li>
    </ul>
    <a href="#prereserva" class="btn-primary">ASEGURAR MI DESCUENTO</a>
  </div>
</section>
```

---

### 4. **Contenido de Valor (Content Marketing)**
```html
<section class="recursos-gratuitos">
  <h2>Prepara tu Aventura</h2>

  <div class="recursos-grid">
    <a href="/guia-buceo-frio.pdf" class="recurso-card">
      <i class="fas fa-file-pdf"></i>
      <h3>Guía de Buceo en Aguas Frías</h3>
      <p>10 páginas con tips de equipamiento, técnicas y qué esperar</p>
      <span class="badge-gratis">GRATIS</span>
    </a>

    <a href="/checklist-equipaje.pdf" class="recurso-card">
      <i class="fas fa-clipboard-list"></i>
      <h3>Checklist de Equipaje</h3>
      <p>Lista completa de qué llevar (ropa, medicamentos, documentos)</p>
      <span class="badge-gratis">GRATIS</span>
    </a>

    <a href="/video-fiordo-comau" class="recurso-card">
      <i class="fas fa-play-circle"></i>
      <h3>Video Tour Virtual</h3>
      <p>Recorre el Fiordo Comau antes de tu viaje (5 min)</p>
      <span class="badge-gratis">GRATIS</span>
    </a>
  </div>
</section>
```

**Beneficio**: Posicionas autoridad SIN necesitar testimonios de clientes.

---

## 🎯 ESTRATEGIA DE PRECIO SIN MOSTRAR PRECIO

### Enfoque: "Precio Personalizado"

```html
<div class="pricing-approach">
  <h2>Inversión en tu Aventura</h2>

  <p class="pricing-intro">
    Cada expedición es única. El precio final depende de:
  </p>

  <div class="pricing-factors">
    <div class="factor">
      <i class="fas fa-calendar-alt"></i>
      <strong>Temporada:</strong> Alta (Dic-Feb) o Baja (Mar-Nov)
    </div>
    <div class="factor">
      <i class="fas fa-users"></i>
      <strong>Tamaño de grupo:</strong> Solo, pareja o grupo 4+
    </div>
    <div class="factor">
      <i class="fas fa-bed"></i>
      <strong>Tipo de alojamiento:</strong> Compartido o privado
    </div>
    <div class="factor">
      <i class="fas fa-camera"></i>
      <strong>Extras opcionales:</strong> Fotos, equipo premium, etc.
    </div>
  </div>

  <div class="pricing-range">
    <p class="range-text">
      <strong>Rango estimado:</strong> Entre $2,400 - $3,800 USD por persona
    </p>
    <small>*Incluye alojamiento, comidas, inmersiones, guía y navegación</small>
  </div>

  <a href="#prereserva" class="btn-primary">
    RECIBIR COTIZACIÓN PERSONALIZADA
  </a>

  <p class="pricing-guarantee">
    💰 Sin compromisos - recibirás precio exacto antes de reservar
  </p>
</div>
```

**Estrategia**:
1. Das rango amplio → No mientes
2. Explicas factores → Educas al cliente
3. Prometes "cotización" → Lead calificado
4. "Sin compromiso" → Reduce fricción

---

## 📧 EMAIL AUTOMÁTICO POST-FORMULARIO

```
Asunto: ✅ ¡Recibimos tu solicitud para el Fiordo Comau!

Hola [Nombre],

¡Gracias por tu interés en la Expedición Fiordo Comau 2025!

📋 RESUMEN DE TU SOLICITUD:
- Fecha preferida: [Fecha1]
- Fecha alternativa: [Fecha2]
- Personas: [Número]
- Certificación: [Nivel]

⏱️ PRÓXIMOS PASOS:
1. Revisaremos disponibilidad para tus fechas (24-48h)
2. Te enviaremos cotización personalizada
3. Si todo está bien, aseguraremos tu lugar con depósito del 30%

📱 MIENTRAS TANTO:
- Descarga nuestra Guía de Preparación: [link]
- Síguenos en Instagram para ver el día a día: @deepxperiences
- Únete a nuestro grupo de WhatsApp de viajeros: [link]

¿Preguntas urgentes? Escríbenos al +56 9 5805 5597

¡Nos vemos bajo el agua!
Bárbara & Equipo DeepXperience

---
DeepXperience | Certificado SERNATUR
www.deepxperiences.cl
```

---

## 🚀 IMPLEMENTACIÓN PASO A PASO

### DÍA 1: Formulario
- [ ] Modificar `lista-espera.html` con nuevo formulario
- [ ] Agregar campos de fecha con `<input type="date">`
- [ ] Integrar con EmailJS (ya tienes configurado)
- [ ] Probar envío

### DÍA 2: Email Automatizado
- [ ] Configurar plantilla en EmailJS
- [ ] Agregar auto-respuesta al usuario
- [ ] Probar flujo completo

### DÍA 3: Secciones de Autoridad
- [ ] Agregar "Guías Certificadas" con badges
- [ ] Agregar "Nuestro Compromiso" con garantías
- [ ] Sección de "Respaldados Por" con logos

### SEMANA 2: Optimización
- [ ] Google Sheets para trackear solicitudes
- [ ] Dashboard simple de fechas más solicitadas
- [ ] Decidir pricing según data

---

## 📊 MÉTRICAS A TRACKEAR

```
FORMULARIO DE PRE-RESERVA:
- Número de solicitudes/semana
- Fechas más solicitadas (para definir temporadas)
- Presupuestos indicados (para definir pricing)
- Certificaciones (para saber si ofrecer cursos previos)
- Grupos (para optimizar ocupación embarcación)

TASA DE CONVERSIÓN:
- Formularios → Cotizaciones enviadas
- Cotizaciones → Depósitos pagados
- Depósitos → Viajes completados
```

---

## ✅ IMPLEMENTAR HOY (Acción Inmediata)

Quieres que te implemente:

1. ✅ **Formulario de pre-reserva con selector de fechas**
2. ✅ **Integración con EmailJS para auto-respuesta**
3. ✅ **Secciones de autoridad (sin testimonios)**
4. ✅ **Email template profesional**

¿Comenzamos con cuál?
