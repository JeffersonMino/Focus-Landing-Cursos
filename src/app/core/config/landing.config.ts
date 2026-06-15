import { LandingConfig } from '../models/landing.model';

export const LANDING_CONFIG: LandingConfig = {
  /**
   * <brand>
   *   <purpose>Textos base de marca que aparecen en el hero y footer.</purpose>
   * </brand>
   */
  brand: {
    name: 'DaleReset',
    slogan: 'Lideres - Empresarios - Emprendedores',
    logoText: 'Dale Reset un producto de Focus Agencia',
    logoUrl: 'assets/images/Icon focus.png'
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
    showResults: true,
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
    groupUrl: 'https://chat.whatsapp.com/EpqQS9J1iePE1uTg7dYPyM?s=cl&p=a&mlu=1',
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
      'Aprende un sistema de ventas para redes sociales que ya está generando resultados reales. Este no es un taller basado en teoría, sino en experiencias, estrategias y casos de éxito aplicados con clientes que hoy venden más gracias a un proceso comercial estructurado.',
    primaryCta: 'Ver trailer obligatorio',
    secondaryCta: 'Entrar al grupo',
    background: {
      src: 'assets/images/DALERESET.png',
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
        'Excelente taller 😍😍🙌🙌 gracias por todo lo aprendido',
      name: 'Cinthia Luna',
      role: 'Directora Tumbado - Dance Academy'
    },
    {
      quote:
        'Excelente taller!! Muchas gracias chicos todo súper interesante, sigan adelante!! 👌.',
      name: 'Veronica Santos',
      role: 'Jefa de marketing - Vive Medical valle'
    }

  ],
  portfolio: [
    {
      title: 'Participantes trabajando en sus ejercicios',
      category: 'Taller presencial',
      image: {
        src: 'assets/images/taller1/f1.jpeg',
        alt: 'Participantes del taller Dale Reset en una sesion practica'
      }
    },
    {
      title: 'Aprendizaje aplicado',
      category: 'Ejercicios guiados',
      image: {
        src: 'assets/images/taller1/f2.jpeg',
        alt: 'Asistentes aplicando estrategias comerciales en el taller'
      }
    },
    {
      title: 'Estrategia en accion',
      category: 'Sistema comercial',
      image: {
        src: 'assets/images/taller1/f3.jpeg',
        alt: 'Momento de trabajo estrategico durante el taller Dale Reset'
      }
    },
    {
      title: 'Proceso comercial',
      category: 'CRM y ventas',
      image: {
        src: 'assets/images/taller1/f4.jpeg',
        alt: 'Participantes organizando su proceso comercial en el taller'
      }
    },
    {
      title: 'Trabajo practico',
      category: 'Implementacion',
      image: {
        src: 'assets/images/taller1/f5.jpeg',
        alt: 'Trabajo practico guiado en el taller de ventas para redes sociales'
      }
    },
    {
      title: 'Casos reales',
      category: 'Negocio',
      image: {
        src: 'assets/images/taller1/f6.jpeg',
        alt: 'Sesion de casos reales para negocios y emprendedores'
      }
    },
    {
      title: 'Participacion activa',
      category: 'Crecimiento',
      image: {
        src: 'assets/images/taller1/f7.jpeg',
        alt: 'Herramientas de crecimiento comercial aplicadas en clase'
      }
    },
    {
      title: 'Seguimiento constante',
      category: 'Ventas',
      image: {
        src: 'assets/images/taller1/f8.jpeg',
        alt: 'Participantes aprendiendo seguimiento comercial constante'
      }
    },
    {
      title: 'Decisiones comerciales',
      category: 'Estrategia clara',
      image: {
        src: 'assets/images/taller1/f9.jpeg',
        alt: 'Estrategia comercial clara explicada en el taller Dale Reset'
      }
    },
    {
      title: 'Contenido de valor',
      category: 'Redes sociales',
      image: {
        src: 'assets/images/taller1/f10.jpeg',
        alt: 'Contenido de valor aplicado a ventas en redes sociales'
      }
    },
    {
      title: 'Resultados desde la experiencia',
      category: 'Dale Reset',
      image: {
        src: 'assets/images/taller1/f11.jpeg',
        alt: 'Resultados y aprendizaje desde la experiencia del taller'
      }
    }
  ],
  /**
   * <results>
   *   <purpose>Datos de la seccion de resultados: numeros, pilares comerciales y cierre visual.</purpose>
   *   <edit>Actualiza metricas o textos aqui sin tocar el componente.</edit>
   * </results>
   */
  results: {
    eyebrow: 'Resultados comprobados',
    title: 'Caso de éxito',
    metrics: [
      {
        value: '150.000',
        label: 'leads gestionados',
        tone: 'blue'
      },
      {
        value: '13.800',
        label: 'citas agendadas',
        tone: 'green'
      },
      {
        value: 'USD 6',
        label: 'millones',
        detail: 'en oportunidades de consulta',
        tone: 'orange'
      }
    ],
    pillars: [
      // {
      //   icon: 'system',
      //   title: 'Nuestro',
      //   accent: 'Sistema'
      // },
      {
        icon: 'strategy',
        title: 'Estrategia',
        accent: 'clara'
      },
      {
        icon: 'content',
        title: 'Contenido',
        accent: 'de valor'
      },
      {
        icon: 'channels',
        title: 'Canales',
        accent: 'Adecuados'
      },
      {
        icon: 'crm',
        title: 'Ventas CRM o',
        accent: 'Whatsapp'
      },
      {
        icon: 'marketing',
        title: 'Seguimiento y',
        accent: 'ReMarketing'
      }
    ],
    statementLead: 'Estos resultados aparecen cuando se conectan',
    highlightedWords: [
      'nuestro sistema',
      'estrategia clara',
      'contenido de valor',
      'canales adecuados',
      'ventas por CRM o WhatsApp',
      'seguimiento y Remarketing'
    ],
    closingLead: 'Los numeros',
    closingAccent: 'hablan por si solos.'
  },
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
