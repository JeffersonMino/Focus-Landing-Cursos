import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { ResultsMetricTone, ResultsPillarIcon } from '@core/models/landing.model';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'focus-results-section',
  standalone: true,
  imports: [NgTemplateOutlet, RevealOnScrollDirective],
  template: `
    <section id="resultados" class="focus-band bg-[radial-gradient(circle_at_16%_24%,rgba(209,45,91,.18),transparent_32%),linear-gradient(180deg,#070006,#120008_50%,#070006)]">
      <div class="focus-container">
        <!-- <results-header>
          <purpose>Encabezado de la seccion de resultados. Los textos se editan desde LANDING_CONFIG.results.</purpose>
        </results-header> -->
        <div class="mx-auto max-w-3xl text-center" focusReveal>
          <p class="focus-eyebrow justify-center">{{ results.eyebrow }}</p>
          <h2 class="mt-4 focus-heading">{{ results.title }}</h2>
        </div>

        <!-- <results-infographic>
          <purpose>Replica la informacion de la referencia: metricas principales, pilares y cierre comercial.</purpose>
          <edit>Las metricas y pilares vienen de landing.config.ts.</edit>
        </results-infographic> -->
        <div class="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.72fr)] lg:items-center" focusReveal>
          <div class="space-y-4">
            @for (metric of results.metrics; track metric.value) {
              <article [class]="metricPanelClass(metric.tone)">
                <div [class]="metricIconClass(metric.tone)" aria-hidden="true">
                  @switch (metric.tone) {
                    @case ('blue') {
                      <svg viewBox="0 0 24 24" class="h-8 w-8 fill-current">
                        <path d="M7.5 11.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm9 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM2.7 18.2c.7-3 2.7-4.8 4.8-4.8s4.1 1.8 4.8 4.8c.1.5-.3 1-.8 1H3.5c-.5 0-.9-.5-.8-1Zm9 0c.7-3 2.7-4.8 4.8-4.8s4.1 1.8 4.8 4.8c.1.5-.3 1-.8 1h-8c-.5 0-.9-.5-.8-1Z"/>
                      </svg>
                    }
                    @case ('green') {
                      <svg viewBox="0 0 24 24" class="h-8 w-8 fill-current">
                        <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1.5A2.5 2.5 0 0 1 22 6.5v12A2.5 2.5 0 0 1 19.5 21h-15A2.5 2.5 0 0 1 2 18.5v-12A2.5 2.5 0 0 1 4.5 4H6V3a1 1 0 0 1 1-1Zm13 8H4v8.5c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V10ZM5 6.5V8h14V6.5c0-.3-.2-.5-.5-.5h-14c-.3 0-.5.2-.5.5Z"/>
                      </svg>
                    }
                    @default {
                      <svg viewBox="0 0 24 24" class="h-8 w-8 fill-current">
                        <path d="M12 2a1 1 0 0 1 1 1v1.1c1.4.2 2.8.8 3.8 1.7a1 1 0 1 1-1.3 1.5A5.4 5.4 0 0 0 12 6c-2 0-3.2.9-3.2 2.1 0 1.3 1.2 1.8 4 2.4 2.7.7 5.4 1.6 5.4 4.8 0 2.4-1.9 4.3-5.2 4.7V21a1 1 0 1 1-2 0v-1c-2-.2-3.8-1-5.1-2.2a1 1 0 0 1 1.4-1.5A6.7 6.7 0 0 0 12 18c2.6 0 4.2-1 4.2-2.6 0-1.4-1.2-2-4-2.7-2.8-.7-5.4-1.5-5.4-4.6C6.8 5.8 8.4 4.4 11 4.1V3a1 1 0 0 1 1-1Z"/>
                      </svg>
                    }
                  }
                </div>
                <div class="min-w-0 border-l border-white/32 pl-5 sm:pl-7">
                  <p class="font-display text-[clamp(3rem,12vw,5.7rem)] font-black leading-none tracking-normal text-white">
                    {{ metric.value }}
                  </p>
                  <p class="mt-2 text-2xl font-semibold leading-tight text-white sm:text-4xl">{{ metric.label }}</p>
                  @if (metric.detail) {
                    <p class="mt-2 text-base font-semibold leading-6 text-white/76 sm:text-xl">{{ metric.detail }}</p>
                  }
                </div>
              </article>
            }
          </div>

          <div class="space-y-4">
            @for (pillar of results.pillars; track pillar.accent) {
              <article class="grid grid-cols-[4.25rem_1fr] items-center gap-4 rounded-[8px] border border-focus-orange/24 bg-black/38 p-4 shadow-[0_0_36px_rgba(255,107,0,.08)]">
                <div class="grid h-16 w-16 place-items-center rounded-[8px] border border-focus-orange/45 bg-focus-orange/10 text-focus-orange">
                  <ng-container [ngTemplateOutlet]="iconTemplate" [ngTemplateOutletContext]="{ icon: pillar.icon }" />
                </div>
                <div>
                  <p class="text-2xl font-black uppercase leading-tight tracking-normal text-white">{{ pillar.title }}</p>
                  <p class="text-2xl font-black uppercase leading-tight tracking-normal text-focus-orange">{{ pillar.accent }}</p>
                </div>
              </article>
            }
          </div>
        </div>

        <div class="mx-auto mt-12 max-w-5xl text-center" focusReveal>
          <p class="text-2xl font-medium leading-relaxed text-white/82 sm:text-3xl">
            {{ results.statementLead }}
            @for (word of results.highlightedWords; track word; let last = $last) {
              <span class="font-black text-focus-orange">{{ word }}</span>@if (!last) {<span>, </span>}
            }.
          </p>
        </div>

        <div class="mx-auto mt-10 max-w-4xl rounded-[8px] border border-focus-orange/60 bg-black/48 p-5 shadow-glow sm:p-7" focusReveal>
          <div class="grid gap-5 sm:grid-cols-[5rem_1fr] sm:items-center">
            <div class="grid h-20 w-20 place-items-center rounded-[8px] bg-focus-orange/12 text-focus-orange">
              <svg viewBox="0 0 24 24" class="h-12 w-12 fill-current" aria-hidden="true">
                <path d="M4 19a1 1 0 0 1-1-1v-5a1 1 0 1 1 2 0v4h15a1 1 0 1 1 0 2H4Zm2-4.5a1 1 0 0 1-.7-1.7l4-4a1 1 0 0 1 1.3-.1l3 2.2 4.7-6.3a1 1 0 0 1 1.6 1.2l-5.3 7.1a1 1 0 0 1-1.4.2l-3.1-2.3-3.4 3.4a1 1 0 0 1-.7.3Z"/>
              </svg>
            </div>
            <div class="text-center sm:text-left">
              <p class="text-3xl font-black uppercase leading-tight text-white sm:text-5xl">{{ results.closingLead }}</p>
              <p class="text-3xl font-black uppercase leading-tight text-focus-orange sm:text-5xl">{{ results.closingAccent }}</p>
            </div>
          </div>
        </div>
      </div>

      <ng-template #iconTemplate let-icon="icon">
        @switch (icon) {
          @case ('content') {
            <svg viewBox="0 0 24 24" class="h-10 w-10 fill-current" aria-hidden="true">
              <path d="M5 3h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5.7l-4.6 4.1A1 1 0 0 1 7 19.4V16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 5a1 1 0 0 0 0 2h10a1 1 0 1 0 0-2H7Zm0 4a1 1 0 1 0 0 2h7a1 1 0 1 0 0-2H7Z"/>
            </svg>
          }
          @case ('follow') {
            <svg viewBox="0 0 24 24" class="h-10 w-10 fill-current" aria-hidden="true">
              <path d="M12 3a8.9 8.9 0 0 1 6.4 2.7V4a1 1 0 1 1 2 0v4.6a1 1 0 0 1-1 1h-4.6a1 1 0 1 1 0-2h2.1A7 7 0 0 0 5 12a1 1 0 1 1-2 0 9 9 0 0 1 9-9Zm0 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-8.4 6.4a1 1 0 0 1 1 1v1.7A7 7 0 0 0 19 12a1 1 0 1 1 2 0 9 9 0 0 1-15.4 6.3V20a1 1 0 1 1-2 0v-4.6a1 1 0 0 1 1-1h4.6a1 1 0 1 1 0 2H7.1a7 7 0 0 0 4.9 2 7 7 0 0 0 5.3-2.4 5.8 5.8 0 0 0-10.6 0H4.6a1 1 0 0 1-1-1.6Z"/>
            </svg>
          }
          @case ('checklist') {
            <svg viewBox="0 0 24 24" class="h-10 w-10 fill-current" aria-hidden="true">
              <path d="M9 2h6a2 2 0 0 1 2 2h1.5A2.5 2.5 0 0 1 21 6.5v13A2.5 2.5 0 0 1 18.5 22h-13A2.5 2.5 0 0 1 3 19.5v-13A2.5 2.5 0 0 1 5.5 4H7a2 2 0 0 1 2-2Zm0 2v2h6V4H9Zm7.7 6.7a1 1 0 0 0-1.4-1.4L11 13.6l-1.3-1.3a1 1 0 1 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l5-5ZM8 18a1 1 0 0 0 1 1h7a1 1 0 1 0 0-2H9a1 1 0 0 0-1 1Z"/>
            </svg>
          }
          @default {
            <svg viewBox="0 0 24 24" class="h-10 w-10 fill-current" aria-hidden="true">
              <path d="M12 2a10 10 0 1 1-10 10A10 10 0 0 1 12 2Zm0 2a8 8 0 1 0 8 8 8 8 0 0 0-8-8Zm0 3a5 5 0 1 1-5 5 5 5 0 0 1 5-5Zm0 2a3 3 0 1 0 3 3 3 3 0 0 0-3-3Zm6.3-6.7a1 1 0 0 1 1.4 0l2 2a1 1 0 0 1 0 1.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L19.6 5 18.3 3.7a1 1 0 0 1 0-1.4Z"/>
            </svg>
          }
        }
      </ng-template>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsSectionComponent {
  readonly results = LANDING_CONFIG.results;

  metricPanelClass(tone: ResultsMetricTone): string {
    const base = 'grid min-h-36 grid-cols-[5rem_1fr] items-center gap-5 rounded-[8px] border p-5 shadow-2xl sm:min-h-44 sm:grid-cols-[7rem_1fr] sm:p-7';
    const toneMap: Record<ResultsMetricTone, string> = {
      blue: 'border-blue-300/40 bg-[linear-gradient(135deg,rgba(16,72,205,.86),rgba(8,25,86,.94))] shadow-blue-950/30',
      green: 'border-lime-300/40 bg-[linear-gradient(135deg,rgba(96,165,0,.88),rgba(35,74,5,.94))] shadow-lime-950/30',
      orange: 'border-orange-300/40 bg-[linear-gradient(135deg,rgba(255,112,0,.92),rgba(139,47,0,.96))] shadow-orange-950/30'
    };

    return `${base} ${toneMap[tone]}`;
  }

  metricIconClass(tone: ResultsMetricTone): string {
    const base = 'grid h-20 w-20 place-items-center rounded-[8px] border text-white shadow-2xl sm:h-28 sm:w-28';
    const toneMap: Record<ResultsMetricTone, string> = {
      blue: 'border-blue-100/35 bg-blue-500/50 shadow-blue-950/50',
      green: 'border-lime-100/35 bg-lime-500/45 shadow-lime-950/50',
      orange: 'border-orange-100/35 bg-orange-500/45 shadow-orange-950/50'
    };

    return `${base} ${toneMap[tone]}`;
  }
}
