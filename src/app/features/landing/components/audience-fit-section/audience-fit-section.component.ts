import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { AudienceFitIcon, AudienceFitItem } from '@core/models/landing.model';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';

interface SummaryPart {
  highlighted: boolean;
  text: string;
}

@Component({
  selector: 'focus-audience-fit-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <section id="para-quien" class="focus-band bg-[linear-gradient(180deg,#070006,#120008_52%,#070006)] text-focus-smoke">
      <!-- <audience-fit-section>
        <purpose>Seccion desbloqueada despues del video. Explica para quien si/no es el taller.</purpose>
        <edit>Los textos e iconos se editan en LANDING_CONFIG.audienceFit.</edit>
      </audience-fit-section> -->

      <div class="focus-container" focusReveal>
          <div class="mb-12 max-w-3xl" focusReveal>
            <!-- <p class="focus-eyebrow">Testimonios</p> -->
            <h2 class="mt-4 focus-heading">Este taller es para ti.</h2>
          </div>
        <div class="grid gap-5 lg:grid-cols-2">
          <article class="rounded-[8px] border border-focus-orange/28 bg-[#1f0711]/86 p-5 shadow-xl shadow-black/30 backdrop-blur sm:p-7">
            <header class="mb-2 flex items-center gap-3">
              <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-focus-orange text-white shadow-glow">
                <svg class="h-7 w-7" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12.4l4.2 4.2L19 6.8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                </svg>
              </span>
              <h2 class="font-display text-[clamp(1.35rem,6vw,1.9rem)] font-black uppercase tracking-wide text-focus-orange">
                {{ config.forTitle }}
              </h2>
            </header>

            <ul class="divide-y divide-white/10">
              @for (item of config.forItems; track item.text) {
                <li class="grid grid-cols-[2.75rem_1fr] items-center gap-3 py-4 sm:grid-cols-[3.25rem_1fr] sm:gap-4">
                  <span class="grid h-10 w-10 place-items-center rounded-full bg-focus-orange text-white shadow-lg shadow-focus-orange/20 sm:h-11 sm:w-11">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
                      <path [attr.d]="iconPath(item.icon)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"/>
                    </svg>
                  </span>
                  <p class="text-sm font-semibold leading-6 text-focus-smoke/88 sm:text-base">{{ item.text }}</p>
                </li>
              }
            </ul>
          </article>

          <article class="rounded-[8px] border border-focus-smoke/16 bg-[#120008]/92 p-5 shadow-xl shadow-black/30 backdrop-blur sm:p-7">
            <header class="mb-2 flex items-center gap-3">
              <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#4d0b22] text-focus-smoke ring-1 ring-focus-orange/35">
                <svg class="h-7 w-7" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="3"/>
                </svg>
              </span>
              <h2 class="font-display text-[clamp(1.35rem,6vw,1.9rem)] font-black uppercase tracking-wide text-focus-smoke">
                {{ config.notForTitle }}
              </h2>
            </header>

            <ul class="divide-y divide-white/10">
              @for (item of config.notForItems; track item.text) {
                <li class="grid grid-cols-[2.75rem_1fr] items-center gap-3 py-4 sm:grid-cols-[3.25rem_1fr] sm:gap-4">
                  <span class="grid h-10 w-10 place-items-center rounded-full bg-[#4d0b22] text-focus-smoke ring-1 ring-focus-orange/30 sm:h-11 sm:w-11">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
                      <path [attr.d]="iconPath(item.icon)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"/>
                    </svg>
                  </span>
                  <p class="text-sm font-semibold leading-6 text-focus-smoke/72 sm:text-base">{{ item.text }}</p>
                </li>
              }
            </ul>
          </article>
        </div>

        <aside class="mt-6 grid gap-6 rounded-[8px] border border-focus-orange/24 bg-[#070006] p-5 text-focus-smoke shadow-2xl shadow-black/30 sm:p-8 lg:grid-cols-[0.9fr_1.5fr_auto] lg:items-center">
          <div class="border-b border-white/14 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-7">
            <p class="font-display text-[clamp(1.75rem,8vw,2.5rem)] font-black uppercase leading-tight">
              <span class="block">{{ config.summaryTitleLead }}</span>
              <span class="block text-focus-orange">{{ config.summaryTitleAccent }}</span>
            </p>
          </div>

          <p class="text-sm font-semibold leading-7 text-focus-smoke/82 sm:text-lg">
            @for (part of summaryParts(); track part.text) {
              <span [class.text-focus-orange]="part.highlighted">{{ part.text }}</span>
            }
          </p>

          <div class="hidden h-20 w-20 place-items-center rounded-full border-4 border-focus-orange text-focus-orange lg:grid">
            <svg class="h-11 w-11" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4L7 17M17 7l1.4-1.4M8 12a4 4 0 108 0 4 4 0 00-8 0z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path d="M9.7 12.1l1.4 1.4 3.2-3.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"/>
            </svg>
          </div>
        </aside>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudienceFitSectionComponent {
  /**
   * <audience-fit-config>
   *   <purpose>Fuente unica de textos e iconos para esta seccion.</purpose>
   * </audience-fit-config>
   */
  readonly config = LANDING_CONFIG.audienceFit;

  readonly summaryParts = computed<SummaryPart[]>(() => {
    const [highlight] = this.config.highlightedWords;
    const description = this.config.summaryDescription;

    if (!highlight || !description.includes(highlight)) {
      return [{ highlighted: false, text: description }];
    }

    const [before, after] = description.split(highlight);
    return [
      { highlighted: false, text: before },
      { highlighted: true, text: highlight },
      { highlighted: false, text: after }
    ];
  });

  iconPath(icon: AudienceFitIcon): string {
    const paths: Record<AudienceFitIcon, string> = {
      check: 'M5 12.4l4.2 4.2L19 6.8',
      user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 21a7.5 7.5 0 0115 0',
      chart: 'M4 19V5M4 19h17M8 16v-5M13 16V8M18 16v-9',
      target: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 17a5 5 0 100-10 5 5 0 000 10zM12 13a1 1 0 100-2 1 1 0 000 2z',
      team: 'M8 11a3 3 0 100-6 3 3 0 000 6zM16 11a3 3 0 100-6 3 3 0 000 6zM3.5 20a5.5 5.5 0 0111 0M10.5 20a5.5 5.5 0 0110.5 0',
      rocket: 'M5 15c2-6 6-10 14-12-2 8-6 12-12 14l-2-2zM9 13l2 2M4 20l4-1-3-3-1 4zM15 7h.01',
      x: 'M7 7l10 10M17 7L7 17',
      cap: 'M3 8l9-4 9 4-9 4-9-4zM7 11v4c2.8 2 7.2 2 10 0v-4M21 8v6',
      brain: 'M8 6a3 3 0 00-3 3v1a3 3 0 000 6v1a3 3 0 003 3h1V6H8zM16 6a3 3 0 013 3v1a3 3 0 010 6v1a3 3 0 01-3 3h-1V6h1zM9 10H6M18 10h-3M9 15H6M18 15h-3',
      wand: 'M4 20L20 4M15 4l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM5 5l.6 1.4L7 7l-1.4.6L5 9l-.6-1.4L3 7l1.4-.6L5 5z',
      clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
      minus: 'M6 12h12'
    };

    return paths[icon];
  }
}
