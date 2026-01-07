/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
        'dark-brown': '#2d1810',
        'dark-bg': '#1a1a1a',
        'dark-brown-2': '#1a0f0a',
        'cream': '#e8d5b5',
        'light-gold': '#c9a961',
      },
      fontFamily: {
        'deco': ['Georgia', 'serif'],
        'playfair': ['Playfair Display', 'serif'],
        'baskerville': ['Libre Baskerville', 'serif'],
      },
    },
  },
  plugins: [],
}

