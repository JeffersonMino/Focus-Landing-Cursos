import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';

export type HeroNavigationTarget =
  | { kind: 'scroll'; id: string; requiresUnlock?: boolean }
  | { kind: 'whatsapp' };

@Component({
  selector: 'focus-hero-section',
  standalone: true,
  template: `
    <section class="relative min-h-[92vh] w-full max-w-full overflow-hidden bg-black">
      <!-- <hero-background>
        <purpose>Imagen visual principal del hero. Se alinea a la derecha y no usa object-cover para evitar pixelado.</purpose>
        <edit>Cambia la ruta en LANDING_CONFIG.hero.background.src.</edit>
      </hero-background> -->
      <img
        class="absolute bottom-0 right-0 h-[68vh] max-h-[640px] w-auto max-w-[72vw] object-contain object-right opacity-36 sm:h-[82vh] sm:max-w-none sm:opacity-70 lg:h-[88vh] lg:opacity-86"
        [src]="config.hero.background.src"
        [alt]="config.hero.background.alt"
        fetchpriority="high"
        decoding="async"
      >
      <div class="absolute inset-0 bg-[linear-gradient(90deg,#070006_0%,rgba(18,0,8,.94)_54%,rgba(18,0,8,.52)_100%)] sm:bg-[linear-gradient(90deg,#070006_0%,rgba(18,0,8,.86)_38%,rgba(18,0,8,.24)_100%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(77,11,34,.5),transparent_34%),radial-gradient(circle_at_72%_24%,rgba(209,45,91,.18),transparent_30%)]"></div>

      <header class="focus-container relative z-10 flex min-h-20 items-center justify-between py-5">
        <!-- <brand-mark>
          <purpose>Marca visible de la landing. El texto viene de LANDING_CONFIG.brand.logoText.</purpose>
        </brand-mark> -->
        <a class="group inline-flex items-center gap-3" href="/" aria-label="FocusComunicacion inicio">
          <span class="grid h-10 w-10 place-items-center rounded-[8px] bg-focus-orange text-lg font-black text-white">R</span>
          <span>
            <span class="block text-sm font-black uppercase tracking-[0.22em] text-white">{{ config.brand.logoText }}</span>
            <span class="block text-[10px] uppercase tracking-[0.22em] text-white/42"></span>
          </span>
        </a>

        <!-- <desktop-navigation>
          <purpose>Accesos superiores. WhatsApp permanece deshabilitado hasta completar el video.</purpose>
          <edit>Para reactivar Registro, descomenta el bloque comentado de abajo.</edit>
        </desktop-navigation> -->
        <nav class="hidden items-center gap-2 md:flex" aria-label="Navegacion principal">
          <button type="button" class="focus-button focus-button-secondary min-h-10 px-4 py-2" (click)="navigate.emit({ kind: 'scroll', id: 'trailer' })">
            Trailer
          </button>
          <!-- <button
            type="button"
            class="focus-button focus-button-secondary min-h-10 px-4 py-2"
            [disabled]="!unlocked()"
            (click)="navigate.emit({ kind: 'scroll', id: 'registro', requiresUnlock: true })"
          >
            Registro
          </button> -->
          <button
            type="button"
            class="focus-button focus-button-primary min-h-10 px-4 py-2"
            [disabled]="!unlocked()"
            (click)="navigate.emit({ kind: 'whatsapp' })"
          >
            <img class="h-4 w-4" [src]="config.whatsapp.iconUrl" alt="" loading="lazy" decoding="async">
            WhatsApp
          </button>
        </nav>
      </header>

      <div class="focus-container relative z-10 grid min-h-[calc(92vh-5rem)] w-full max-w-full items-center pb-14 pt-8 sm:pb-16 sm:pt-10">
        <div class="w-full max-w-4xl min-w-0">
          <!-- <hero-copy>
            <purpose>Texto principal de conversion. Se edita desde LANDING_CONFIG.hero.</purpose>
          </hero-copy> -->
          <p class="focus-eyebrow">{{ config.hero.kicker }}</p>
          <h1 class="mt-6 max-w-full overflow-hidden break-words font-display text-[clamp(2rem,9.2vw,4.5rem)] font-semibold leading-[1.03] text-white sm:max-w-4xl">
            {{ config.hero.title }}
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-white/74 sm:text-xl">
            {{ config.hero.subtitle }}
          </p>

          <div class="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button type="button" class="focus-button focus-button-primary w-full px-4 text-xs tracking-[0.14em] sm:w-auto sm:px-5 sm:text-sm sm:tracking-[0.18em]" (click)="navigate.emit({ kind: 'scroll', id: 'trailer' })">
              {{ config.hero.primaryCta }}
            </button>
            <button
              type="button"
              class="focus-button focus-button-secondary w-full px-4 text-xs tracking-[0.14em] sm:w-auto sm:px-5 sm:text-sm sm:tracking-[0.18em]"
              [disabled]="!unlocked()"
              (click)="navigate.emit({ kind: 'whatsapp' })"
            >
              <img class="h-4 w-4" [src]="config.whatsapp.iconUrl" alt="" loading="lazy" decoding="async">
              {{ config.hero.secondaryCta }}
            </button>
          </div>

          <!-- <hero-metrics>
            <purpose>Datos rapidos del taller. Puedes editar fecha, duracion, modalidad y contador aqui.</purpose>
          </hero-metrics> -->
          <div class="mt-12 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="border-l border-focus-orange/70 bg-black/34 px-4 py-3 backdrop-blur">
              <p class="text-xl font-semibold text-white sm:text-2xl">3 de junio</p>
              <p class="mt-1 text-xs uppercase tracking-[0.18em] text-white/44">fecha del taller</p>
            </div>
            <div class="border-l border-white/16 bg-black/34 px-4 py-3 backdrop-blur">
              <p class="text-xl font-semibold text-white sm:text-2xl">7h</p>
              <p class="mt-1 text-xs uppercase tracking-[0.18em] text-white/44">Duracion</p>
            </div>
             <div class="border-l border-white/16 bg-black/34 px-4 py-3 backdrop-blur">
              <p class="text-xl font-semibold text-white sm:text-2xl">Presencial</p>
              <p class="mt-1 text-xs uppercase tracking-[0.18em] text-white/44">Modalidad</p>
            </div>
            <div class="border-l border-white/16 bg-black/34 px-4 py-3 backdrop-blur">
              <p class="text-xl font-semibold text-white sm:text-2xl">{{ visitTotal() }}</p>
              <p class="mt-1 text-xs uppercase tracking-[0.18em] text-white/44">Visitas registradas</p>
            </div>
          </div>
        </div>
      </div>

      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSectionComponent {
  /**
   * <hero-config>
   *   <purpose>Configuracion editable del hero, marca, textos, WhatsApp e imagen.</purpose>
   * </hero-config>
   */
  readonly config = LANDING_CONFIG;

  /**
   * <unlock-input>
   *   <purpose>Recibe desde LandingPageComponent si el video obligatorio ya fue completado.</purpose>
   *   <default>false bloquea CTAs si el componente se usa sin binding.</default>
   * </unlock-input>
   */
  readonly unlocked = input(false);
  readonly visitTotal = input(0);
  readonly navigate = output<HeroNavigationTarget>();
}
