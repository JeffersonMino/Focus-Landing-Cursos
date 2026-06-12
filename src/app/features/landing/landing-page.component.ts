import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { LANDING_CONFIG } from '@core/config/landing.config';
import { VideoGateService } from '@core/services/video-gate.service';
import { VisitCounterService } from '@core/services/visit-counter.service';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { AudienceFitSectionComponent } from './components/audience-fit-section/audience-fit-section.component';
import { BenefitsSectionComponent } from './components/benefits-section/benefits-section.component';
import { CtaSectionComponent } from './components/cta-section/cta-section.component';
import { FaqSectionComponent } from './components/faq-section/faq-section.component';
import { FooterSectionComponent } from './components/footer-section/footer-section.component';
import { HeroSectionComponent, HeroNavigationTarget } from './components/hero-section/hero-section.component';
import { PaymentSectionComponent } from './components/payment-section/payment-section.component';
import { PortfolioSectionComponent } from './components/portfolio-section/portfolio-section.component';
import { RegistrationSectionComponent } from './components/registration-section/registration-section.component';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section.component';
import { TrailerSectionComponent } from './components/trailer-section/trailer-section.component';

@Component({
  selector: 'focus-landing-page',
  standalone: true,
  imports: [
    HeroSectionComponent,
    TrailerSectionComponent,
    // AboutSectionComponent,
    // BenefitsSectionComponent,
    TestimonialsSectionComponent,
    PortfolioSectionComponent,
    AudienceFitSectionComponent,
    //PaymentSectionComponent,
    CtaSectionComponent,
    // FaqSectionComponent,
    // RegistrationSectionComponent,
    FooterSectionComponent
  ],
  template: `
    <main class="min-h-screen overflow-x-hidden bg-black text-white">
      <!-- <landing-hero>
        <purpose>Primera pantalla. Recibe unlocked() para activar o bloquear botones de WhatsApp/Registro.</purpose>
      </landing-hero> -->
      @if (config.sections.showHero) {
        <focus-hero-section
          [unlocked]="unlocked()"
          [visitTotal]="visits.total()"
          (navigate)="handleNavigation($event)"
        />
      }

      <!-- <required-video>
        <purpose>Video obligatorio. Al completarse, VideoGateService cambia unlocked() a true.</purpose>
      </required-video> -->
      @if (config.sections.showTrailer) {
        <section id="trailer" class="focus-band bg-[linear-gradient(180deg,#070006,#120008_45%,#070006)]">
          <focus-trailer-section />
        </section>
      }

      <section
        id="contenido"
        class="gated-shell relative bg-black"
        [class.gated-shell--locked]="!unlocked()"
        aria-live="polite"
      >
        @if (!unlocked()) {
          <!-- <locked-overlay>
            <purpose>Mensaje visible mientras el usuario aun no termina el video obligatorio.</purpose>
          </locked-overlay> -->
          <div class="focus-container sticky top-4 z-30 -mb-24 pt-4">
            <div class="focus-panel mx-auto flex max-w-3xl flex-col gap-4 border-focus-orange/40 bg-black/88 p-5 text-center shadow-glow sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.22em] text-focus-orange">Contenido bloqueado</p>
                <p class="mt-2 text-sm leading-6 text-white/68">
                  Mira el video completo para activar registro, WhatsApp, beneficios y preguntas frecuentes.
                </p>
              </div>
              <button type="button" class="focus-button focus-button-primary shrink-0" (click)="scrollTo('trailer')">
                Volver al video
              </button>
            </div>
          </div>
        }

        <!-- <gated-content>
          <purpose>Contenido comercial bloqueado. pointer-events-none evita clics sin bloquear rueda del mouse o touch scroll.</purpose>
        </gated-content> -->
        <div
          class="gated-content transition duration-700"
          [class.opacity-25]="!unlocked()"
          [class.blur-sm]="!unlocked()"
          [class.pointer-events-none]="!unlocked()"
          [attr.aria-hidden]="!unlocked()"
        >
          <!-- @if (config.sections.showAbout) {
            <focus-about-section />
          }

          @if (config.sections.showBenefits) {
            <focus-benefits-section />
          }-->

          @if (config.sections.showPortfolio) {
            <focus-portfolio-section />
          } 

          @if (config.sections.showTestimonials) {
            <focus-testimonials-section />
          } 

          <!-- <audience-fit-unlocked>
            <purpose>Seccion "Es para ti / No es para ti"; aparece dentro del contenido bloqueado hasta completar el video.</purpose>
          </audience-fit-unlocked> -->
          @if (config.sections.showAudienceFit) {
            <focus-audience-fit-section />
          }

          
          <!-- <payments-unlocked>
            <purpose>Checkout real. Se mantiene dentro del contenido bloqueado para activarse solo al completar el video.</purpose>
          </payments-unlocked> -->
          <!-- @if (config.sections.showPayments) {
            <focus-payment-section />
          } -->

          @if (config.sections.showMainCta) {
            <focus-cta-section [unlocked]="unlocked()" />
          }

          <!-- @if (config.sections.showFAQ) {
            <focus-faq-section />
          }

          @if (config.sections.showRegistration) {
            <focus-registration-section [embedded]="false" />
          } -->
        </div>
      </section>

      @if (config.sections.showFooter) {
        <focus-footer-section />
      }
    </main>
  `,
  styles: [
    `
      .gated-shell--locked {
        max-height: 620px;
        overflow: clip;
      }

      .gated-shell--locked::after {
        position: absolute;
        inset: auto 0 0;
        height: 48%;
        content: '';
        pointer-events: none;
        background: linear-gradient(180deg, transparent, #000 68%);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPageComponent implements OnInit {
  private readonly gate = inject(VideoGateService);
  private readonly document = inject(DOCUMENT);
  readonly visits = inject(VisitCounterService);
  readonly config = LANDING_CONFIG;
  readonly unlocked = this.gate.isCompleted(this.config.videoGate.id);

  ngOnInit(): void {
    this.gate.hydrate(this.config.videoGate.id);
    void this.visits.increment();
  }

  handleNavigation(target: HeroNavigationTarget): void {
    if (target.kind === 'scroll') {
      this.scrollTo(target.id, target.requiresUnlock);
      return;
    }

    if (!this.unlocked()) {
      this.scrollTo('trailer');
      return;
    }

    window.open(this.whatsappHref(), '_blank', 'noopener,noreferrer');
  }

  scrollTo(id: string, requiresUnlock = false): void {
    if (requiresUnlock && !this.unlocked()) {
      this.document.getElementById('trailer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private whatsappHref(): string {
    const separator = this.config.whatsapp.groupUrl.includes('?') ? '&' : '?';
    return `${this.config.whatsapp.groupUrl}${separator}text=${encodeURIComponent(this.config.whatsapp.message)}`;
  }
}


