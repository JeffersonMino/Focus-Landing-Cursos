import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LandingSeo } from '../models/landing.model';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(seo: LandingSeo): void {
    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ name: 'keywords', content: seo.keywords.join(', ') });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:image', content: seo.image });
    this.meta.updateTag({ property: 'og:url', content: seo.url });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:image', content: seo.image });
    this.setCanonical(seo.url);
  }

  private setCanonical(url: string): void {
    const selector = 'link[rel="canonical"]';
    const existing = this.document.head.querySelector<HTMLLinkElement>(selector);
    const link = existing ?? this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);

    if (!existing) {
      this.document.head.appendChild(link);
    }
  }
}
