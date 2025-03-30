import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: '#BCCCDC',
        primary_blue: '#3498db',
        true_blue: '#0073cf',
        rice: '#faf5ef',
        milk: '#fdfff5',
        gray_light: '#ecf0f1',
        pastel_yellow: '#fdfd96'
      },
      
      fontFamily: {
        neko: ['NekoFont', 'sans-serif'],
      },

      transitionDuration: {
        '1500': '1500ms',
      }
    },
  },
  plugins: [
    daisyui,
  ],
}

