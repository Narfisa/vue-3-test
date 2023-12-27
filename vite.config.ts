import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [vue(), eslint()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@assets/styles/index.scss";
        `
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@views': path.resolve(__dirname, './src/views'),
      '@store': path.resolve(__dirname, './src/store'),
      '@typescript': path.resolve(__dirname, './src/typescript'),
      '@plugins': path.resolve(__dirname, './src/plugins')
    },
  },
})
