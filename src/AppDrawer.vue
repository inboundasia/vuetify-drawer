<template>
  <div id="__off-document__drawer">
    <DrawerComponent
      v-for="(component, index) in components"
      :key="component.uuid"
      :width="calcWidth(index, component.options || {})"
      :index="index"
      :uuid="component.uuid"
      :persistent="component.persistent"
      @pushed="(vNode) => onPushed(vNode, component)"
      @closed="(vNode) => onClosed(vNode, component)"
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
import { v4 as uuidv4 } from 'uuid'
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
    onClosed(vNode, component) {
      const componentIndex = this.components.findIndex((c) => c === component)
      if (componentIndex !== -1) {
        this.components.splice(componentIndex, 1)
      }
      const vNodeIndex = this.instances.findIndex((v) => v === vNode)
      if (vNodeIndex !== -1) {
        this.instances.splice(vNodeIndex, 1)
      }
    },
    async close(componentUuid) {
      const index = this.components.findIndex(
        (component) => component.uuid === componentUuid
      )
      if (index !== -1) {
        await this.instances[index].close()
      }
    },
    push({ component, props, persistent, options, listeners }) {
      const uuid = uuidv4()
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
