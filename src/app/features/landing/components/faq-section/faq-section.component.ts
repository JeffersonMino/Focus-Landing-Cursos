import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'focus-faq-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <section id="faq" class="focus-band bg-[#090006]">
      <div class="focus-container grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div focusReveal>
          <p class="focus-eyebrow">FAQ</p>
          <h2 class="mt-4 focus-heading">Preguntas antes de entrar.</h2>
        </div>

        <div class="space-y-3" focusReveal>
          @for (item of config.faq; track item.question; let index = $index) {
            <article class="rounded-[8px] border border-white/10 bg-white/[0.04]">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                [attr.aria-expanded]="openIndex() === index"
                (click)="toggle(index)"
              >
                <span class="text-base font-semibold text-white">{{ item.question }}</span>
                <span class="grid h-8 w-8 shrink-0 place-items-center rounded-[6px] bg-white/8 text-focus-orange">
                  {{ openIndex() === index ? '-' : '+' }}
                </span>
              </button>
              @if (openIndex() === index) {
                <p class="px-5 pb-5 text-sm leading-6 text-white/64">{{ item.answer }}</p>
              }
            </article>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqSectionComponent {
  readonly config = LANDING_CONFIG;
  readonly openIndex = signal(0);

  toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? -1 : index));
  }
}
