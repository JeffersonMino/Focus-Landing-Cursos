import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';

@Directive({
  selector: '[focusReveal]',
  standalone: true
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.elementRef.nativeElement.classList.add('focus-reveal');
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            this.elementRef.nativeElement.classList.add('is-visible');
            this.observer?.disconnect();
          }
        },
        {
          threshold: 0.16,
          rootMargin: '0px 0px -8% 0px'
        }
      );
      this.observer.observe(this.elementRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
