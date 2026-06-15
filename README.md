# FocusComunicacion Landing

Landing page cinematografica para vender una masterclass, curso o evento audiovisual con navegacion controlada por video obligatorio de YouTube.

## Stack

- Angular 19 standalone architecture
- TypeScript strict mode
- Angular Signals
- Angular Router
- TailwindCSS
- YouTube Iframe API
- API opcional Node/Express para visitas y completados de video
- Docker, Docker Compose y Nginx para produccion

## Ejecutar local

```bash
npm install
npm run dev
```

Frontend: `http://localhost:4200`  
API: `http://localhost:3000/health`

Con Docker:

```bash
docker compose up --build
```

## Build de produccion

```bash
npm run build:prod
```

## Publicar en GitHub Pages

Este proyecto se publica bajo el subdirectorio del repositorio:

```text
https://jeffersonmino.github.io/Focus-Landing-Cursos/
```

Usa estos scripts para que Angular genere el `base href` correcto y las imagenes locales se resuelvan como `assets/...` dentro del repositorio:

```bash
npm run build:ghpages
npm run deploy:ghpages
```

No cambies las imagenes locales a rutas con `/assets/...`; en GitHub Pages eso apunta al dominio raiz y rompe las imagenes. Usa siempre rutas relativas como:

```ts
src: 'assets/images/taller1/f1.jpeg'
```

Preview productivo con Nginx:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Abre `http://localhost:8080`.

## Estructura

```text
src/app
  core
    config/landing.config.ts       Configuracion editable del funnel
    guards/video-unlock.guard.ts   Bloqueo de ruta /registro
    models/landing.model.ts        Contratos tipados
    services                       SEO, YouTube, video gate, visitas
  shared
    components/video-gate          Reproductor obligatorio anti-skip
    components/whatsapp-button     Boton flotante WhatsApp
    directives/reveal-on-scroll    Animaciones performantes
  features/landing
    landing-page.component.ts      Orquestador del funnel
    components/*                   Secciones independientes
server
  index.mjs                        API simple persistente
nginx
  default.conf                     SPA, cache, gzip, reverse proxy API
```

## Configuracion principal

Edita `src/app/core/config/landing.config.ts`.

Flags para ocultar secciones sin borrar codigo:

```ts
sections: {
  showTestimonials: true,
  showFAQ: true,
  showPortfolio: true,
  showRegistration: true
}
```

Video obligatorio:

```ts
videoGate: {
  id: 'masterclass-focus',
  youtubeId: '4FWolsHk0cs',
  requiredPercentage: 100,
  minWatchSecondsBeforeUnlock: 30
}
```

WhatsApp:

```ts
whatsapp: {
  groupUrl: 'https://chat.whatsapp.com/XXXXXXXX',
  message: 'Hola, quiero mas informacion sobre el curso de FocusComunicacion'
}
```

Nota: WhatsApp no garantiza texto prellenado en todos los enlaces de invitacion a grupos. El proyecto agrega `?text=...`; para prellenado 100% confiable usa un enlace `https://wa.me/<numero>?text=...` como fallback comercial.

## Sistema anti-skip

El componente `focus-video-gate`:

- Carga YouTube Iframe API.
- Desactiva controles y teclado del reproductor.
- Mide tiempo reproducido en intervalos.
- Guarda el mayor segundo visto.
- Detecta saltos superiores al margen permitido y devuelve al usuario al punto valido.
- Mantiene bloqueados formularios, botones, WhatsApp y secciones de conversion hasta completar el video.
- Persiste desbloqueo en `localStorage`.
- Reporta completados a `/api/video-completions` en produccion.

Importante: ningun bloqueo exclusivamente frontend debe proteger pagos, certificados o contenido sensible. Para escenarios monetizados, valida el completado en backend con sesion, usuario y firma temporal.

## Contador de visitas

Modo local:

```ts
visitCounter: {
  provider: 'localStorage'
}
```

Modo API:

```ts
visitCounter: {
  provider: 'api',
  apiPath: '/visits'
}
```

En `environment.prod.ts`, `useApiVisitCounter` esta activado y usa `/api`.

## UX/UI

Propuesta visual:

- Primera vista inmersiva con imagen cinematografica, alto contraste y CTAs bloqueados.
- Trailer como punto de decision y filtro.
- Contenido posterior con reveal progresivo, portafolio visual, prueba social y CTA.
- Registro minimalista y directo, sin friccion extra.

Paleta:

- Vino oscuro: `#070006`, `#120008`
- Grafito borgona: `#1f0711`
- Crema: `#f2e8d8`
- Magenta Dale Reset: `#d12d5b`
- Acento muted rose: `#c9a9a2`

Mockup de flujo:

```text
[Hero cinematografico]
  Logo + CTA Trailer + CTA WhatsApp bloqueado
  H1 directo + beneficios rapidos + contador

[Trailer obligatorio]
  YouTube embed + progreso + anti-skip + estado LOCK/OK

[Contenido bloqueado/desbloqueado]
  Sobre el curso -> Beneficios -> Portfolio -> Testimonios -> CTA -> FAQ -> Registro

[Footer]
  Marca + estadisticas basicas
```

