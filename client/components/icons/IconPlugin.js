import Close from './Close.vue'
import Cog from './Cog.vue'
import Home from './Home.vue'
import PowerOff from './PowerOff.vue'
import Sun from './Sun.vue'
import Wind from './Wind.vue'
import Warn from './Warn.vue'

const components = { Close, Cog, PowerOff, Sun, Wind, Home, Warn }

const IconPlugin = {}

IconPlugin.install = Vue => {
  Vue.mixin({ components })
}

export default IconPlugin
