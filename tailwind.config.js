const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./client/**/*.html', './client/**/*.vue'],
  theme: {
    fontFamily: {
      ...fontFamily,
      sans: ['Raleway', ...fontFamily.sans],
    },
    container: { center: true, padding: '1.5rem' },
    aspectRatio: {
      '1/1': [1, 1],
      '2/1': [2, 1],
      '3/2': [3, 2],
      '4/3': [4, 3],
      '16/9': [16, 9],
      '21/9': [21, 9],
    },
    extend: {
      borderRadius: { xl: '12px' },
      colors: { primary: '#6CAEFC', lightgray: '#868686', lightblue: '#6CAEFC', warn: '#FF7272' },
      fontSize: { base: '14px' },
      inset: { '1/2': '50%' },
      scale: { 70: '.7' },
      zIndex: { '-1': '-1' },
    },
  },
  plugins: [
    require('tailwindcss-interaction-variants'),
    require('tailwindcss-pseudo-elements'),
    require('tailwindcss-aspect-ratio'),
  ],
  corePlugins: {},
}
