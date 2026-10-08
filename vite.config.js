import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listens on 0.0.0.0, 127.0.0.1, and localhost
    port: 3000,
    open: false
  }
});
