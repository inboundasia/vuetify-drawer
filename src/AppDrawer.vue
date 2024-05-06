<template>
  <div id="__off-document__drawer">
    <DrawerComponent
      v-for="(component, index) in components"
      :key="index"
      :width="calcWidth(index, component.options || {})"
      :index="index"
      :persistent="component.persistent"
      @pushed="onPushed"
      @closed="onClosed"
    >
      <component
        :is="component.component"
        v-dynamic-events="component.listeners"
        v-bind.sync="component.props"
      />
    </DrawerComponent>
  </div>
</template>

<script>
import Vue from 'vue'
import DrawerComponent from './DrawerComponent'

export default {
  name: 'AppDrawer',
  components: {
    DrawerComponent,
  },
  directives: {
    DynamicEvents: {
      bind: (el, binding, vnode) => {
        const allEvents = binding.value
        if (allEvents) {
          Object.keys(allEvents).forEach((event) => {
            vnode.componentInstance.$on(event, (eventData) => {
              const callback = allEvents[event]
              if (callback) {
                callback(eventData)
              }
            })
          })
        }
      },
    },
  },
  data() {
    return {
      DrawerEventHub: new Vue(),
      components: [],
      instances: [],
    }
  },
  methods: {
    handleEscape(event) {
      if (!this.instances.length) {
        document.removeEventListener('keydown', this.handleEscape)
      } else if (event.key === 'Escape') {
        this.pop()
      }
    },
    onPushed(instance) {
      document.addEventListener('keydown', this.handleEscape)

      this.instances.push(instance)
    },
    onClosed() {
      this.components.splice(-1, 1)
      this.instances.splice(-1, 1)
    },
    close(uuid) {
      const index = this.components.findIndex(
        (component) => component.uuid === uuid
      )
      if (index !== -1) {
        this.instances[index].close()
      }
    },
    push({ component, props, persistent, options, listeners }) {
      const uuid = crypto.randomUUID()
      this.components.push({
        uuid,
        component,
        props,
        options,
        persistent,
        listeners,
      })
      return uuid
    },
    async pop() {
      await this.instances[this.instances.length - 1].close()
    },
    popAll() {
      this.instances = []
      this.components = []
    },
    calcWidth(index, options) {
      if (options.drawerWidth) {
        return options.drawerWidth
      }

      if (this.components.length === 1) {
        return '75%'
      }

      if (index !== this.components.length - 1) {
        return '100%'
      }

      return '75%'
    },
  },
  provide() {
    return {
      DrawerEventHub: this.DrawerEventHub,
    }
  },
}
</script>

<style>
#__off-document__drawer .v-application--wrap {
  min-height: auto;
}
</style>
