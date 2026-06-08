import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'focus-cta-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <section class="focus-band bg-[radial-gradient(circle_at_50%_0%,rgba(209,45,91,.28),transparent_34%),linear-gradient(180deg,#120008,#070006)] text-focus-smoke">
      <div class="focus-container" focusReveal>
        <!-- <main-whatsapp-cta>
          <purpose>CTA visible principal. El boton queda centrado y grande para dirigir al grupo de WhatsApp.</purpose>
          <lock>Permanece visualmente bloqueado hasta que unlocked() sea true.</lock>
        </main-whatsapp-cta> -->
        <div class="mx-auto grid max-w-4xl justify-items-center gap-8 text-center">
          <div class="max-w-3xl">
            <p class="text-xs font-black uppercase tracking-[0.24em] text-focus-orange">INFORMACION CURSO</p>
            <h2 class="mt-4 font-display text-[clamp(2rem,8vw,3rem)] font-semibold leading-tight text-focus-smoke">
              Entra al grupo y recibe mas informacion.
            </h2>
          </div>

          <a
            class="focus-button min-h-16 w-full max-w-xl whitespace-normal rounded-[8px] border-focus-orange/40 bg-focus-orange px-6 text-center text-base text-white shadow-glow hover:bg-white hover:text-black sm:min-h-20 sm:px-8 sm:text-xl"
            [class.pointer-events-none]="!unlocked()"
            [class.opacity-50]="!unlocked()"
            [attr.aria-disabled]="!unlocked()"
            [href]="href()"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img class="h-8 w-8 shrink-0" [src]="whatsapp.iconUrl" alt="" loading="lazy" decoding="async">
            <span>Ir a WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtaSectionComponent {
  readonly unlocked = input(false);
  readonly whatsapp = LANDING_CONFIG.whatsapp;
  readonly href = computed(() => {
    const separator = this.whatsapp.groupUrl.includes('?') ? '&' : '?';
    return `${this.whatsapp.groupUrl}${separator}text=${encodeURIComponent(this.whatsapp.message)}`;
  });
}
