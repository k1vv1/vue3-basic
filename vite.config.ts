import { defineConfig, loadEnv } from 'vite'
import importToCDN from 'vite-plugin-cdn-import'
import externalGlobals from 'rollup-plugin-external-globals'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const { VITE_PUBLIC_PATH, VITE_BASE_URL, VITE_PORT, VITE_API_DOMAIN } =
    loadEnv(mode, process.cwd())
  return defineConfig({
    publicDir: VITE_PUBLIC_PATH,
    base: VITE_BASE_URL,
    resolve: {
      //设置别名
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      vue(),
      importToCDN({
        modules: [
          {
            name: 'vue',
            var: 'Vue',
            path: `https://unpkg.com/vue@3.2.37/dist/vue.global.js`,
          },
          {
            name: 'vue-demi',
            var: 'VueDemi',
            path: `https://unpkg.com/vue-demi@0.13.8/lib/index.iife.js`,
          },
          {
            name: 'pinia',
            var: 'Pinia',
            path: `https://unpkg.com/pinia@2.0.19/dist/pinia.iife.js`,
          },
          {
            name: 'vue-router',
            var: 'VueRouter',
            path: `https://unpkg.com/vue-router@4.1.3/dist/vue-router.global.js`,
          },
          {
            name: 'axios',
            var: 'axios',
            path: `https://unpkg.com/axios@0.27.2/dist/axios.min.js`,
          },
          {
            name: 'crypto-js',
            var: 'CryptoJS',
            path: `https://unpkg.com/crypto-js@4.1.1/index.js`,
          },
        ],
      }),
    ],
    server: {
      port: Number(VITE_PORT), //启动端口
      hmr: {
        host: '127.0.0.1',
        port: Number(VITE_PORT),
      },
      // 设置 https 代理
      proxy: {
        '/api': {
          target: VITE_API_DOMAIN,
          changeOrigin: true,
          ws: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome61',
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: mode !== 'prod',
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        output: {
          comments: true,
        },
      },
      rollupOptions: {
        external: ['vue', 'vue-demi', 'pinia', 'vue-router', 'crypto-js'],
        plugins: [
          externalGlobals({
            vue: 'Vue',
            'vue-demi': 'VueDemi',
            pinia: 'Pinia',
            'vue-router': 'VueRouter',
            'crypto-js': 'CryptoJS',
          }),
        ],
      },
    },
  })
}
