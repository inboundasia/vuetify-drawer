import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'

const components = ref([])
const instances = ref([])

export default function useAppDrawer() {
  return {
    components,
    instances,
    push ({ component, props, persistent, options }) {
      const uuid = uuidv4()
      components.value.push({
        uuid,
        component,
        props,
        persistent,
        options,
      })
      return uuid
    },
    async close(componentUuid) {
      const index = components.valie.findIndex(
        (component) => component.uuid === componentUuid
      )
      if (index !== -1) {
        await instances.value[index].close()
      }
    },
    async pop() {
      await instances.value[instances.value.length - 1].close()
    },
    popAll() {
      instances.value = []
      components.value = []
    },
  }
}