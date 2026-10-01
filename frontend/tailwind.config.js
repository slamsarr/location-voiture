/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FAF8F5',
          100: '#F4EFE6',
          200: '#E7DCBA',
          300: '#D8C59A',
          400: '#C9AF78',
          500: '#B89B5F', // Champagne Gold Luxe
          600: '#9B7E45',
          700: '#7E6332',
          800: '#634C24',
          900: '#4D3A1B',
        },
        luxe: {
          950: '#07090E', // Fond ultra-sombre profond
          900: '#0C0F17',
          850: '#111520',
          800: '#161C2B',
          750: '#1D2436',
          700: '#262F45',
          border: 'rgba(255, 255, 255, 0.07)',
          borderHover: 'rgba(201, 175, 120, 0.35)',
        },
        brand: {
          50: '#FAF8F5',
          100: '#F4EFE6',
          200: '#E7DCBA',
          300: '#D8C59A',
          400: '#C9AF78',
          500: '#B89B5F',
          600: '#9B7E45',
          700: '#7E6332',
          yellow: '#C9AF78',
          dark: '#07090E',
          card: '#0C0F17',
          border: 'rgba(255, 255, 255, 0.07)'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxe': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'luxe-gold': '0 10px 30px -10px rgba(184, 155, 95, 0.25)',
        'glow-subtle': '0 0 50px -10px rgba(184, 155, 95, 0.12)',
      }
    },
  },
  plugins: [],
}
