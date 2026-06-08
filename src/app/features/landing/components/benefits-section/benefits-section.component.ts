import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'focus-benefits-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <section id="beneficios" class="focus-band bg-black">
      <div class="focus-container">
        <div class="mb-12 max-w-3xl" focusReveal>
          <p class="focus-eyebrow">Beneficios</p>
          <h2 class="mt-4 focus-heading">Lo que desbloqueas al entrar.</h2>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          @for (benefit of config.benefits; track benefit.title) {
            <article class="focus-panel p-6 transition duration-300 hover:-translate-y-1 hover:border-focus-orange/50" focusReveal>
              <p class="text-sm font-black text-focus-orange">{{ benefit.metric }}</p>
              <h3 class="mt-6 text-2xl font-semibold text-white">{{ benefit.title }}</h3>
              <p class="mt-4 text-sm leading-6 text-white/64">{{ benefit.description }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BenefitsSectionComponent {
  readonly config = LANDING_CONFIG;
}
