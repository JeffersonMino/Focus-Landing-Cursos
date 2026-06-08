import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const PORT = Number(process.env.PORT ?? 3000);
const DATA_DIR = path.resolve(process.env.DATA_DIR ?? path.join(process.cwd(), 'data'));
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const VISITS_FILE = path.join(DATA_DIR, 'visits.json');
const VIDEO_COMPLETIONS_FILE = path.join(DATA_DIR, 'video-completions.json');
const WEBHOOK_EVENTS_FILE = path.join(DATA_DIR, 'webhook-events.json');

class PublicError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * <server-bootstrap>
 *   <purpose>API sin dependencias externas para visitas, video completado y pagos.</purpose>
 *   <security>Los montos y estados finales se validan siempre en backend.</security>
 * </server-bootstrap>
 */
await mkdir(DATA_DIR, { recursive: true });

const server = createServer(async (req, res) => {
  try {
    await route(req, res);
  } catch (error) {
    const statusCode = Number(error.statusCode ?? 500);
    sendJson(req, res, statusCode, {
      message: error.message || 'Error interno del servidor',
      details: error.details
    });
  }
});

server.listen(PORT, () => {
  console.log(`FocusComunicacion API listening on http://localhost:${PORT}`);
});

async function route(req, res) {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const method = req.method ?? 'GET';

  if (method === 'OPTIONS') {
    sendEmpty(req, res, 204);
    return;
  }

  if (method === 'GET' && (url.pathname === '/health' || url.pathname === '/api/health')) {
    sendJson(req, res, 200, { ok: true, service: 'focuscomunicacion-api' });
    return;
  }

  if (method === 'POST' && url.pathname === '/api/visits/increment') {
    await incrementVisit(req, res);
    return;
  }

  if (method === 'POST' && url.pathname === '/api/video-completions') {
    await recordVideoCompletion(req, res);
    return;
  }

  if (method === 'POST' && url.pathname === '/api/payments') {
    await createPayment(req, res);
    return;
  }

  if (method === 'GET' && url.pathname === '/api/payments/paypal/capture') {
    await capturePayPalPayment(req, res, url);
    return;
  }

  if (method === 'POST' && url.pathname === '/api/webhooks/deuna') {
    await receiveProviderWebhook(req, res, 'deuna', url);
    return;
  }

  if (method === 'POST' && url.pathname === '/api/webhooks/paypal') {
    await receiveProviderWebhook(req, res, 'paypal', url);
    return;
  }

  const statusMatch = url.pathname.match(/^\/api\/payments\/([^/]+)\/status$/);
  if (method === 'GET' && statusMatch) {
    await getPaymentStatus(req, res, decodeURIComponent(statusMatch[1]));
    return;
  }

  sendJson(req, res, 404, { message: 'Ruta no encontrada' });
}

async function createPayment(req, res) {
  const body = await readRequestJson(req);
  const provider = body.provider;
  const plan = getServerPlan();

  if (body.planId !== plan.id) {
    throw new PublicError(400, 'El plan solicitado no coincide con la configuracion del servidor.');
  }

  if (provider !== 'deuna' && provider !== 'paypal') {
    throw new PublicError(400, 'Proveedor de pago no soportado.');
  }

  const customer = sanitizeCustomer(body.customer);
  const payment = await createBasePayment(provider, customer, plan);

  if (provider === 'deuna') {
    sendJson(req, res, 200, publicPayment(await prepareDeunaPayment(payment, req)));
    return;
  }

  sendJson(req, res, 200, publicPayment(await preparePayPalPayment(payment, req)));
}

async function getPaymentStatus(req, res, paymentId) {
  const payment = await findPayment(paymentId);

  if (!payment) {
    throw new PublicError(404, 'Pago no encontrado.');
  }

  sendJson(req, res, 200, publicPayment(payment));
}

