import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'focus-testimonials-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <section id="testimonios" class="focus-band bg-black">
      <div class="focus-container">
        <div class="mb-12 max-w-3xl" focusReveal>
          <p class="focus-eyebrow">Testimonios</p>
          <!-- <h2 class="mt-4 focus-heading">Prueba social con mirada de produccion.</h2> -->
        </div>

        <div class="grid gap-4 lg:grid-cols-3">
          @for (testimonial of config.testimonials; track testimonial.name) {
            <figure class="focus-panel p-6" focusReveal>
              <blockquote class="text-lg leading-8 text-white/78">“{{ testimonial.quote }}”</blockquote>
              <figcaption class="mt-8 border-t border-white/10 pt-5">
                <p class="font-semibold text-white/60 font-bold">{{ testimonial.name }}</p>
                <p class="mt-1 text-sm text-white/52 font-bold">{{ testimonial.role }}</p>
              </figcaption>
            </figure>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonialsSectionComponent {
  readonly config = LANDING_CONFIG;
}
