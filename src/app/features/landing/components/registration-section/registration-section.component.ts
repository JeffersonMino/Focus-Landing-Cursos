import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { VideoGateService } from '@core/services/video-gate.service';
import { inject } from '@angular/core';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'focus-registration-section',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RevealOnScrollDirective],
  template: `
    <section id="registro" class="focus-band bg-black">
      <div class="focus-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div focusReveal>
          <p class="focus-eyebrow">Registro</p>
          <h1 class="mt-4 focus-heading">{{ embedded() ? 'Reserva tu cupo.' : 'Registro desbloqueado.' }}</h1>
          <p class="mt-5 focus-copy">
            Completa tus datos y entra al grupo para recibir fechas, temario y condiciones de acceso.
          </p>

          @if (!unlocked()) {
            <a class="focus-button focus-button-primary mt-7" routerLink="/" fragment="trailer">Ver video obligatorio</a>
          }
        </div>

        <form class="focus-panel p-6 sm:p-8" [formGroup]="form" (ngSubmit)="submit()" focusReveal>
          <fieldset [disabled]="!unlocked() || submitted()" class="space-y-5">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block">
                <span class="mb-2 block text-sm font-semibold text-white/78">Nombre</span>
                <input class="focus-input" type="text" formControlName="name" placeholder="Tu nombre">
              </label>
              <label class="block">
                <span class="mb-2 block text-sm font-semibold text-white/78">WhatsApp</span>
                <input class="focus-input" type="tel" formControlName="phone" placeholder="+593 999 999 999">
              </label>
            </div>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-white/78">Email</span>
              <input class="focus-input" type="email" formControlName="email" placeholder="correo@dominio.com">
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-white/78">¿Que quieres mejorar?</span>
              <textarea class="focus-input min-h-28 resize-y" formControlName="goal" placeholder="Ej: direccion, rodaje, edicion, venta de servicios..."></textarea>
            </label>

            <label class="flex items-start gap-3 text-sm leading-6 text-white/62">
              <input class="mt-1 accent-focus-orange" type="checkbox" formControlName="consent">
              <span>Acepto recibir informacion del curso y comunicaciones de FocusComunicacion.</span>
            </label>

            <button type="submit" class="focus-button focus-button-primary w-full" [disabled]="form.invalid || !unlocked()">
              Enviar registro
            </button>
          </fieldset>

          @if (!unlocked()) {
            <p class="mt-4 rounded-[6px] border border-focus-orange/35 bg-focus-orange/10 px-4 py-3 text-sm text-white/70">
              El formulario se activa automaticamente al completar el video.
            </p>
          }

          @if (submitted()) {
            <div class="mt-5 rounded-[6px] border border-white/12 bg-white/[0.06] p-4">
              <p class="font-semibold text-white">Registro recibido.</p>
              <a class="mt-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-focus-orange" [href]="whatsappHref()" target="_blank" rel="noopener noreferrer">
                <img class="h-4 w-4" [src]="config.whatsapp.iconUrl" alt="" loading="lazy" decoding="async">
                Entrar al grupo de WhatsApp
              </a>
            </div>
          }
        </form>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationSectionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly gate = inject(VideoGateService);
  readonly embedded = input(false);
  readonly config = LANDING_CONFIG;
  readonly submitted = signal(false);
  readonly unlocked = this.gate.isCompleted(LANDING_CONFIG.videoGate.id);
  readonly whatsappHref = computed(() => {
    const separator = LANDING_CONFIG.whatsapp.groupUrl.includes('?') ? '&' : '?';
    return `${LANDING_CONFIG.whatsapp.groupUrl}${separator}text=${encodeURIComponent(LANDING_CONFIG.whatsapp.message)}`;
  });

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    email: ['', [Validators.required, Validators.email]],
    goal: ['', [Validators.required, Validators.minLength(12)]],
    consent: [false, [Validators.requiredTrue]]
  });

  submit(): void {
    if (this.form.invalid || !this.unlocked()) {
      this.form.markAllAsTouched();
      return;
    }

    localStorage.setItem(
      'focuscomunicacion.lastLead',
      JSON.stringify({
        ...this.form.getRawValue(),
        createdAt: new Date().toISOString()
      })
    );
    this.submitted.set(true);
  }
}
