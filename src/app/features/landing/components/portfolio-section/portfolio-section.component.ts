import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'focus-portfolio-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <section id="portfolio" class="focus-band bg-[#120008]">
      <div class="focus-container">
        <div class="mb-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end" focusReveal>
          <div>
            <p class="focus-eyebrow">Portafolio filmmaker</p>
            <h2 class="mt-4 focus-heading">Imagenes que venden una sensacion.</h2>
          </div>
          <p class="focus-copy">
            Usa esta seccion para mostrar trabajos propios, frames de campanas, detras de camaras o stills del curso.
          </p>
        </div>

        <div class="grid gap-4 lg:grid-cols-3">
          @for (item of config.portfolio; track item.title) {
            <article class="group overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.04]" focusReveal>
              <div class="aspect-[4/5] overflow-hidden">
                <img
                  class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  [src]="item.image.src"
                  [alt]="item.image.alt"
                  loading="lazy"
                  decoding="async"
                >
              </div>
              <div class="p-5">
                <p class="text-xs font-bold uppercase tracking-[0.2em] text-focus-orange">{{ item.category }}</p>
                <h3 class="mt-2 text-xl font-semibold text-white">{{ item.title }}</h3>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioSectionComponent {
  readonly config = LANDING_CONFIG;
}
