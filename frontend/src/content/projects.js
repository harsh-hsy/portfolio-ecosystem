import { projectSlug } from '../utils/format.js'
import { profile } from './profile.js'

const projectCaseStudyDefaults = {
  problem:
    'The project focuses on turning a common everyday web task into a cleaner, faster, and more approachable browser experience.',
  solution:
    'Harsh designed a responsive interface with simple flows, readable hierarchy, and polished interaction states so users can complete the task without friction.',
  challenges: [
    'Keeping the UI responsive across screen sizes',
    'Balancing visual polish with simple performance',
    'Making the primary action obvious',
  ],
  lessons: [
    'Clear interface hierarchy improves trust',
    'Small interaction details make tools feel more professional',
    'Responsive layouts need to be planned early',
  ],
}

export const baseProjects = [
  {
    id: 'qr-fusion',
    title: 'QR Fusion - Free & Advanced QR Code Generator',
    shortTitle: 'QR Fusion',
    category: 'Tools',
    status: 'completed',
    featured: true,

    desc: 'Generate, customize, and download professional QR codes instantly - free, private, and hassle-free.',

    live: 'https://qrfusion.netlify.app/',
    github: profile.github,

    thumbnail: '/assets/images/qr-fusion/qrfusion-1.png',

    gallery: [
      '/assets/images/qr-fusion/qrfusion-1.png',
      '/assets/images/qr-fusion/qrfusion-2.png',
      '/assets/images/qr-fusion/qrfusion-3.png',
    ],

    // Keep for backward compatibility
    images: [
      '/assets/images/qr-fusion/qrfusion-1.png',
      '/assets/images/qr-fusion/qrfusion-2.png',
      '/assets/images/qr-fusion/qrfusion-3.png',
    ],

    tech: ['HTML', 'CSS', 'JavaScript', 'UI Design'],

    features: [
      'Custom QR styling',
      'Instant download',
      'Privacy-friendly workflow',
      'Responsive utility interface',
    ],
  },

  {
    id: 'typrush',
    title: 'TypRush - Test Your Typing Speed Online',
    shortTitle: 'TypRush',
    category: 'JavaScript',
    status: 'completed',
    featured: true,

    desc: 'Achieve typing excellence with TypeRush - simple, professional, and sound-powered.',

    live: 'https://typrush.netlify.app/',
    github: profile.github,

    thumbnail: '/assets/images/typrush/typrush-1.png',

    gallery: [
      '/assets/images/typrush/typrush-1.png',
      '/assets/images/typrush/typrush-2.png',
      '/assets/images/typrush/typrush-3.png',
    ],

    images: [
      '/assets/images/typrush/typrush-1.png',
      '/assets/images/typrush/typrush-2.png',
      '/assets/images/typrush/typrush-3.png',
    ],

    tech: ['HTML', 'CSS', 'JavaScript', 'Sound UX'],

    features: [
      'Typing speed test',
      'Accuracy feedback',
      'Sound-powered interactions',
      'Focused practice UI',
    ],
  },

  {
    id: 'quickdrivelink',
    title: 'QuickDriveLink - Instant Google Drive Links',
    shortTitle: 'QuickDriveLink',
    category: 'Tools',
    status: 'completed',
    featured: true,

    desc: 'Generate instant direct download links from Google Drive - fast, private, and hassle-free.',

    live: 'https://quickdrivelink.netlify.app/',
    github: profile.github,

    thumbnail: '/assets/images/quickdrivelink/quickdrivelink-1.png',

    gallery: [
      '/assets/images/quickdrivelink/quickdrivelink-1.png',
      '/assets/images/quickdrivelink/quickdrivelink-2.png',
      '/assets/images/quickdrivelink/quickdrivelink-3.png',
    ],

    images: [
      '/assets/images/quickdrivelink/quickdrivelink-1.png',
      '/assets/images/quickdrivelink/quickdrivelink-2.png',
      '/assets/images/quickdrivelink/quickdrivelink-3.png',
    ],

    tech: ['HTML', 'CSS', 'JavaScript', 'Utility UX'],

    features: [
      'Drive link conversion',
      'Clear validation',
      'Fast copy flow',
      'Responsive single-purpose tool',
    ],
  },

  {
    id: 'freshcart',
    title: 'FreshCart - Frontend Shopping Experience',
    shortTitle: 'FreshCart',
    category: 'Frontend',
    status: 'completed',
    featured: true,

    desc: 'Responsive grocery website frontend built with HTML, CSS, and JS - clean design and mobile-ready.',

    live: 'https://codewithharshsingh-freshcart.netlify.app/',
    github: profile.github,

    thumbnail: '/assets/images/freshcart/freshcart-1.png',

    gallery: [
      '/assets/images/freshcart/freshcart-1.png',
      '/assets/images/freshcart/freshcart-2.png',
      '/assets/images/freshcart/freshcart-3.png',
    ],

    images: [
      '/assets/images/freshcart/freshcart-1.png',
      '/assets/images/freshcart/freshcart-2.png',
      '/assets/images/freshcart/freshcart-3.png',
    ],

    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],

    features: [
      'Product browsing layout',
      'Grocery storefront UI',
      'Mobile-ready grids',
      'Clean ecommerce presentation',
    ],
  },

  {
    id: 'weather-app',
    title: 'Weather App',
    shortTitle: 'Weather App',
    category: 'JavaScript',
    status: 'completed',
    featured: false,

    desc: 'Live weather app with light/dark theme, using OpenWeatherMap API and responsive design.',

    live: 'https://codewithharshsingh-weather-app.netlify.app/',
    github: profile.github,

    thumbnail: '/assets/images/weather-app/weather-app-1.png',

    gallery: [
      '/assets/images/weather-app/weather-app-1.png',
      '/assets/images/weather-app/weather-app-2.png',
      '/assets/images/weather-app/weather-app-3.png',
    ],

    images: [
      '/assets/images/weather-app/weather-app-1.png',
      '/assets/images/weather-app/weather-app-2.png',
      '/assets/images/weather-app/weather-app-3.png',
    ],

    tech: ['HTML', 'CSS', 'JavaScript', 'OpenWeatherMap'],

    features: [
      'Live weather data',
      'Theme toggle',
      'City search',
      'Responsive dashboard cards',
    ],
  },

  {
    id: 'calculator',
    title: 'Calculator',
    shortTitle: 'Calculator',
    category: 'JavaScript',
    status: 'completed',
    featured: false,

    desc: 'A simple, responsive calculator built with HTML, CSS, and JavaScript for basic arithmetic operations.',

    live: 'https://codewithharshsingh-calculator.netlify.app/',
    github: profile.github,

    thumbnail: '/assets/images/calculator/calculator-1.png',

    gallery: [
      '/assets/images/calculator/calculator-1.png',
      '/assets/images/calculator/calculator-2.png',
      '/assets/images/calculator/calculator-3.png',
    ],

    images: [
      '/assets/images/calculator/calculator-1.png',
      '/assets/images/calculator/calculator-2.png',
      '/assets/images/calculator/calculator-3.png',
    ],

    tech: ['HTML', 'CSS', 'JavaScript'],

    features: [
      'Basic arithmetic',
      'Keyboard-friendly layout',
      'Responsive sizing',
      'Clean interaction states',
    ],
  },
]

export const projects = baseProjects.map((project) => ({
  ...project,
  slug: projectSlug(project.shortTitle),
  ...projectCaseStudyDefaults,
}))