export type SectionFlag =
  | 'showHero'
  | 'showAbout'
  | 'showTrailer'
  | 'showBenefits'
  | 'showTestimonials'
  | 'showPortfolio'
  | 'showAudienceFit'
  | 'showResults'
  | 'showPayments'
  | 'showMainCta'
  | 'showFAQ'
  | 'showRegistration'
  | 'showFooter';

export interface LandingSeo {
  title: string;
  description: string;
  image: string;
  url: string;
  keywords: string[];
}

export interface WhatsappConfig {
  groupUrl: string;
  iconUrl: string;
  message: string;
  phoneFallback?: string;
}

export interface VideoGateConfig {
  id: string;
  youtubeId: string;
  title: string;
  eyebrow: string;
  requiredPercentage: number;
  minWatchSecondsBeforeUnlock?: number;
  poster: string;
}

export interface VisitCounterConfig {
  provider: 'localStorage' | 'api';
  storageKey: string;
  apiPath: string;
}

export type PaymentProvider = 'deuna' | 'paypal';

export interface PaymentPlanConfig {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: 'USD';
  included: string[];
}

export interface PaymentMethodConfig {
  provider: PaymentProvider;
  title: string;
  description: string;
  cta: string;
  badge: string;
}

export interface PaymentsConfig {
  eyebrow: string;
  title: string;
  description: string;
  apiPath: string;
  pollIntervalMs: number;
  plan: PaymentPlanConfig;
  methods: PaymentMethodConfig[];
}

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface Benefit {
  title: string;
  description: string;
  metric: string;
}

export type AudienceFitIcon =
  | 'check'
  | 'user'
  | 'chart'
  | 'target'
  | 'team'
  | 'rocket'
  | 'x'
  | 'cap'
  | 'brain'
  | 'wand'
  | 'clock'
  | 'minus';

export interface AudienceFitItem {
  icon: AudienceFitIcon;
  text: string;
}

export interface AudienceFitConfig {
  forTitle: string;
  notForTitle: string;
  forItems: AudienceFitItem[];
  notForItems: AudienceFitItem[];
  summaryTitleLead: string;
  summaryTitleAccent: string;
  summaryDescription: string;
  highlightedWords: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PortfolioItem {
  title: string;
  category: string;
  image: ImageAsset;
}

export type ResultsMetricTone = 'blue' | 'green' | 'orange';

export interface ResultsMetric {
  value: string;
  label: string;
  detail?: string;
  tone: ResultsMetricTone;
}

export type ResultsPillarIcon =
  | 'system'
  | 'strategy'
  | 'content'
  | 'channels'
  | 'crm'
  | 'marketing'
  | 'follow'
  | 'checklist'
  | 'target';

export interface ResultsPillar {
  icon: ResultsPillarIcon;
  title: string;
  accent: string;
}

export interface ResultsConfig {
  eyebrow: string;
  title: string;
  metrics: ResultsMetric[];
  pillars: ResultsPillar[];
  statementLead: string;
  highlightedWords: string[];
  closingLead: string;
  closingAccent: string;
}

export interface LandingConfig {
  brand: {
    name: string;
    slogan: string;
    logoText: string;
    logoUrl: string;
  };
  sections: Record<SectionFlag, boolean>;
  seo: LandingSeo;
  whatsapp: WhatsappConfig;
  hero: {
    title: string;
    subtitle: string;
    kicker: string;
    background: ImageAsset;
    primaryCta: string;
    secondaryCta: string;
  };
  videoGate: VideoGateConfig;
  visitCounter: VisitCounterConfig;
  payments: PaymentsConfig;
  benefits: Benefit[];
  audienceFit: AudienceFitConfig;
  testimonials: Testimonial[];
  portfolio: PortfolioItem[];
  results: ResultsConfig;
  faq: FAQItem[];
}
