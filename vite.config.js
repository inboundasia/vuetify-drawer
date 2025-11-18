// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'VuetifyDrawer',
      fileName: (format) => `vuetify-drawer.${format}.js`,
      formats: ['es', 'umd'], // Ensure both ES module and UMD builds
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  // Development server config
  server: {
    open: true, // Automatically open in browser
  },
});