import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' 
import tailwindcss from '@tailwindcss/vite'   

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  resolve: {
    alias: {
     '@components': '/src/components',
      '@pages': '/src/pages',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@contexts': '/src/contexts',
      '@lib': '/src/lib',
      '@assets': '/src/assets',
    }
  }
})