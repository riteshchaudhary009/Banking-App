/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1220',
        navy: {
          50: '#eef2f9', 100: '#d7e0f0', 200: '#aec0e0', 300: '#84a1d0',
          400: '#5b82c0', 500: '#3a63a3', 600: '#2a4b80', 700: '#1f3a63',
          800: '#162a47', 900: '#0e1c30',
        },
        gold: {
          400: '#e0b95c', 500: '#c99b3a', 600: '#a97f2b',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
