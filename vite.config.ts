import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, 'config'); // Load from config folder
  const env = loadEnv(mode, envDir, 'VITE'); // Ensure VITE-prefixed variables load

  console.log(`🚀 Loaded ENV for mode: ${mode}`);
  console.log(`✅ VITE_BACKEND_URL: ${env.VITE_BACKEND_URL}`);

  return {
    plugins: [react()],
    envDir,
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      'import.meta.env': JSON.stringify(env), // Preserve Vite environment variables
    },
  };
});
