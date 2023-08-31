import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'ritual': "url('/images/26.jpg')",
        '01': "url('/images/95.jpg')",
        '02': "url('/images/31.jpg')",
        '03': "url('/images/56.jpg')",
        '04': "url('/images/16.jpg')",
        '05': "url('/images/128.jpg')",
        '06': "url('/images/193.jpg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        '20vh': '20vh',
        '30vh': '30vh',
        '40vh': '40vh',
        '50vh': '50vh',
        '60vh': '60vh',
        '70vh': '70vh',
      },
      margin: {
        'check': '6px',
      }
    },
  },
  plugins: [],
}
export default config
