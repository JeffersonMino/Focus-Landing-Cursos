import { LandingConfig } from '../models/landing.model';

export const LANDING_CONFIG: LandingConfig = {
  /**
   * <brand>
   *   <purpose>Textos base de marca que aparecen en el hero y footer.</purpose>
   * </brand>
   */
  brand: {
    name: 'DaleReset',
    slogan: 'Filmmaking con estrategia, estetica y conversion.',
    logoText: 'Dale-Reset'
  },
  /**
   * <sections>
   *   <purpose>Flags para mostrar u ocultar secciones sin borrar codigo.</purpose>
   *   <edit>Cambia true/false segun lo que quieras publicar.</edit>
   * </sections>
   */
  sections: {
    showHero: true,
    showAbout: true,
    showTrailer: true,
    showBenefits: true,
    showTestimonials: true,
    showPortfolio: true,
    showAudienceFit: true,
    showPayments: true,
    showMainCta: true,
    showFAQ: true,
    showRegistration: true,
    showFooter: true
  },
  /**
   * <seo>
   *   <purpose>Metadata para Google, OpenGraph y previews sociales.</purpose>
   * </seo>
   */
  seo: {
    title: 'Dale reset | NEGOCIO . COMUNICACION . LIDERAZGO',
    description:
      'Masterclass para crear piezas audiovisuales con mirada cinematografica, narrativa comercial y flujo profesional de produccion.',
    image: 'https://focuscomunicacion.com/assets/images/DALERESET.png',
    url: 'https://focuscomunicacion.com/masterclass',
    keywords: [
      'filmmaking',
      'curso audiovisual',
      'masterclass video',
      'produccion audiovisual',
      'dale reset'
    ]
  },
  /**
   * <whatsapp>
   *   <purpose>Enlaces, icono web y mensaje base para los botones de WhatsApp.</purpose>
   *   <edit>Reemplaza groupUrl por el enlace real antes de publicar.</edit>
   * </whatsapp>
   */
  whatsapp: {
    groupUrl: 'https://chat.whatsapp.com/+593992539251',
    iconUrl: 'https://cdn.simpleicons.org/whatsapp/25D366',
    message: 'Hola, quiero mas informacion sobre el curso de DaleReset'
  },
  /**
   * <hero>
   *   <purpose>Texto principal y fondo visual de la primera pantalla.</purpose>
   *   <background>La imagen local se carga desde public/assets/images.</background>
   * </hero>
   */
  hero: {
    kicker: 'Lideres - Empresarios - Emprendedores',
    title: 'TALLER - SISTEMAS DE VENTAS PARA REDES SOCIALES.',
    subtitle:
      'Este taller es para duenos de negocios, emprendedores y equipos que quieren generar resultados en redes sociales',
    primaryCta: 'Ver trailer obligatorio',
    secondaryCta: 'Entrar al grupo',
    background: {
      src: '/assets/images/DALERESET.png',
      alt: 'Arte visual Dale Reset con microfono de podcast en estudio oscuro'
    }
  },
  /**
   * <video-gate>
   *   <purpose>Controla el video obligatorio, porcentaje requerido y poster.</purpose>
   *   <edit>youtubeId y poster deben apuntar al mismo video.</edit>
   * </video-gate>
   */
  videoGate: {
    id: 'masterclass-focus',
    // aqui se pone el id del video a subir a youtube; el sistema gate bloquea CTAs y pagos hasta terminarlo.
    youtubeId: '9FoCWIJN6_A',
    // youtubeId: 'aqz-KE-bpKQ',
    title: 'Mira el video completo para desbloquear tu acceso',
    eyebrow: 'Acceso guiado',
    requiredPercentage: 100,
    minWatchSecondsBeforeUnlock: 50,
    poster: 'https://i.ytimg.com/vi/9FoCWIJN6_A/maxresdefault.jpg'
  },
  /**
   * <visit-counter>
   *   <purpose>Define si el contador usa localStorage o API.</purpose>
   * </visit-counter>
   */
  visitCounter: {
    provider: 'localStorage',
    storageKey: 'focuscomunicacion.visitCounter',
    apiPath: '/visits'
  },
  /**
   * <payments>
   *   <purpose>Configura el checkout desbloqueado despues del video obligatorio.</purpose>
   *   <security>El monto real se vuelve a validar en backend; Angular solo muestra la experiencia.</security>
   *   <edit>Cambia amount, textos y metodos sin tocar los componentes.</edit>
   * </payments>
   */
  payments: {
    eyebrow: 'Inscripcion segura',
    title: 'Reserva tu cupo al taller',
    description:
      'Paga con DeUna QR si estas en Ecuador o usa tarjeta internacional mediante PayPal Checkout.',
    apiPath: '/payments',
    pollIntervalMs: 6000,
    plan: {
      id: 'dale-reset-taller-redes',
      name: 'Taller Dale Reset',
      description: 'Sistema de ventas para redes sociales con enfoque practico y aplicable.',
      amount: 97,
      currency: 'USD',
      included: [
        'Acceso al taller en vivo o grabado',
        'Material de implementacion',
        'Ingreso al grupo privado de WhatsApp',
        'Confirmacion automatica de pago'
      ]
    },
    methods: [
      {
        provider: 'deuna',
        title: 'DeUna QR Ecuador',
        description: 'Genera un QR o deeplink para pagar desde la app DeUna y confirmar por webhook.',
        cta: 'Generar QR DeUna',
        badge: 'Ecuador'
      },
      {
        provider: 'paypal',
        title: 'Tarjeta global / PayPal',
        description: 'Checkout internacional para tarjeta de credito, debito o saldo PayPal.',
        cta: 'Pagar con tarjeta',
        badge: 'Global'
      }
    ]
  },
  benefits: [
    {
      metric: '01',
      title: 'Narrativa con intencion',
      description: 'Estructura tus piezas para retener atencion, crear deseo y guiar al espectador hacia una accion concreta.'
    },
    {
      metric: '02',
      title: 'Produccion filmmaker',
      description: 'Aprende decisiones de luz, lente, composicion, movimiento y ritmo pensadas para proyectos de marca.'
    },
    {
      metric: '03',
      title: 'Flujo comercial',
      description: 'Convierte el brief en guion, rodaje, edicion y entrega con una metodologia clara y replicable.'
    }
  ],
  /**
   * <audience-fit>
   *   <purpose>Datos de la seccion "Es para ti / No es para ti".</purpose>
   *   <edit>Modifica textos e iconos aqui; el componente solo pinta esta informacion.</edit>
   *   <icons>Opciones: check, user, chart, target, team, rocket, x, cap, brain, wand, clock, minus.</icons>
   * </audience-fit>
   */
  audienceFit: {
    forTitle: 'ES PARA TI, SI:',
    notForTitle: 'NO ES PARA TI, SI:',
    forItems: [
      {
        icon: 'user',
        text: 'Quieres vender mas y no sabes por donde empezar.'
      },
      {
        icon: 'chart',
        text: 'Tienes un negocio, emprendimiento o trabajas en ventas y buscas mejores resultados.'
      },
      {
        icon: 'target',
        text: 'Quieres entender como funciona un sistema digital que realmente atrae y convierte clientes.'
      },
      {
        icon: 'team',
        text: 'Tienes o quieres formar un equipo de marketing y ventas alineado con objetivos claros.'
      },
      {
        icon: 'rocket',
        text: 'Quieres implementar lo aprendido con pasos simples y aplicables.'
      }
    ],
    notForItems: [
      {
        icon: 'cap',
        text: 'Buscas un curso academico o teorico para obtener un titulo.'
      },
      {
        icon: 'brain',
        text: 'Solo quieres informacion sin intencion de aplicarla.'
      },
      {
        icon: 'wand',
        text: 'Esperas formulas magicas o resultados inmediatos sin hacer el trabajo.'
      },
      {
        icon: 'clock',
        text: 'No estas dispuesto a invertir tiempo en aprender y mejorar.'
      },
      {
        icon: 'minus',
        text: 'No te interesa mejorar tus ventas ni la relacion con tus clientes.'
      }
    ],
    summaryTitleLead: 'QUE ES',
    summaryTitleAccent: 'ESTE TALLER?',
    summaryDescription:
      'No es un curso especializado. Es un taller practico donde te ensenamos un sistema de ventas comprobado que ya funciona en distintas empresas y negocios.',
    highlightedWords: ['sistema de ventas comprobado']
  },
  testimonials: [
    {
      quote:
        'La clase aterriza la estetica cinematografica en procesos que puedes vender. Salimos con una ruta clara para producir mejor.',
      name: 'Andrea Mora',
      role: 'Productora audiovisual'
    },
    {
      quote:
        'Me ayudo a mirar mis videos como piezas de negocio, no solo como planos bonitos. El cambio se nota en cada propuesta.',
      name: 'Mateo Rivas',
      role: 'Director de contenido'
    },
    {
      quote:
        'La experiencia se siente premium desde el primer minuto. Es tecnica, pero tambien muy enfocada en criterio visual.',
      name: 'Camila Torres',
      role: 'Filmmaker freelance'
    }
  ],
  portfolio: [
    {
      title: 'Lanzamiento de marca',
      category: 'Commercial film',
      image: {
        src: '/assets/images/DALERESET.png',
        alt: 'Imagen local del taller Dale Reset usada como pieza de portfolio'
      }
    },
    {
      title: 'Evento inmersivo',
      category: 'Live experience',
      image: {
        src: '/assets/images/DALERESET.png',
        alt: 'Arte visual Dale Reset para mostrar una experiencia audiovisual'
      }
    },
    {
      title: 'Contenido premium',
      category: 'Social storytelling',
      image: {
        src: '/assets/images/DALERESET.png',
        alt: 'Imagen local Dale Reset para contenido premium del curso'
      }
    }
  ],
  faq: [
    {
      question: 'El video realmente es obligatorio?',
      answer:
        'Si. El funnel esta disenado para desbloquear registro, formularios y CTAs solo cuando el usuario completa el video requerido.'
    },
    {
      question: 'Puedo cambiar el video de YouTube?',
      answer:
        'Si. Cambia youtubeId en src/app/core/config/landing.config.ts y el sistema conserva la logica anti-skip.'
    },
    {
      question: 'La landing esta lista para produccion?',
      answer:
        'Incluye build Angular, Nginx, Docker Compose, API opcional, SEO base, lazy loading y una guia de despliegue en VPS.'
    }
  ]
};
