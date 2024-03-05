import VitePluginSass from 'vite-plugin-sass';
// eslint-disable-next-line no-undef
const defaultTheme = require('tailwindcss/defaultTheme')
// eslint-disable-next-line no-undef
const { nextui } = require("@nextui-org/react");


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {
      'xs': '570px',
      ...defaultTheme.screens,
    },
    extend: {},
  },
  darkMode: "class",
  plugins: [
    VitePluginSass({
      // Options de configurations pour sass a mettre ici
    }),
    nextui()
  ],
}