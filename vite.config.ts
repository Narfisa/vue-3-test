import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [vue(), eslint()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "src/assets/styles/index.scss";
        `
      }
    }
  }
})
