import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { ResultsMetricTone } from '@core/models/landing.model';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'focus-results-section',
  standalone: true,
  imports: [NgTemplateOutlet, RevealOnScrollDirective],
  template: `
    <section id="resultados" class="focus-band overflow-hidden bg-[radial-gradient(circle_at_14%_22%,rgba(209,45,91,.18),transparent_34%),linear-gradient(180deg,#070006,#120008_48%,#070006)]">
      <div class="focus-container">
        <!-- <results-header>
          <purpose>Encabezado editable desde LANDING_CONFIG.results.</purpose>
        </results-header> -->
        <div class="mx-auto max-w-4xl text-center" focusReveal>
          <p class="focus-eyebrow justify-center">{{ results.eyebrow }}</p>
          <h2 class="mt-4 focus-heading">{{ results.title }}</h2>
          <p class="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
            Estos son los resultados de uno de nuestros clientes del sector de la salud en Quito.
          </p>
        </div>

        <!-- <results-system>
          <purpose>Bloque principal de resultados y sistema. Mantiene los 6 pilares agregados en configuracion.</purpose>
          <edit>Edita metricas, pilares y textos en src/app/core/config/landing.config.ts.</edit>
        </results-system> -->
        <div class="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,.82fr)] lg:items-stretch" focusReveal>
          <div class="space-y-4">
            @for (metric of results.metrics; track metric.value) {
              <article [class]="metricPanelClass(metric.tone)">
                <div [class]="metricIconClass(metric.tone)" aria-hidden="true">
                  <ng-container [ngTemplateOutlet]="metricIconTemplate" [ngTemplateOutletContext]="{ tone: metric.tone }" />
                </div>

                <div class="min-w-0 border-l border-white/30 pl-4 sm:pl-7">
                  <p class="font-display text-[clamp(2.85rem,10vw,5.55rem)] font-black leading-none tracking-normal text-white">
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

          <aside class="focus-panel relative overflow-hidden border-focus-orange/24 bg-black/42 p-4 sm:p-5">
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_10%,rgba(209,45,91,.18),transparent_34%),linear-gradient(180deg,rgba(242,232,216,.055),transparent_46%)]"></div>
            <div class="relative">
              <p class="text-xs font-black uppercase tracking-[0.24em] text-focus-orange">Sistema comercial</p>
              <h3 class="mt-3 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Nuestro sistema.
              </h3>

              <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                @for (pillar of results.pillars; track pillar.title + pillar.accent; let index = $index) {
                  <article class="group relative overflow-hidden rounded-[8px] border border-white/12 bg-black/36 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-focus-orange/70 hover:bg-focus-orange/10">
                    <div class="mb-4 flex items-center justify-between gap-3">
                      <div class="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] border border-focus-orange/45 bg-focus-orange/10 text-focus-orange shadow-[0_0_26px_rgba(209,45,91,.22)]">
                        <ng-container [ngTemplateOutlet]="pillarIconTemplate" [ngTemplateOutletContext]="{ icon: pillar.icon }" />
                      </div>
                      <span class="text-[10px] font-black uppercase tracking-[0.22em] text-white/32">{{ pillarNumber(index) }}</span>
                    </div>

                    <p class="text-lg font-black uppercase leading-tight tracking-normal text-white">{{ pillar.title }}</p>
                    <p class="text-lg font-black uppercase leading-tight tracking-normal text-focus-orange">{{ pillar.accent }}</p>
                  </article>
                }
              </div>
            </div>
          </aside>
        </div>

        <div class="mx-auto mt-12 max-w-5xl text-center" focusReveal>
          <p class="text-2xl font-medium leading-relaxed text-white/82 sm:text-3xl">
            {{ results.statementLead }}
            @for (word of results.highlightedWords; track word; let last = $last) {
              <span class="font-black text-focus-orange">{{ word }}</span>@if (!last) {<span>, </span>}
            }.
          </p>
        </div>

        <div class="mx-auto mt-10 max-w-4xl rounded-[8px] border border-focus-orange/60 bg-black/52 p-5 shadow-glow sm:p-7" focusReveal>
          <div class="grid gap-5 sm:grid-cols-[5rem_1fr] sm:items-center">
            <div class="grid h-20 w-20 place-items-center rounded-[8px] border border-focus-orange/35 bg-focus-orange/12 text-focus-orange">
              <svg viewBox="0 0 24 24" class="h-12 w-12" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
                <path d="M4 19V5" />
                <path d="M4 19h16" />
                <path d="m7 15 3.2-3.2 2.7 2.2L19 7" />
                <path d="M16 7h3v3" />
              </svg>
            </div>
            <div class="text-center sm:text-left">
              <p class="text-3xl font-black uppercase leading-tight text-white sm:text-5xl">{{ results.closingLead }}</p>
              <p class="text-3xl font-black uppercase leading-tight text-focus-orange sm:text-5xl">{{ results.closingAccent }}</p>
            </div>
          </div>
        </div>
      </div>

      <ng-template #metricIconTemplate let-tone="tone">
        @switch (tone) {
          @case ('blue') {
            <svg viewBox="0 0 24 24" class="h-9 w-9 sm:h-11 sm:w-11" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
              <path d="M16 19v-1.2c0-1.9-1.8-3.4-4-3.4s-4 1.5-4 3.4V19" />
              <path d="M12 11.4a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M5.7 17.6v-.8c0-1.3-1.1-2.4-2.7-2.8" />
              <path d="M5.8 7.2a2.4 2.4 0 0 0 0 4.6" />
              <path d="M18.3 17.6v-.8c0-1.3 1.1-2.4 2.7-2.8" />
              <path d="M18.2 7.2a2.4 2.4 0 0 1 0 4.6" />
            </svg>
          }
          @case ('green') {
            <svg viewBox="0 0 24 24" class="h-9 w-9 sm:h-11 sm:w-11" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
              <path d="M7 3v3" />
              <path d="M17 3v3" />
              <path d="M4.5 8.5h15" />
              <path d="M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z" />
              <path d="m8 14 2.3 2.2L16.2 11" />
            </svg>
          }
          @default {
            <svg viewBox="0 0 24 24" class="h-9 w-9 sm:h-11 sm:w-11" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
              <path d="M12 3v18" />
              <path d="M16.4 7.3A4.4 4.4 0 0 0 12 5.8c-2.5 0-4.2 1.2-4.2 3s1.6 2.5 4.5 3.1c2.8.6 4.5 1.4 4.5 3.4s-1.9 3.1-4.8 3.1a6.6 6.6 0 0 1-5.1-2" />
            </svg>
          }
        }
      </ng-template>

      <ng-template #pillarIconTemplate let-icon="icon">
        @switch (icon) {
          <!-- @case ('system') {
            <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
              <path d="M12 3 4 7.5l8 4.5 8-4.5L12 3Z" />
              <path d="m4 12 8 4.5 8-4.5" />
              <path d="m4 16.5 8 4.5 8-4.5" />
            </svg>
          } -->
          @case ('strategy') {
            <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" />
              <path d="m15 9 4-4" />
              <path d="M19 5h-3" />
              <path d="M19 5v3" />
            </svg>
          }
          @case ('content') {
            <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
              <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
              <path d="M8 8h8" />
              <path d="M8 12h5" />
            </svg>
          }
          @case ('channels') {
            <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
              <path d="M12 5v14" />
              <path d="M12 12H5" />
              <path d="M12 12h7" />
              <circle cx="12" cy="5" r="2.5" />
              <circle cx="5" cy="12" r="2.5" />
              <circle cx="19" cy="12" r="2.5" />
              <circle cx="12" cy="19" r="2.5" />
            </svg>
          }
          @case ('crm') {
            <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
              <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3l-4 4-4-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
              <path d="M8 9h8" />
              <path d="M8 13h5" />
              <path d="M17 13h.01" />
            </svg>
          }
          @case ('marketing') {
            <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
              <path d="M4 11v2a3 3 0 0 0 3 3h2l5 4v-6" />
              <path d="M14 10V4l6 4v8l-6 4v-6" />
              <path d="M9 16v3" />
              <path d="M7 8h2" />
            </svg>
          }
          @case ('follow') {
            <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
              <path d="M20 12a8 8 0 0 1-13.7 5.6" />
              <path d="M4 12A8 8 0 0 1 17.7 6.4" />
              <path d="M18 3v4h-4" />
              <path d="M6 21v-4h4" />
            </svg>
          }
          @case ('checklist') {
            <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
              <path d="M9 5h10" />
              <path d="M9 12h10" />
              <path d="M9 19h10" />
              <path d="m4 5 1 1 2-2" />
              <path d="m4 12 1 1 2-2" />
              <path d="m4 19 1 1 2-2" />
            </svg>
          }
          @default {
            <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
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
    const base = 'grid min-h-36 grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-4 rounded-[8px] border p-4 shadow-2xl sm:min-h-44 sm:grid-cols-[6.8rem_minmax(0,1fr)] sm:gap-6 sm:p-7';
    const toneMap: Record<ResultsMetricTone, string> = {
      blue: 'border-blue-300/40 bg-[linear-gradient(135deg,rgba(16,72,205,.9),rgba(8,25,86,.96))] shadow-blue-950/30',
      green: 'border-lime-300/40 bg-[linear-gradient(135deg,rgba(92,160,0,.9),rgba(34,72,6,.96))] shadow-lime-950/30',
      orange: 'border-orange-300/40 bg-[linear-gradient(135deg,rgba(255,112,0,.94),rgba(139,47,0,.97))] shadow-orange-950/30'
    };

    return `${base} ${toneMap[tone]}`;
  }

  metricIconClass(tone: ResultsMetricTone): string {
    const base = 'grid h-16 w-16 place-items-center rounded-[8px] border text-white shadow-2xl sm:h-24 sm:w-24';
    const toneMap: Record<ResultsMetricTone, string> = {
      blue: 'border-blue-100/35 bg-blue-500/40 shadow-blue-950/50',
      green: 'border-lime-100/35 bg-lime-500/40 shadow-lime-950/50',
      orange: 'border-orange-100/35 bg-orange-500/40 shadow-orange-950/50'
    };

    return `${base} ${toneMap[tone]}`;
  }

  pillarNumber(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
