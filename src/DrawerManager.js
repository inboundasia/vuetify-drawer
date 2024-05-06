import Vue from 'vue'
import AppDrawer from './AppDrawer'

export default class {
  constructor() {
    this.instance = undefined
  }

  createInstance() {
    const isInstanceExists = this.isInstanceExists()
    if (!isInstanceExists) {
      const DrawerComponent = Vue.extend(AppDrawer)
      this.instance = new DrawerComponent({
        parent: this.root, // 將此元件的父實例指定為當前組件樹的Vue實例
        $drawer: this,
      }).$mount()
      // document.body.appendChild(this.instance.$el)
      document
        .querySelector('#__nuxt .v-application--wrap')
        .appendChild(this.instance.$el)
    }
  }

  setDynamicModalContainer(root) {
    this.root = root
  }

  isDomReady() {
    return !!document.querySelector('#__off-document__drawer')
  }

  isInstanceExists() {
    return !!this.instance && !!this.isDomReady()
  }

  ensureInstanceExist() {
    const isInstanceExists = this.isInstanceExists()
    if (!isInstanceExists) {
      this.createInstance()
    }
  }

  push({ component, props, persistent, options, listeners }) {
    const defaultPersistent =
      typeof persistent === 'undefined' ? true : persistent
    this.ensureInstanceExist()
    const uuid = crypto.randomUUID()
    this.instance.push({
      uuid,
      component,
      props,
      options,
      listeners,
      persistent: defaultPersistent,
    })
    return uuid
  }

  close(uuid) {
    this.ensureInstanceExist()
    this.instance.close(uuid)
  }

  popAll() {
    this.instance.popAll()
  }

  pop() {
    this.instance.pop()
  }

  $on(event, callback) {
    this.ensureInstanceExist()
    this.instance.DrawerEventHub.$on(event, callback)
  }

  $emit(event, ...params) {
    this.ensureInstanceExist()
    this.instance.DrawerEventHub.$emit(event, ...params)
  }

  $off([event, callback]) {
    const isInstanceExists = this.isInstanceExists()
    if (isInstanceExists) {
      this.instance.DrawerEventHub.$off([event, callback])
    }
  }

  $offAllEvents() {
    const isInstanceExists = this.isInstanceExists()
    if (isInstanceExists) {
      this.instance.DrawerEventHub.$off()
    }
  }
}
