import { defineConfig } from 'vite';

export default defineConfig({
  build:{
    rollupOptions:{
      input:{
        greenLine:'index.html',
        greaterTaipei:'greater-taipei/index.html',
        developers:'developers/index.html',
      },
    },
  },
});
