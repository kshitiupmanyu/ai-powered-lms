/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#edf5ff',
          100: '#c8e0ff',
          200: '#9ec8ff',
          400: '#4d9fff',
          600: '#1a7af0',
          800: '#0d4fa0',
          900: '#082d5c',
        },
        teal: {
          50:  '#e1f5ee',
          400: '#1d9e75',
          600: '#0f6e56',
          800: '#085041',
        }
      }
    }
  },
  plugins: []
}
