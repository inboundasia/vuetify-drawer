import Vue from 'vue'
import DrawerManager from './DrawerManager'
import AppDrawer from './AppDrawer'

const Plugin = {
  install(Vue, options = {}) {
    if (Vue.prototype.$drawer) {
      return
    }

    const Manager = new DrawerManager()

    Object.defineProperty(Vue.prototype, '$drawer', {
      get: function () {
        const caller = this

        if (caller instanceof Vue) {
          const root = caller.$root

          if (!Manager.root) {
            Manager.setDynamicModalContainer(root)
          }
        }

        return Manager
      },
    })

    Vue.mixin({
      beforeRouteLeave(to, from, next) {
        if (this.$drawer) {
          this.$drawer.$offAllEvents()
        }
        next()
      },
    })

    Vue.component('AppDrawer', AppDrawer)
  },
}

export default Plugin
