import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'css' })],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 前端请求 /api 代理到后端，使前后端同源（session cookie 可正常携带）
      '/api': {
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
      },
      // 上传的图片等静态资源也代理到后端（app/public）
      '/public': {
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'vuex', 'vuex-persistedstate'],
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
          echarts: ['echarts'],
          axios: ['axios'],
        },
      },
    },
  },
});
