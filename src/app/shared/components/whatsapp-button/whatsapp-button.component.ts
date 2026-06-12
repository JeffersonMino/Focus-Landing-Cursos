import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { VideoGateService } from '@core/services/video-gate.service';

@Component({
  selector: 'focus-whatsapp-button',
  standalone: true,
  template: `
    <a
      class="focus-button focus-button-primary fixed inset-x-4 bottom-4 z-[90] min-h-14 w-auto px-4 text-xs shadow-2xl shadow-black/45 sm:inset-x-6 sm:px-5 sm:text-sm lg:inset-x-8"
      [class.opacity-85]="!unlocked()"
      [href]="href()"
      target="_blank"
      rel="noopener noreferrer"
      [attr.aria-disabled]="!unlocked()"
      [attr.title]="unlocked() ? 'Ingresar al grupo' : 'Completa el video para registrarte'"
      (click)="handleClick($event)"
    >
      <img class="h-5 w-5 shrink-0" [src]="whatsapp.iconUrl" alt="" loading="lazy" decoding="async">
      <span>{{ label() }}</span>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsappButtonComponent {
  private readonly gate = inject(VideoGateService);
  readonly whatsapp = LANDING_CONFIG.whatsapp;
  readonly unlocked = this.gate.isCompleted(LANDING_CONFIG.videoGate.id);
  readonly href = computed(() => (this.unlocked() ? this.whatsappHref() : '#trailer'));
  readonly label = computed(() => (this.unlocked() ? 'Ingresar al grupo' : 'Registrarse'));

  handleClick(event: MouseEvent): void {
    if (this.unlocked()) {
      return;
    }

    event.preventDefault();
    document.getElementById('trailer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private whatsappHref(): string {
    const separator = this.whatsapp.groupUrl.includes('?') ? '&' : '?';
    return `${this.whatsapp.groupUrl}${separator}text=${encodeURIComponent(this.whatsapp.message)}`;
  }
}
