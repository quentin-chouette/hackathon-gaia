import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    envDir: './',
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      MAPBOXTOKEN: JSON.stringify(env.VITE_MAPBOXTOKEN),
    },
  };
});
