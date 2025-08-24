import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'mobile': '388px',
      'sm':	'640px',
      'md':	'768px',
      'lg':	'1024px',
      'xl':	'1280px',
      '2xl': '1536px',
    },
    minHeight: {
      '10vh': '10vh',
    },
    extend: {
      zIndex: {
        '60': '60',
        '80': '80',
      },
      backgroundImage: {
        'ritual': "url('/images/26.jpg')",
        '01': "url('/images/wallpapers/95.jpg')",
        '02': "url('/images/wallpapers/31.jpg')",
        '03': "url('/images/wallpapers/56.jpg')",
        '04': "url('/images/wallpapers/16.jpg')",
        '05': "url('/images/wallpapers/128.jpg')",
        '06': "url('/images/wallpapers/193.jpg')",
        '07': "url('/images/wallpapers/175.jpg')",
        '08': "url('/images/wallpapers/122.jpg')",
        '09': "url('/images/wallpapers/24.jpg')",
        '10': "url('/images/wallpapers/45.jpg')",
        '11': "url('/images/wallpapers/78.jpg')",
        '12': "url('/images/wallpapers/0001.png')",
        'boca': "url('/images/Pedra da Boca.jpg')",
        'boca01': "url('/images/Pedra da Boca01.png')",
        "filters": "url('/images/wallpapers/filters.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'gray-whats': '#202C33',
        'green-whats': '#005C4B',
        'green-whats-dark': '#013027',
        'gray-whats-dark': '#0c1114',
      },
      spacing: {
        '10vh': '10vh',
        '15vh': '15vh',
        '20vh': '20vh',
        '30vh': '30vh',
        '35vh': '35vh',
        '40vh': '40vh',
        '50vh': '50vh',
        '55vh': '55vh',
        '60vh': '60vh',
        '65vh': '65vh',
        '70vh': '70vh',
        '75vh': '75vh',
        '80vh': '80vh',
        '85vh': '85vh',
        '90vh': '90vh',
        '50vw': '50vw',
      },
    },
  },
  plugins: [],
}
export default config