async function prepareDeunaPayment(payment, req) {
  /**
   * <deuna-provider>
   *   <manual>Usa DEUNA_STATIC_QR_IMAGE_URL o DEUNA_STATIC_DEEPLINK mientras gestionas credenciales.</manual>
   *   <direct>Usa DEUNA_API_KEY para crear payment links por API oficial/merchant.</direct>
   * </deuna-provider>
   */
  const providerMode = (process.env.DEUNA_PROVIDER ?? (process.env.DEUNA_API_KEY ? 'direct' : 'manual')).toLowerCase();

  if (providerMode === 'direct' && process.env.DEUNA_API_KEY) {
    return createDirectDeunaOrder(payment, req);
  }

  const staticQr = cleanEnv(process.env.DEUNA_STATIC_QR_IMAGE_URL);
  const staticLink = cleanEnv(process.env.DEUNA_STATIC_DEEPLINK);

  if (!staticQr && !staticLink) {
    payment.status = 'requires_configuration';
    payment.message = 'Configura DEUNA_API_KEY o DEUNA_STATIC_QR_IMAGE_URL para activar cobros DeUna.';
    payment.instructions = [
      'Solicita credenciales DeUna/Payvalida/ePag al proveedor elegido.',
      'Configura el webhook publico en /api/webhooks/deuna.',
      'Mantuvimos el checkout bloqueado para no simular un cobro real.'
    ];
    return savePayment(payment);
  }

  payment.status = 'pending';
  payment.qrImageUrl = staticQr;
  payment.checkoutUrl = staticLink;
  payment.instructions = [
    'Escanea el QR desde DeUna o abre el enlace de pago.',
    'El sistema confirmara automaticamente cuando llegue el webhook.',
    `Referencia interna: ${payment.id}`
  ];
  return savePayment(payment);
}

async function createDirectDeunaOrder(payment, req) {
  const apiBase = trimTrailingSlash(process.env.DEUNA_API_BASE_URL ?? deunaDefaultBaseUrl());
  const amountMinor = toMinorUnits(payment.amount);
  const orderId = payment.id;
  const callbackBase = apiPublicBase(req);
  const frontendBase = frontendBaseUrl();

  const payload = {
    order_type: 'PAYMENT_LINK',
    payer_info: {
      email: payment.customer.email
    },
    order: {
      order_id: orderId,
      store_code: process.env.DEUNA_STORE_CODE ?? 'all',
      currency: payment.currency,
      tax_amount: 0,
      total_tax_amount: 0,
      shipping_amount: 0,
      items_total_amount: amountMinor,
      sub_total: amountMinor,
      total_amount: amountMinor,
      redirect_urls: {
        success: `${frontendBase}/?payment=success&payment_id=${encodeURIComponent(orderId)}`,
        pending: `${frontendBase}/?payment=pending&payment_id=${encodeURIComponent(orderId)}`,
        error: `${frontendBase}/?payment=error&payment_id=${encodeURIComponent(orderId)}`,
        close: `${frontendBase}/?payment=closed&payment_id=${encodeURIComponent(orderId)}`
      },
      webhook_urls: {
        order: `${callbackBase}/api/webhooks/deuna`
      },
      items: [
        {
          id: payment.planId,
          name: payment.description,
          description: payment.description,
          quantity: 1,
          unit_price: {
            amount: amountMinor,
            currency: payment.currency,
            currency_symbol: '$'
          },
          total_amount: {
            amount: amountMinor,
            original_amount: amountMinor,
            total_discount: 0,
            currency: payment.currency,
            currency_symbol: '$'
          },
          taxable: false
        }
      ]
    }
  };

  const response = await fetch(`${apiBase}/merchants/orders`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.DEUNA_API_KEY,
      'x-idempotency-key': payment.id
    },
    body: JSON.stringify(payload)
  });

  const data = await safeProviderJson(response);

  if (!response.ok) {
    payment.status = 'failed';
    payment.message = 'DeUna rechazo la creacion del pago. Revisa credenciales y merchant.';
    payment.providerResponse = data;
    await savePayment(payment);
    throw new PublicError(502, payment.message, data);
  }

  payment.status = 'pending';
  payment.externalId = data.token ?? data.order?.token ?? data.order?.order_id ?? payment.id;
  payment.checkoutUrl = extractFirstString(data, ['payment_link', 'checkout_url', 'redirect_url'])
    ?? extractFirstString(data.order ?? {}, ['payment_link', 'checkout_url', 'redirect_url']);
  payment.qrImageUrl = extractFirstString(data, ['qr', 'qr_url', 'qrImageUrl', 'qr_image_url'])
    ?? extractFirstString(data.order ?? {}, ['qr', 'qr_url', 'qrImageUrl', 'qr_image_url']);
  payment.instructions = [
    'Escanea el QR DeUna o abre el enlace de pago generado.',
    'No cierres esta pagina hasta que el estado cambie a confirmado.',
    `Referencia interna: ${payment.id}`
  ];
  payment.providerResponse = data;
  return savePayment(payment);
}

