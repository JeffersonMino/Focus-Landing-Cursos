import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealOnScrollDirective } from '@shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'focus-about-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <section id="curso" class="focus-band border-t border-white/8 bg-[#090006]">
      <div class="focus-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div focusReveal>
          <p class="focus-eyebrow">Sobre el curso</p>
          <h2 class="mt-4 focus-heading">Un metodo para dirigir atencion, no solo camaras.</h2>
        </div>
        <div class="space-y-6" focusReveal>
          <p class="focus-copy">
            FocusComunicacion combina criterio cinematografico con objetivos de negocio: concepto, guion, rodaje, edicion y entrega se ordenan en un sistema que ayuda a producir piezas memorables y medibles.
          </p>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="focus-panel p-5">
              <p class="text-sm font-bold uppercase tracking-[0.18em] text-focus-orange">Para creadores</p>
              <p class="mt-3 text-sm leading-6 text-white/66">
                Construye una mirada premium y un proceso que puedas repetir en proyectos reales.
              </p>
            </div>
            <div class="focus-panel p-5">
              <p class="text-sm font-bold uppercase tracking-[0.18em] text-focus-orange">Para marcas</p>
              <p class="mt-3 text-sm leading-6 text-white/66">
                Entiende como convertir una idea comercial en una pieza audiovisual con deseo y claridad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutSectionComponent {}
