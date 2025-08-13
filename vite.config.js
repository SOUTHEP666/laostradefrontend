import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 用于 HTML fallback
import history from 'connect-history-api-fallback'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [
    vue(),
    {
      // 处理刷新页面 404 问题（仅开发环境或部分部署有效）
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
  server: {
    proxy: isProduction
      ? undefined
      : {
          '/api': {
            target: 'https://laosecom.onrender.com',
            changeOrigin: true,
            secure: false,
            // 保留/api路径前缀，不修改路径
            // rewrite: (path) => path, // 可省略
          },
        },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
