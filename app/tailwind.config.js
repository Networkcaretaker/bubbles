import colors from 'tailwindcss/colors'

// App colour theme.
// Components use these names instead of Tailwind colour names, e.g.
//   bg-brand-900/80   text-accent-400   border-accent-500   text-muted-400
// To change the look of the whole app, point a name at a different palette.
// Any Tailwind palette works: https://v3.tailwindcss.com/docs/customizing-colors
const theme = {
  brand: colors.blue,    // backgrounds, panels, cards, navigation
  accent: colors.cyan,   // borders, titles, icons, buttons, main text
  muted: colors.gray,    // secondary text, subtle panels
  success: colors.green, // completed, saved
  warning: colors.amber, // needs attention
  danger: colors.red,    // errors, delete actions
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: theme,
      fontFamily: {
        'bubble': ['Bubble3D', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
