// src/index.js
import './style.css'
import useAppDrawer from './composables/useAppDrawer';
import AppDrawer from './components/AppDrawer.vue';
import AppDrawerInner from './components/AppDrawerInner.vue';

// Install function to allow the component to be registered globally
const install = (app) => {
  app.component('AppDrawerInner', AppDrawerInner);
  app.component('AppDrawer', AppDrawer);
  app.provide('useAppDrawer', useAppDrawer);
};

// Export the component and install function
export { AppDrawer, AppDrawerInner, useAppDrawer };
