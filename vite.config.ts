import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 本地开发代理目标：默认指向本机后端，可用 VITE_PROXY_TARGET 覆盖（连测试/预发环境时不改代码）
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://127.0.0.1:7001';

  return {
    // 静态资源基础路径：
    // - 部署在域名根路径（https://example.com/）时保持默认 '/'
    // - 部署在子目录（https://example.com/tkdog/）时设为 '/tkdog/'
    base: env.VITE_BASE || '/',
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
          target: proxyTarget,
          changeOrigin: true,
        },
        // 上传的图片等静态资源也代理到后端（app/public）
        '/public': {
          target: proxyTarget,
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
  };
});
