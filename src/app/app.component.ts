import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WhatsappButtonComponent } from './shared/components/whatsapp-button/whatsapp-button.component';
import { SeoService } from './core/services/seo.service';
import { LANDING_CONFIG } from './core/config/landing.config';

@Component({
  selector: 'focus-root',
  standalone: true,
  imports: [RouterOutlet, WhatsappButtonComponent],
  template: `
    @if (loading()) {
      <div class="fixed inset-0 z-[100] grid place-items-center bg-black text-white" aria-live="polite">
        <div class="w-full max-w-xs px-6 text-center">
          <div class="mx-auto mb-5 h-12 w-12 rounded-[8px] border border-focus-orange/60 bg-focus-orange/10 shadow-glow"></div>
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-white/72">DALERESET</p>
          <div class="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
            <div class="h-full w-2/3 animate-[focusLoad_900ms_ease-in-out_infinite] bg-focus-orange"></div>
          </div>
        </div>
      </div>
    }

    <router-outlet />
    <focus-whatsapp-button />
  `,
  styles: [
    `
      @keyframes focusLoad {
        0% {
          transform: translateX(-110%);
        }
        100% {
          transform: translateX(160%);
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly seo = inject(SeoService);
  readonly loading = signal(true);

  constructor() {
    this.seo.apply(LANDING_CONFIG.seo);
    window.setTimeout(() => this.loading.set(false), 850);
  }
}
