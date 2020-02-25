const plugins = {
  'postcss-import': {},
  tailwindcss: {},
  autoprefixer: {},
}

const pluginsProduction = {
  '@fullhuman/postcss-purgecss': {
    content: ['./client/**/*.html', './client/**/*.vue'],
    defaultExtractor: content => content.match(/[\w-/:.]+(?<!:)/g) || [],
  },
}

module.exports = {
  plugins: { ...plugins, ...(process.env.NODE_ENV === 'production' && pluginsProduction) },
}
