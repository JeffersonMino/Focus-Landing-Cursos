import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { VideoGateService } from '@core/services/video-gate.service';

@Component({
  selector: 'focus-whatsapp-button',
  standalone: true,
  template: `
    <a
      class="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-[8px] border border-white/12 bg-white text-black shadow-2xl shadow-black/40 transition duration-300 hover:-translate-y-1 hover:bg-focus-orange focus-visible:outline-focus-orange"
      [class.opacity-45]="!unlocked()"
      [class.pointer-events-none]="false"
      [href]="href()"
      target="_blank"
      rel="noopener noreferrer"
      [attr.aria-disabled]="!unlocked()"
      [attr.title]="unlocked() ? 'Abrir WhatsApp' : 'Completa el video para desbloquear WhatsApp'"
      (click)="handleClick($event)"
    >
      <span class="sr-only">WhatsApp</span>
      <img class="h-7 w-7" [src]="whatsapp.iconUrl" alt="" loading="lazy" decoding="async">
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsappButtonComponent {
  private readonly gate = inject(VideoGateService);
  readonly whatsapp = LANDING_CONFIG.whatsapp;
  readonly unlocked = this.gate.isCompleted(LANDING_CONFIG.videoGate.id);
  readonly href = computed(() => (this.unlocked() ? this.whatsappHref() : '#trailer'));

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
