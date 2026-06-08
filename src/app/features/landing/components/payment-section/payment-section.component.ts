import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { PaymentProvider } from '@core/models/landing.model';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import {
  PaymentCreateResponse,
  PaymentService,
  PaymentStatus,
  PaymentStatusResponse
} from '@core/services/payment.service';

@Component({
  selector: 'focus-payment-section',
  standalone: true,
  imports: [ReactiveFormsModule, RevealOnScrollDirective],
  template: `
    <section id="pagos" class="focus-band bg-[linear-gradient(180deg,#070006,#1f0711_52%,#070006)]">
      <div class="focus-container">
        <!-- <payment-header>
          <purpose>Mensaje principal del checkout desbloqueado tras completar el video obligatorio.</purpose>
        </payment-header> -->
        <div class="mx-auto max-w-3xl text-center focus-reveal" focusReveal>
          <p class="focus-eyebrow justify-center">{{ config.eyebrow }}</p>
          <h2 class="focus-heading mt-4">{{ config.title }}</h2>
          <p class="focus-copy mt-5">{{ config.description }}</p>
        </div>

        <div class="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <!-- <payment-plan>
            <purpose>Resumen del producto. El precio mostrado viene de landing.config.ts.</purpose>
          </payment-plan> -->
          <aside class="focus-panel p-5 sm:p-7 focus-reveal" focusReveal>
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-focus-orange">{{ config.plan.name }}</p>
            <h3 class="mt-4 text-3xl font-black tracking-normal text-white sm:text-4xl">{{ formattedPrice() }}</h3>
            <p class="mt-4 text-sm leading-7 text-white/68">{{ config.plan.description }}</p>

            <div class="mt-7 space-y-3">
              @for (item of config.plan.included; track item) {
                <div class="flex items-start gap-3 rounded-[8px] border border-white/10 bg-black/28 p-3">
                  <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[6px] bg-focus-orange text-xs font-black text-white">OK</span>
                  <p class="text-sm leading-6 text-white/76">{{ item }}</p>
                </div>
              }
            </div>
          </aside>

          <!-- <payment-checkout>
            <purpose>Formulario y acciones de pago. Solo crea intenciones; el backend confirma estado real.</purpose>
          </payment-checkout> -->
          <form class="focus-panel p-5 sm:p-7 focus-reveal" focusReveal [formGroup]="form" (ngSubmit)="submitPayment()">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block">
                <span class="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/55">Nombre</span>
                <input class="focus-input" type="text" formControlName="name" autocomplete="name" placeholder="Tu nombre" [attr.aria-invalid]="fieldInvalid('name')">
              </label>

              <label class="block">
                <span class="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/55">Email</span>
                <input class="focus-input" type="email" formControlName="email" autocomplete="email" placeholder="correo@dominio.com" [attr.aria-invalid]="fieldInvalid('email')">
              </label>

              <label class="block sm:col-span-2">
                <span class="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/55">WhatsApp</span>
                <input class="focus-input" type="tel" formControlName="phone" autocomplete="tel" placeholder="+593...">
              </label>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              @for (method of config.methods; track method.provider) {
                <button
                  type="button"
                  [class]="methodButtonClass(method.provider)"
                  [attr.aria-pressed]="selectedProvider() === method.provider"
                  (click)="selectProvider(method.provider)"
                >
                  <span class="flex items-center justify-between gap-3">
                    <span class="text-sm font-black uppercase tracking-[0.14em]">{{ method.title }}</span>
                    <span class="rounded-[6px] border border-white/20 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em]">{{ method.badge }}</span>
                  </span>
                  <span class="mt-3 block text-sm leading-6 text-white/70">{{ method.description }}</span>
                </button>
              }
            </div>

            @if (error()) {
              <p class="mt-5 rounded-[8px] border border-red-400/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">{{ error() }}</p>
            }

            <button type="submit" class="focus-button focus-button-primary mt-6 w-full" [disabled]="loading()">
              @if (loading()) {
                Procesando...
              } @else {
                {{ selectedMethod().cta }}
              }
            </button>

            @if (checkout(); as payment) {
              <!-- <payment-result>
                <purpose>Estado devuelto por el backend. El boton abre siempre una pestana nueva.</purpose>
              </payment-result> -->
              <div class="mt-6 rounded-[8px] border border-white/12 bg-black/36 p-4">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-[0.18em] text-focus-orange">Estado del pago</p>
                    <p class="mt-2 text-lg font-black text-white">{{ statusLabel(payment.status) }}</p>
                  </div>
                  <button type="button" class="focus-button focus-button-secondary" (click)="refreshStatus()" [disabled]="checkingStatus()">
                    @if (checkingStatus()) { Verificando... } @else { Verificar pago }
                  </button>
                </div>

                @if (payment.message) {
                  <p class="mt-4 text-sm leading-6 text-white/68">{{ payment.message }}</p>
                }

                @if (payment.qrImageUrl) {
                  <div class="mt-5 grid gap-4 sm:grid-cols-[180px_1fr] sm:items-center">
                    <img class="mx-auto aspect-square w-44 rounded-[8px] border border-white/12 bg-white p-3" [src]="payment.qrImageUrl" alt="QR DeUna para pagar el taller" loading="lazy" decoding="async">
                    <div class="space-y-2 text-sm leading-6 text-white/70">
                      @for (instruction of payment.instructions; track instruction) {
                        <p>{{ instruction }}</p>
                      }
                    </div>
                  </div>
                } @else {
                  <div class="mt-4 space-y-2 text-sm leading-6 text-white/70">
                    @for (instruction of payment.instructions; track instruction) {
                      <p>{{ instruction }}</p>
                    }
                  </div>
                }

                @if (payment.checkoutUrl) {
                  <a class="focus-button focus-button-secondary mt-5 w-full" [href]="payment.checkoutUrl" target="_blank" rel="noopener noreferrer">
                    Abrir pago en nueva pestana
                  </a>
                }
              </div>
            }
          </form>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentSectionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly paymentService = inject(PaymentService);
  private readonly destroyRef = inject(DestroyRef);

  readonly config = LANDING_CONFIG.payments;
  readonly loading = signal(false);
  readonly checkingStatus = signal(false);
  readonly error = signal<string | null>(null);
  readonly checkout = signal<PaymentCreateResponse | null>(null);
  readonly selectedProvider = signal<PaymentProvider>('deuna');
  readonly selectedMethod = computed(() => {
    const method = this.config.methods.find((item) => item.provider === this.selectedProvider());
    return method ?? this.config.methods[0]!;
  });

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['']
  });

  private pollingId: number | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => this.stopPolling());
  }

  formattedPrice(): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: this.config.plan.currency
    }).format(this.config.plan.amount);
  }

  selectProvider(provider: PaymentProvider): void {
    this.selectedProvider.set(provider);
    this.error.set(null);
  }

  methodButtonClass(provider: PaymentProvider): string {
    const base = 'rounded-[8px] border p-4 text-left transition duration-300 hover:-translate-y-0.5';
    return this.selectedProvider() === provider
      ? `${base} border-focus-orange bg-focus-orange text-white`
      : `${base} border-white/12 bg-black/30 text-white`;
  }

  fieldInvalid(field: 'name' | 'email'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  async submitPayment(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.error.set('Completa nombre y email para generar el pago.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await this.paymentService.createPayment({
        provider: this.selectedProvider(),
        planId: this.config.plan.id,
        customer: this.form.getRawValue()
      });

      this.checkout.set(response);
      this.startPolling(response.id);

      if (response.provider === 'paypal' && response.checkoutUrl) {
        window.open(response.checkoutUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      this.error.set(this.errorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  async refreshStatus(): Promise<void> {
    const current = this.checkout();

    if (!current) {
      return;
    }

    this.checkingStatus.set(true);
    this.error.set(null);

    try {
      this.mergeStatus(await this.paymentService.getStatus(current.id));
    } catch (error) {
      this.error.set(this.errorMessage(error));
    } finally {
      this.checkingStatus.set(false);
    }
  }

  statusLabel(status: PaymentStatus): string {
    const labels: Record<PaymentStatus, string> = {
      pending: 'Pendiente de confirmacion',
      paid: 'Pago confirmado',
      failed: 'Pago fallido',
      cancelled: 'Pago cancelado',
      requires_configuration: 'Requiere configuracion'
    };

    return labels[status];
  }

  private startPolling(paymentId: string): void {
    this.stopPolling();

    this.pollingId = window.setInterval(() => {
      void this.pollStatus(paymentId);
    }, this.config.pollIntervalMs);
  }

  private stopPolling(): void {
    if (this.pollingId === undefined) {
      return;
    }

    window.clearInterval(this.pollingId);
    this.pollingId = undefined;
  }

  private async pollStatus(paymentId: string): Promise<void> {
    const current = this.checkout();

    if (!current || current.id !== paymentId || this.isTerminalStatus(current.status)) {
      this.stopPolling();
      return;
    }

    try {
      this.mergeStatus(await this.paymentService.getStatus(paymentId));
    } catch {
      // <polling-error>La consulta silenciosa falla sin ensuciar la UI; el usuario conserva el boton manual.</polling-error>
    }
  }

  private mergeStatus(status: PaymentStatusResponse): void {
    this.checkout.update((current) => {
      if (!current || current.id !== status.id) {
        return current;
      }

      return {
        ...current,
        status: status.status,
        message: status.message ?? current.message,
        paidAt: status.paidAt ?? current.paidAt
      };
    });

    if (this.isTerminalStatus(status.status)) {
      this.stopPolling();
    }
  }

  private isTerminalStatus(status: PaymentStatus): boolean {
    return status === 'paid' || status === 'failed' || status === 'cancelled' || status === 'requires_configuration';
  }

  private errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const message = typeof error.error?.message === 'string' ? error.error.message : error.message;
      return message || 'No se pudo iniciar el pago. Revisa la configuracion del servidor.';
    }

    return 'No se pudo iniciar el pago. Intenta nuevamente.';
  }
}


