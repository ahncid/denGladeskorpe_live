import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/denGladeskorpe_live/', 
  plugins: [react()],
});
