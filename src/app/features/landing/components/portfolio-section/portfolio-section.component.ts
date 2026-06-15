import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { PortfolioItem } from '@core/models/landing.model';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'focus-portfolio-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <section id="portfolio" class="focus-band bg-[linear-gradient(180deg,#070006,#120008_48%,#070006)]">
      <div class="focus-container">
        <div class="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end" focusReveal>
          <div>
            <p class="focus-eyebrow">Portafolio del Taller</p>
            <h2 class="mt-4 focus-heading">Primer taller.</h2>
          </div>
          <p class="focus-copy">
              Aprende haciendo
              CRM y cierre de ventas
              Estrategias que funcionan
              Organiza tu proceso comercial
              Trabajo práctico guiado
              Herramientas para crecer
              Casos reales de negocio
              Resultados desde la experiencia.
          </p>
        </div>

        <!-- <portfolio-slider>
          <purpose>Slider responsive. Las imagenes vienen de LANDING_CONFIG.portfolio y pueden apuntar a public/assets/images.</purpose>
          <edit>Agrega mas fotos en public/assets/images y cambia las rutas en landing.config.ts.</edit>
        </portfolio-slider> -->
        <div
          class="focus-panel relative overflow-hidden border-focus-orange/25 bg-black/42 p-3 shadow-glow sm:p-4 lg:p-5"
          focusReveal
        >
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(209,45,91,.24),transparent_32%),linear-gradient(135deg,rgba(242,232,216,.08),transparent_40%)]"></div>

          <div class="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-stretch">
            <button
              type="button"
              class="group relative min-h-[360px] overflow-hidden rounded-[8px] border border-white/12 bg-black text-left sm:min-h-[480px] lg:min-h-[560px]"
              (click)="openLightbox()"
              [attr.aria-label]="'Ampliar imagen: ' + activeItem().title"
            >
              <img
                class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                [src]="activeItem().image.src"
                [alt]="activeItem().image.alt"
                loading="lazy"
                decoding="async"
              >
              <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,0,6,.08),rgba(7,0,6,.78))]"></div>
              <div class="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <p class="text-xs font-black uppercase tracking-[0.24em] text-focus-orange">{{ activeItem().category }}</p>
                <h3 class="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
                  {{ activeItem().title }}
                </h3>
                <p class="mt-4 max-w-xl text-sm leading-6 text-white/72">
                  Presiona la imagen para verla en grande sin salir de la experiencia.
                </p>
              </div>
            </button>

            <aside class="flex flex-col justify-between gap-4 rounded-[8px] border border-white/10 bg-white/[0.045] p-4">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.22em] text-white/48">Galeria</p>
                <p class="mt-2 text-sm leading-6 text-white/70">
                  {{ activeIndex() + 1 }} / {{ items.length }} piezas seleccionadas
                </p>
              </div>

              <div class="grid grid-cols-3 gap-2 lg:grid-cols-1">
                @for (item of items; track item.title; let index = $index) {
                  <button
                    type="button"
                    [class]="thumbButtonClass(index)"
                    (click)="select(index, true)"
                  >
                    <span class="block aspect-square overflow-hidden bg-black lg:aspect-[4/3]">
                      <img
                        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        [src]="item.image.src"
                        [alt]="item.image.alt"
                        loading="lazy"
                        decoding="async"
                      >
                    </span>
                    <span class="hidden min-w-0 p-3 lg:block">
                      <span class="block truncate text-xs font-black uppercase tracking-[0.16em] text-white">{{ item.category }}</span>
                      <span class="mt-1 block truncate text-sm text-white/72">{{ item.title }}</span>
                    </span>
                  </button>
                }
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button type="button" class="focus-button focus-button-primary px-3 text-xs" (click)="previous()">
                  Anterior
                </button>
                <button type="button" class="focus-button focus-button-primary px-3 text-xs" (click)="next()">
                  Siguiente
                </button>
              </div>

              <div class="flex justify-center gap-2" aria-label="Seleccionar imagen">
                @for (item of items; track item.title; let index = $index) {
                  <button
                    type="button"
                    [class]="dotButtonClass(index)"
                    [attr.aria-label]="'Ver imagen ' + (index + 1)"
                    (click)="select(index, true)"
                  ></button>
                }
              </div>
            </aside>
          </div>
        </div>
      </div>

      @if (lightboxOpen()) {
        <!-- <portfolio-lightbox>
          <purpose>Amplia la foto activa con fondo cinematografico y cierre accesible.</purpose>
        </portfolio-lightbox> -->
        <div class="fixed inset-0 z-[95] grid place-items-center bg-black/88 p-4 backdrop-blur-md" role="dialog" aria-modal="true" (click)="closeLightbox()">
          <div class="relative w-full max-w-6xl overflow-hidden rounded-[8px] border border-focus-orange/35 bg-black shadow-glow" (click)="$event.stopPropagation()">
            <button
              type="button"
              class="focus-button focus-button-primary absolute right-3 top-3 z-10 min-h-10 px-3 text-xs"
              (click)="closeLightbox()"
              aria-label="Cerrar imagen ampliada"
            >
              Cerrar
            </button>
            <img
              class="mx-auto block h-auto max-h-[82vh] w-auto max-w-full object-contain bg-black"
              [src]="activeItem().image.src"
              [alt]="activeItem().image.alt"
              loading="eager"
              decoding="async"
            >
          </div>
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioSectionComponent implements OnInit, OnDestroy {
  private readonly autoplayMs = 5200;
  readonly items = LANDING_CONFIG.portfolio;
  readonly activeIndex = signal(0);
  readonly lightboxOpen = signal(false);
  readonly activeItem = computed<PortfolioItem>(() => this.items[this.activeIndex()] ?? this.items[0]!);

  private autoplayId?: number;
  private autoplayPaused = false;

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  select(index: number, userAction = false): void {
    this.activeIndex.set(this.normalizeIndex(index));

    if (userAction) {
      this.restartAutoplay();
    }
  }

  next(): void {
    this.select(this.activeIndex() + 1, true);
  }

  previous(): void {
    this.select(this.activeIndex() - 1, true);
  }

  thumbButtonClass(index: number): string {
    const base = 'group grid min-w-0 grid-cols-1 overflow-hidden rounded-[8px] border text-left transition duration-300 lg:grid-cols-[5rem_1fr]';
    return index === this.activeIndex()
      ? `${base} border-focus-orange bg-focus-orange`
      : `${base} border-white/10 bg-black/30`;
  }

  dotButtonClass(index: number): string {
    return index === this.activeIndex()
      ? 'h-2.5 w-8 rounded-full bg-focus-orange transition-all duration-300'
      : 'h-2.5 w-2.5 rounded-full bg-white/25 transition-all duration-300';
  }

  openLightbox(): void {
    this.pauseAutoplay();
    this.lightboxOpen.set(true);
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
    this.resumeAutoplay();
  }

  pauseAutoplay(): void {
    this.autoplayPaused = true;
  }

  resumeAutoplay(): void {
    this.autoplayPaused = false;
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.closeLightbox();
  }

  private normalizeIndex(index: number): number {
    if (!this.items.length) {
      return 0;
    }

    return (index + this.items.length) % this.items.length;
  }

  private startAutoplay(): void {
    if (typeof window === 'undefined' || this.items.length < 2 || this.autoplayId) {
      return;
    }

    this.autoplayId = window.setInterval(() => {
      if (!this.autoplayPaused && !this.lightboxOpen()) {
        this.select(this.activeIndex() + 1);
      }
    }, this.autoplayMs);
  }

  private stopAutoplay(): void {
    if (!this.autoplayId) {
      return;
    }

    window.clearInterval(this.autoplayId);
    this.autoplayId = undefined;
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
