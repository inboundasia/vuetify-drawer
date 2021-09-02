import Vue from 'vue'
import DrawerManager from './DrawerManager'

export default ({ app }, inject) => {
  inject(
    'drawer',
    new DrawerManager({
      vuetify: app.vuetify,
      store: app.store,
      $axios: app.$axios,
      $dialog: app.$dialog,
    })
  )

  Vue.mixin({
    beforeRouteLeave(to, from, next) {
      if (this.$drawer) {
        this.$drawer.$offAllEvents()
      }
      next()
    },
  })
}
