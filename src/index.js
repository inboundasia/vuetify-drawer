// src/index.js
import './style.css'
import useAppDrawer from './composables/useAppDrawer';
import AppDrawer from './components/AppDrawer.vue';

// Install function to allow the component to be registered globally
const install = (app) => {
  app.component('AppDrawer', AppDrawer);
  app.component('AppDrawerInner', AppDrawerInner);
};

// Export the component and install function
export default { install };
export { AppDrawer, useAppDrawer };
