import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { VisitCounterService } from '@core/services/visit-counter.service';
import { inject } from '@angular/core';

@Component({
  selector: 'focus-footer-section',
  standalone: true,
  template: `
    <footer class="border-t border-white/10 bg-black py-10">
      <div class="focus-container flex flex-col gap-6 text-sm text-white/54 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="font-black uppercase tracking-[0.22em] text-white">{{ config.brand.name }}</p>
          <p class="mt-2">{{ config.brand.slogan }}</p>
        </div>
        <div class="grid gap-1 md:text-right">
          <p>Visitas totales: <span class="text-white">{{ visits.total() }}</span></p>
          <p>Sesion actual: <span class="text-white">{{ visits.session() }}</span> · Fuente: <span class="text-white">{{ visits.source() }}</span></p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterSectionComponent {
  readonly config = LANDING_CONFIG;
  readonly visits = inject(VisitCounterService);
}
