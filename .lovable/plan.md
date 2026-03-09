

## Sitio de Booking Musical B2B — Plan de Implementación

### Diseño Visual
- **Fondo:** Gris técnico `#1a1a1a`, bordes/separadores `#333333`
- **Texto:** Blanco `#FFFFFF` sobre fondo oscuro
- **Acento:** Dorado eléctrico `#FFD700` exclusivo para CTAs, links y estados activos
- **Tipografía:** Archivo Black (mayúsculas) para títulos, Roboto Mono para cuerpo/UI
- **Cuadrícula visible** con líneas de borde como parte del diseño
- **Efecto hover bandas:** Filtro duotono negro/dorado + nombre crece ligeramente
- **Touch targets mínimo 44px**, mobile-first en todo

---

### 1. HOME PAGE (`/`)

**Hero (100vh):**
- H1 en Archivo Black mayúsculas + subtítulo en Roboto Mono
- 2 CTAs dorados: "Ver Disponibilidad" (scroll a calendario) | "Explorar Catálogo" (scroll a grid)

**Grid de 10 Bandas:**
- Scroll horizontal en móvil (2.5 tarjetas visibles)
- Cada tarjeta: foto placeholder (WebP lazy-load) + género + nombre + botón → `/bandas/{slug}`
- Hover: efecto duotono negro/dorado con CSS grayscale + mix-blend-mode

**Sección Calendario:**
- Container `<div id="teamup-calendar">` preparado para iframe
- Dropdown filtro por banda (visual, listo para conectar)
- Carga diferida (defer) para no bloquear render

**Formulario de Contacto Sticky (móvil):**
- Barra fija inferior que se expande al tocar (50% pantalla)
- En desktop: columna lateral fija
- Campos: Nombre evento, Fecha, Banda (select), Teléfono, Budget (0-20k | 20-50k | 50k+)
- Hidden fields: utm_source, utm_medium, utm_campaign, page_url (capturados de URL params)
- Validación con Zod
- POST preparado para webhook Kommo (estructura JSON mapping documentada)
- Evento analytics: `lead_submit`

**Testimonios:**
- 3 testimonios placeholder con scroll horizontal en móvil
- Logos de venues placeholder

**Footer:**
- Datos de contacto + links legales

---

### 2. LANDING POR BANDA (`/bandas/:slug`)

10 bandas placeholder con datos ficticios. Cada página incluye:

- **Hero:** Foto + H1 (nombre banda en Archivo Black) + tagline de 1 frase
- **Paquetes:** Tabla comparativa 2 columnas (Básico | Premium) con precio "desde" y lista de servicios
- **2 CTAs prominentes:**
  - "Solicitar Fecha" → modal con form pre-llenado (banda seleccionada)
  - WhatsApp → `wa.me/52{PHONE}?text=Interés%20en%20{BAND}` (evento: `whatsapp_click`)
- **Reproductor:** Embed Spotify + video YouTube (placeholders con IDs de ejemplo)
- **Calendario:** Container filtrado para esa banda
- **Rider Técnico:** Link descarga PDF placeholder
- **Setlist:** Lista de 10-15 canciones ejemplo
- **Testimonios:** Específicos de esa banda (placeholder)
- **Meta OG Tags:** Título, descripción e imagen únicos por banda via React Helmet

---

### 3. Tracking de Analytics

Eventos custom (disparados via función utilitaria, listos para conectar a GA/GTM):
- `click_availability` — CTA "Ver Disponibilidad"
- `lead_submit` — envío del formulario
- `whatsapp_click` — clic en botón WhatsApp
- `band_page_view` — entrada a página de banda

---

### 4. Performance

- Imágenes con `loading="lazy"` y formato WebP placeholder
- Calendario con carga diferida (IntersectionObserver)
- Sin animaciones de transición (cortes secos entre páginas)
- Sin fondos de video ni íconos decorativos
- Componentes divididos por ruta para code splitting

---

### 5. Entregables Adicionales

- **JSON Mapping** Kommo: documento con mapeo de campos del form → campos CRM
- **Datos placeholder** de 10 bandas con slugs, géneros, precios, setlists

### No incluido (confirmado)
Blog, login, panel admin, múltiples idiomas, animaciones complejas