async function preparePayPalPayment(payment, req) {
  /**
   * <paypal-provider>
   *   <purpose>Crea orden PayPal server-side para aceptar tarjeta, debito o PayPal.</purpose>
   *   <security>CLIENT_SECRET nunca se expone a Angular.</security>
   * </paypal-provider>
   */
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    payment.status = 'requires_configuration';
    payment.message = 'Configura PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET para activar tarjeta global.';
    payment.instructions = [
      'Crea una app PayPal REST en modo sandbox o live.',
      'Configura API_PUBLIC_BASE_URL con una URL publica para capturar el retorno.',
      'Cuando las credenciales existan, este boton abrira PayPal en una nueva pestana.'
    ];
    return savePayment(payment);
  }

  const token = await getPayPalAccessToken();
  const apiBase = paypalApiBase();
  const returnUrl = `${apiPublicBase(req)}/api/payments/paypal/capture?paymentId=${encodeURIComponent(payment.id)}`;
  const cancelUrl = `${frontendBaseUrl()}/?payment=cancelled&payment_id=${encodeURIComponent(payment.id)}`;

  const response = await fetch(`${apiBase}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'paypal-request-id': payment.id
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: payment.id,
          custom_id: payment.id,
          description: payment.description,
          amount: {
            currency_code: payment.currency,
            value: payment.amount.toFixed(2)
          }
        }
      ],
      application_context: {
        brand_name: process.env.PAYPAL_BRAND_NAME ?? 'DaleReset',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl
      }
    })
  });

  const data = await safeProviderJson(response);

  if (!response.ok) {
    payment.status = 'failed';
    payment.message = 'PayPal rechazo la creacion de la orden. Revisa credenciales y modo sandbox/live.';
    payment.providerResponse = data;
    await savePayment(payment);
    throw new PublicError(502, payment.message, data);
  }

  const approvalLink = Array.isArray(data.links)
    ? data.links.find((link) => link.rel === 'approve')?.href
    : undefined;

  if (!approvalLink) {
    payment.status = 'failed';
    payment.message = 'PayPal no devolvio enlace de aprobacion.';
    payment.providerResponse = data;
    await savePayment(payment);
    throw new PublicError(502, payment.message, data);
  }

  payment.status = 'pending';
  payment.externalId = data.id;
  payment.checkoutUrl = approvalLink;
  payment.instructions = [
    'Se abrira PayPal en una nueva pestana.',
    'Puedes pagar con tarjeta o cuenta PayPal segun disponibilidad del comprador.',
    `Referencia interna: ${payment.id}`
  ];
  payment.providerResponse = data;
  return savePayment(payment);
}

async function capturePayPalPayment(req, res, url) {
  const paymentId = url.searchParams.get('paymentId');
  const orderToken = url.searchParams.get('token');

  if (!paymentId) {
    redirect(res, `${frontendBaseUrl()}/?payment=error`);
    return;
  }

  const payment = await findPayment(paymentId);

  if (!payment || payment.provider !== 'paypal') {
    redirect(res, `${frontendBaseUrl()}/?payment=not_found&payment_id=${encodeURIComponent(paymentId)}`);
    return;
  }

  try {
    const token = await getPayPalAccessToken();
    const orderId = payment.externalId ?? orderToken;
    const response = await fetch(`${paypalApiBase()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        'paypal-request-id': `${payment.id}-capture`
      }
    });

    const data = await safeProviderJson(response);
    payment.providerCaptureResponse = data;
    payment.updatedAt = new Date().toISOString();

    if (response.ok && data.status === 'COMPLETED') {
      payment.status = 'paid';
      payment.paidAt = new Date().toISOString();
      payment.message = 'Pago confirmado por PayPal.';
      await savePayment(payment);
      redirect(res, `${frontendBaseUrl()}/?payment=success&payment_id=${encodeURIComponent(payment.id)}`);
      return;
    }

    payment.status = mapProviderStatus(data.status);
    payment.message = 'PayPal no confirmo el pago como completado.';
    await savePayment(payment);
    redirect(res, `${frontendBaseUrl()}/?payment=${encodeURIComponent(payment.status)}&payment_id=${encodeURIComponent(payment.id)}`);
  } catch (error) {
    payment.status = 'failed';
    payment.message = 'No se pudo capturar la orden PayPal.';
    payment.error = error.message;
    await savePayment(payment);
    redirect(res, `${frontendBaseUrl()}/?payment=error&payment_id=${encodeURIComponent(payment.id)}`);
  }
}

