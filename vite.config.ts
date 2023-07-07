import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'https://localhost:5050',
        changeOrigin: true,
      }
    }
  }
})
