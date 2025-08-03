import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 用于 HTML fallback
import history from 'connect-history-api-fallback'

export default defineConfig({
  plugins: [
    vue(),
    {
      // 处理刷新页面 404 问题（仅在开发或某些部署中起作用）
      name: 'html-fallback',
      configureServer(server) {
        server.middlewares.use(
          history({
            disableDotRule: true,
            htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
          })
        )
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
