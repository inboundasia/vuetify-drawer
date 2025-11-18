import { ref, markRaw } from 'vue'

const components = ref([])
const instances = ref([])

// Use native crypto.randomUUID() if available, otherwise fallback to a simple UUID v4 generator
function generateUUID() {
  // Try browser crypto API
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID()
  }
  // Try Node.js crypto module (for SSR/build time)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback: Generate UUID v4 compatible string
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export default function useAppDrawer() {
  return {
    components,
    instances,
    push ({ component, props, persistent, options }) {
      const uuid = generateUUID()
      components.value.push({
        uuid,
        component: markRaw(component),
        props,
        persistent,
        options,
      })
      return uuid
    },
    async close(componentUuid) {
      const index = components.value.findIndex(
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