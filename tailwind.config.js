module.exports = {
  theme: {
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
      color: { primary: { default: '#6CAEFC' }, gray: { default: '#868686' } },
      zIndex: { '-1': '-1' },
      inset: { '1/2': '50%' },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'hocus'],
    borderColor: ['responsive', 'hover', 'focus', 'hocus', 'focus-within'],
    content: ['before', 'after'],
    flex: ['responsive', 'before', 'after'],
    opacity: ['responsive', 'hover', 'focus', 'hocus', 'focus-within', 'group-hocus'],
    order: ['before', 'after'],
    textColor: ['responsive', 'hover', 'focus', 'hocus'],
    textDecoration: ['responsive', 'hover', 'focus', 'hocus'],
  },
  plugins: [
    require('tailwindcss-interaction-variants'),
    require('tailwindcss-pseudo-elements'),
    require('tailwindcss-aspect-ratio'),
  ],
  corePlugins: {},
}
