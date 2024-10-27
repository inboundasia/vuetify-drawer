<!-- demo/App.vue -->
<template>

  <h1>AppDrawer Demo</h1>
  <button @click="doPush">Push</button>

  <ul>
    <li v-for="message in messages">{{ message }}</li>
  </ul>

  <AppDrawer />
</template>
  
<script setup>
import { ref, defineAsyncComponent } from 'vue'
import AppDrawer from '../src/components/AppDrawer.vue';
import useAppDrawer from '../src/composables/useAppDrawer';

const $drawer = useAppDrawer();
const messages = ref([]);

function doPush() {
  $drawer.push({
    component: defineAsyncComponent(() => import('./Example.vue')),
    props: {
      title: 'First Level',
      onMessage: (value) => {
        messages.value.push(`received message: ${value}`);
      },
    }
  })
}
</script>

<style>
/* Add any demo-specific styles here */
</style>