async function receiveProviderWebhook(req, res, provider, url) {
  if (provider === 'deuna') {
    verifyWebhookSecret(req, url, process.env.DEUNA_WEBHOOK_SECRET);
  }

  if (provider === 'paypal') {
    verifyWebhookSecret(req, url, process.env.PAYPAL_WEBHOOK_SECRET);
  }

  const body = await readRequestJson(req);
  const externalId = pickPaymentReference(body);
  const status = mapProviderStatus(pickStatus(body));
  const payment = externalId ? await findPaymentByAnyReference(externalId) : null;

  await recordWebhookEvent({ provider, matchedPaymentId: payment?.id ?? null, receivedAt: new Date().toISOString(), body });

  if (!payment) {
    sendJson(req, res, 202, { ok: true, matched: false });
    return;
  }

  payment.status = status;
  payment.updatedAt = new Date().toISOString();
  payment.lastWebhook = body;

  if (status === 'paid') {
    payment.paidAt = payment.paidAt ?? new Date().toISOString();
    payment.message = `Pago confirmado por ${provider}.`;
  }

  await savePayment(payment);
  sendJson(req, res, 200, { ok: true, matched: true, paymentId: payment.id, status: payment.status });
}

async function incrementVisit(req, res) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const store = await readJson(VISITS_FILE, { total: 0, byDay: {}, lastVisitIso: null });

  store.total = Number(store.total ?? 0) + 1;
  store.byDay = store.byDay ?? {};
  store.byDay[today] = Number(store.byDay[today] ?? 0) + 1;
  store.lastVisitIso = now.toISOString();
  store.lastIpHash = hashValue(clientIp(req));

  await writeJson(VISITS_FILE, store);
  sendJson(req, res, 200, {
    total: store.total,
    uniqueToday: store.byDay[today],
    lastVisitIso: store.lastVisitIso
  });
}

async function recordVideoCompletion(req, res) {
  const body = await readRequestJson(req);
  const store = await readJson(VIDEO_COMPLETIONS_FILE, { completions: [] });

  store.completions.push({
    gateId: String(body.gateId ?? ''),
    completedAt: String(body.completedAt ?? new Date().toISOString()),
    receivedAt: new Date().toISOString(),
    ipHash: hashValue(clientIp(req))
  });

  await writeJson(VIDEO_COMPLETIONS_FILE, store);
  sendJson(req, res, 200, { ok: true });
}

