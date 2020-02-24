import Cog from './Cog.vue'
import PowerOff from './PowerOff.vue'
import Sun from './Sun.vue'
import Wind from './Wind.vue'

const components = { Cog, PowerOff, Sun, Wind }

const IconPlugin = {}

IconPlugin.install = Vue => {
  Vue.mixin({ components })
}

export default IconPlugin
