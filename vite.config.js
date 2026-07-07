import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  build: {
    // 目标现代浏览器，输出更小的代码
    target: 'es2020',
    // CSS 代码分割
    cssCodeSplit: true,
    // 关闭 sourcemap
    sourcemap: false,
    // Rollup 配置
    rollupOptions: {
      output: {
        // 仅对客户端构建做手动分包；SSR 构建会把 react 等标记为 external，
        // 此时不能将它们写入 manualChunks（会触发 EXTERNAL_MODULES_CANNOT_BE_INCLUDED_IN_MANUAL_CHUNKS）
        manualChunks: isSsrBuild
          ? undefined
          : {
              'react-vendor': ['react', 'react-dom'],
              'radix-vendor': ['@radix-ui/react-select', '@radix-ui/react-slider'],
              'compression': ['browser-image-compression'],
              'image-q': ['image-q'],
            },
      },
    },
    // terser 极限压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        passes: 2,
        collapse_vars: true,
        reduce_vars: true,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
  },
  plugins: [
    react(),
    // Gzip
    compression({ algorithm: 'gzip', exclude: [/\.(png|jpg|ico|svg)$/] }),
    // Brotli（压缩率更高，现代浏览器优先使用）
    compression({ algorithm: 'brotliCompress', exclude: [/\.(png|jpg|ico|svg)$/] }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: '图片压缩工具',
        short_name: '图片压缩',
        description: '免费在线图片压缩，支持 JPEG、PNG、WebP、AVIF，本地处理不上传服务器',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        lang: 'zh-CN',
        start_url: '/',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 预缓存所有构建产物
        globPatterns: ['**/*.{js,css,html,json,xml,txt,webmanifest,ico,png,svg,woff2}'],
        // 运行时缓存策略
        runtimeCaching: [
          {
            // 图片资源：网络优先，离线时用缓存
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ],
}))
