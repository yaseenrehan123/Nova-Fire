import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      events: 'events', // use npm events polyfill
    }
  },
  define: {
    'process.env': {}, // avoids other Node.js env errors
  }
});
