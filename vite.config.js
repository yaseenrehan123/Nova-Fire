import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Nova-Fire/',
  resolve: {
    alias: {
      events: 'events',
    },
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    include: ['jecs'],
  },
  build: {
    rollupOptions: {
      external: [], // make sure jecs isn't accidentally marked external
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
