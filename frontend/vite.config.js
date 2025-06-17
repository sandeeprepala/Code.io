import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-node-polyfills';
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
  proxy: {
    '/api': 'http://localhost:8000',
  },
},
  plugins: [react()],
})