async function createBasePayment(provider, customer, plan) {
  const now = new Date().toISOString();
  const payment = {
    id: `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    provider,
    status: 'pending',
    planId: plan.id,
    description: plan.description,
    amount: plan.amount,
    currency: plan.currency,
    customer,
    instructions: [],
    createdAt: now,
    updatedAt: now
  };

  return savePayment(payment);
}

function sanitizeCustomer(rawCustomer) {
  const raw = rawCustomer && typeof rawCustomer === 'object' ? rawCustomer : {};
  const name = String(raw.name ?? '').trim();
  const email = String(raw.email ?? '').trim().toLowerCase();
  const phone = String(raw.phone ?? '').trim();

  if (name.length < 2) {
    throw new PublicError(400, 'Nombre invalido para generar el pago.');
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new PublicError(400, 'Email invalido para generar el pago.');
  }

  return { name, email, phone };
}

function getServerPlan() {
  const amount = Number(process.env.COURSE_PRICE_USD ?? 97);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new PublicError(500, 'COURSE_PRICE_USD debe ser un numero mayor a cero.');
  }

  return {
    id: process.env.COURSE_PLAN_ID ?? 'dale-reset-taller-redes',
    description: process.env.COURSE_DESCRIPTION ?? 'Taller Dale Reset - Sistema de ventas para redes sociales',
    amount,
    currency: 'USD'
  };
}

function publicPayment(payment) {
  return {
    id: payment.id,
    provider: payment.provider,
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
    checkoutUrl: payment.checkoutUrl,
    qrImageUrl: payment.qrImageUrl,
    instructions: payment.instructions ?? [],
    message: payment.message,
    paidAt: payment.paidAt
  };
}

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !secret) {
    throw new PublicError(500, 'Credenciales PayPal incompletas.');
  }

  const response = await fetch(`${paypalApiBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await safeProviderJson(response);

  if (!response.ok || !data.access_token) {
    throw new PublicError(502, 'No se pudo autenticar con PayPal.', data);
  }

  return data.access_token;
}

function paypalApiBase() {
  return (process.env.PAYPAL_MODE ?? 'sandbox').toLowerCase() === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

function deunaDefaultBaseUrl() {
  return (process.env.DEUNA_MODE ?? 'sandbox').toLowerCase() === 'live'
    ? 'https://api.deuna.io'
    : 'https://api.sandbox.deuna.io';
}

function apiPublicBase(req) {
  if (process.env.API_PUBLIC_BASE_URL) {
    return trimTrailingSlash(process.env.API_PUBLIC_BASE_URL);
  }

  const proto = firstHeader(req.headers['x-forwarded-proto']) ?? 'http';
  const host = firstHeader(req.headers['x-forwarded-host']) ?? req.headers.host ?? `localhost:${PORT}`;
  return `${proto}://${host}`;
}

function frontendBaseUrl() {
  return trimTrailingSlash(process.env.FRONTEND_SUCCESS_URL ?? process.env.PUBLIC_BASE_URL ?? 'http://localhost:4200');
}

function mapProviderStatus(rawStatus) {
  const value = String(rawStatus ?? '').toLowerCase();

  if (['paid', 'approved', 'approval', 'completed', 'complete', 'success', 'succeeded', 'captured'].includes(value)) {
    return 'paid';
  }

  if (['cancelled', 'canceled', 'voided'].includes(value)) {
    return 'cancelled';
  }

  if (['failed', 'rejected', 'declined', 'error', 'denied'].includes(value)) {
    return 'failed';
  }

  return 'pending';
}

function pickPaymentReference(body) {
  return firstString([
    body.paymentId,
    body.payment_id,
    body.order_id,
    body.reference,
    body.externalId,
    body.external_id,
    body.resource?.custom_id,
    body.resource?.purchase_units?.[0]?.reference_id,
    body.resource?.purchase_units?.[0]?.custom_id,
    body.order?.order_id,
    body.order?.token,
    body.token,
    body.id
  ]);
}

function pickStatus(body) {
  return firstString([
    body.status,
    body.state,
    body.event_type,
    body.resource?.status,
    body.order?.status,
    body.transaction?.status,
    body.data?.status
  ]);
}

async function findPayment(id) {
  const store = await readPaymentsStore();
  return store.payments.find((payment) => payment.id === id) ?? null;
}

async function findPaymentByAnyReference(reference) {
  const store = await readPaymentsStore();
  return store.payments.find((payment) => {
    return payment.id === reference || payment.externalId === reference || payment.providerResponse?.id === reference;
  }) ?? null;
}

async function savePayment(payment) {
  const store = await readPaymentsStore();
  const index = store.payments.findIndex((item) => item.id === payment.id);
  payment.updatedAt = new Date().toISOString();

  if (index >= 0) {
    store.payments[index] = payment;
  } else {
    store.payments.push(payment);
  }

  await writeJson(PAYMENTS_FILE, store);
  return payment;
}

async function readPaymentsStore() {
  const store = await readJson(PAYMENTS_FILE, { payments: [] });
  store.payments = Array.isArray(store.payments) ? store.payments : [];
  return store;
}

async function recordWebhookEvent(event) {
  const store = await readJson(WEBHOOK_EVENTS_FILE, { events: [] });
  store.events.push(event);
  await writeJson(WEBHOOK_EVENTS_FILE, store);
}

async function readRequestJson(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;

    if (size > 1024 * 1024) {
      throw new PublicError(413, 'Payload demasiado grande.');
    }

    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new PublicError(400, 'JSON invalido.');
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return structuredClone(fallback);
    }

    throw error;
  }
}

async function writeJson(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function safeProviderJson(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function verifyWebhookSecret(req, url, expectedSecret) {
  if (!expectedSecret) {
    return;
  }

  const provided = req.headers['x-webhook-secret'] ?? req.headers['x-signature-secret'] ?? url.searchParams.get('secret');

  if (provided !== expectedSecret) {
    throw new PublicError(401, 'Webhook no autorizado.');
  }
}

function sendJson(req, res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    ...corsHeaders(req),
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(body);
}

function sendEmpty(req, res, statusCode) {
  res.writeHead(statusCode, corsHeaders(req));
  res.end();
}

function redirect(res, location) {
  res.writeHead(302, { location });
  res.end();
}

function corsHeaders(req) {
  const configured = process.env.CORS_ORIGIN ?? '*';
  const requestOrigin = req.headers.origin;
  const allowedOrigins = configured.split(',').map((origin) => origin.trim()).filter(Boolean);
  const origin = configured === '*' || !requestOrigin
    ? configured
    : allowedOrigins.includes(requestOrigin)
      ? requestOrigin
      : allowedOrigins[0] ?? configured;

  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,x-webhook-secret,x-signature-secret',
    vary: 'Origin'
  };
}

function extractFirstString(source, keys) {
  for (const key of keys) {
    const value = source?.[key];

    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function firstString(values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function firstHeader(value) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === 'string' ? value.split(',')[0].trim() : null;
}

function cleanEnv(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function trimTrailingSlash(value) {
  return value.replace(/\/$/, '');
}

function toMinorUnits(amount) {
  return Math.round(Number(amount) * 100);
}

function clientIp(req) {
  return firstHeader(req.headers['x-forwarded-for']) ?? req.socket.remoteAddress ?? 'unknown';
}

function hashValue(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}
