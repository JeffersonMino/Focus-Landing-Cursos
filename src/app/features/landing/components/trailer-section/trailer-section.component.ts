import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';
import { VideoGateComponent } from '@shared/components/video-gate/video-gate.component';

@Component({
  selector: 'focus-trailer-section',
  standalone: true,
  imports: [RevealOnScrollDirective, VideoGateComponent],
  template: `
    <div class="focus-container">
      <div class="mb-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end" focusReveal>
        <div>
          <p class="focus-eyebrow">Trailer obligatorio</p>
          <h2 class="mt-4 focus-heading">Primero mira. Luego aplica.</h2>
        </div>
        <p class="focus-copy max-w-2xl lg:justify-self-end">
          Sistema de Ventas:
           "Cómo conseguir clientes y vender por redes sociales."
        </p>
      </div>

      <div focusReveal>
        <focus-video-gate [video]="config.videoGate" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrailerSectionComponent {
  readonly config = LANDING_CONFIG;
}