Sugerencias de imagenes:

- Hero: camara cine, lente prime, set oscuro con luz lateral.
- Portfolio: frame de rodaje, backstage con monitor, evento con luces, producto en close-up.
- Registro: evitar imagen adicional; el formulario debe sentirse rapido y premium.

Sugerencias de videos hero/trailer:

- Trailer de 60 a 180 segundos con hook en primeros 8 segundos.
- Bloque 1: problema del creador audiovisual.
- Bloque 2: metodo FocusComunicacion.
- Bloque 3: resultados y prueba visual.
- Bloque 4: invitacion a registro/WhatsApp.

## Accesibilidad y performance

- Contraste alto.
- Estados `disabled` y `aria-disabled`.
- Focus visible.
- Lazy loading en imagenes secundarias.
- Preconnect a YouTube e imagenes.
- Animaciones por IntersectionObserver.
- Respeta `prefers-reduced-motion`.
- Nginx con gzip y cache de assets.

## Despliegue VPS Ubuntu

1. Instala Docker y Docker Compose.
2. Copia el proyecto a `/opt/focuscomunicacion-landing`.
3. Configura dominio y variables de entorno.
4. Ejecuta:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

5. Reverse proxy recomendado:

```nginx
server {
  server_name focuscomunicacion.com www.focuscomunicacion.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

6. SSL:

```bash
sudo certbot --nginx -d focuscomunicacion.com -d www.focuscomunicacion.com
```

## Futuras mejoras enterprise

- SSR/hydration con Angular Universal cuando se defina hosting final.
- Backend con base de datos real para leads y eventos de video.
- Integracion CRM: HubSpot, Airtable, Notion, Google Sheets o webhook.
- Validacion server-side de completado por usuario.
- A/B testing de hero, trailer y CTAs.
- Medicion con GA4, Meta Pixel y server-side events.

## Pagos DeUna y tarjeta global

El checkout vive dentro del contenido bloqueado por video. El usuario solo puede iniciar pagos cuando `VideoGateService` marca el video como completado.

Arquitectura:

```text
Angular PaymentSection
  -> POST /api/payments
  -> Backend crea intento DeUna o PayPal
  -> Usuario paga en QR/deeplink o PayPal
  -> Webhook/captura confirma estado
  -> Angular consulta GET /api/payments/:id/status
```

### Variables principales

```env
COURSE_PLAN_ID=dale-reset-taller-redes
COURSE_PRICE_USD=97
COURSE_DESCRIPTION=Taller Dale Reset - Sistema de ventas para redes sociales
PUBLIC_BASE_URL=https://focuscomunicacion.com
FRONTEND_SUCCESS_URL=https://focuscomunicacion.com
API_PUBLIC_BASE_URL=https://focuscomunicacion.com
```

### DeUna QR Ecuador

Modo temporal con QR o enlace fijo:

```env
DEUNA_PROVIDER=manual
DEUNA_STATIC_QR_IMAGE_URL=https://tu-dominio.com/qr-deuna.png
DEUNA_STATIC_DEEPLINK=https://link-de-pago-deuna
DEUNA_WEBHOOK_SECRET=un-secreto-largo
```

Modo API directo:

```env
DEUNA_PROVIDER=direct
DEUNA_MODE=live
DEUNA_API_BASE_URL=https://api.deuna.io
DEUNA_API_KEY=tu-api-key
DEUNA_STORE_CODE=all
DEUNA_WEBHOOK_SECRET=un-secreto-largo
```

Webhook que debes configurar en el proveedor:

```text
POST https://focuscomunicacion.com/api/webhooks/deuna
Header: x-webhook-secret: un-secreto-largo
```

El backend acepta referencias como `paymentId`, `payment_id`, `order_id`, `reference`, `token` o datos dentro de `resource/order`. Si el proveedor envia otra forma de payload, ajusta `pickPaymentReference()` en `server/index.mjs`.

### PayPal Checkout para tarjetas globales

```env
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=tu-client-id
PAYPAL_CLIENT_SECRET=tu-client-secret
PAYPAL_BRAND_NAME=DaleReset
```

En sandbox/local, PayPal necesita volver a una URL publica. Usa `API_PUBLIC_BASE_URL` con ngrok, Cloudflare Tunnel o el dominio real.

```env
PAYPAL_MODE=sandbox
API_PUBLIC_BASE_URL=https://tu-tunnel.ngrok-free.app
FRONTEND_SUCCESS_URL=http://localhost:4200
```

### Seguridad

- Angular nunca envia el precio final; solo envia `planId`, proveedor y datos del comprador.
- El backend valida `COURSE_PLAN_ID` y `COURSE_PRICE_USD`.
- Los secretos DeUna/PayPal solo existen en servidor.
- La confirmacion real depende de webhook/captura, no de que el usuario haga clic en un boton.
- Para produccion con alto volumen, reemplaza JSON por PostgreSQL, MySQL, Supabase o DynamoDB.
