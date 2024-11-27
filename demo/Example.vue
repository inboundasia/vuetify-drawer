<template>
  <h1>Example</h1>
  <div>Pass a title prop {{ title }}</div>
  <div>Count {{ count }}</div>
  <button @click="count++">+</button>
  <button @click="emitMessage">Emit Message</button>
  <button @click="doClose">Close</button>
  <button @click="doPush">Push More</button>
</template>

<script setup>
import { ref, defineAsyncComponent, defineProps, defineEmits, getCurrentInstance } from 'vue';
import useAppDrawer from '../src/composables/useAppDrawer';

defineProps({ title: String });
const emit = defineEmits(['message'])

const count = ref(1)

function emitMessage() {
  emit('message', 'Hello from Example');
}

const $drawer = useAppDrawer();

function doClose() {
  $drawer.pop();
}

function doPush() {
  $drawer.push({
    component: defineAsyncComponent(() => import('./Example.vue')),
    props: {
      title: 'Push More',
    }
  })
}
</script>