<template>
  <div id="__off-document__drawer">
    <AppDrawerInner
      v-for="(component, index) in components"
      :key="component.uuid"
      :width="calcWidth(index, component.options || {})"
      :index="index"
      :persistent="component.persistent || true"
      @pushed="(vNode) => onPushed(vNode, component)"
      @closed="(vNode) => onClosed(vNode, component)"
    >
      <!-- https://v3-migration.vuejs.org/breaking-changes/listeners-removed.html -->
      <!-- https://stackoverflow.com/a/71450781 -->
      <component
        :key="component.uuid"
        :is="component.component"
        v-bind.sync="component.props"
      />
    </AppDrawerInner>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, markRaw } from 'vue';
import AppDrawerInner from './AppDrawerInner.vue';
import useAppDrawer from '../composables/useAppDrawer';
const { components, instances, pop } = useAppDrawer()

const handleEscape = (event) => {
  if (!instances.value.length) {
    document.removeEventListener('keydown', handleEscape);
  } else if (event.key === 'Escape') {
    pop();
  }
};

const onPushed = (instance) => {
  document.addEventListener('keydown', handleEscape);
  instances.value.push(instance);
};

const onClosed = (vNode, component) => {
  const componentIndex = components.value.findIndex((c) => c === component)
  if (componentIndex !== -1) {
    components.value.splice(componentIndex, 1)
  }
  const vNodeIndex = instances.value.findIndex((v) => v === vNode)
  if (vNodeIndex !== -1) {
    instances.value.splice(vNodeIndex, 1)
  }
};

const calcWidth = (index, options) => {
  if (options.drawerWidth) {
    return options.drawerWidth;
  }

  if (components.value.length === 1) {
    return '75%';
  }

  if (index !== components.value.length - 1) {
    return '100%';
  }

  return '75%';
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});

</script>

<style>
#__off-document__drawer .v-application--wrap {
  min-height: auto;
}
</style>
