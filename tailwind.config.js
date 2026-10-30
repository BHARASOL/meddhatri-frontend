/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          tealBright: '#2DC4B4',
          navy: '#1B5F85',
          dark: '#154E70',
          red: '#E53935',
          teal: '#2DC4B4',
          tealHover: '#25A89A',
          tealDark: '#1B5F85',
          mint: '#E0F7F5',
          mintLight: '#F0FDFC',
          slate: '#2E6B8A',
          lightBg: '#F7FBFC'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(27, 95, 133, 0.07)',
        'premium': '0 10px 30px -10px rgba(27, 95, 133, 0.14)',
        'glow': '0 0 20px rgba(45, 196, 180, 0.18)'
      }
    },
  },
  plugins: [],
}
