import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteStaticCopy({
    targets: [
      {
        src: 'src/js/*',
        dest: 'js'
      }
    ],

  }), EnvironmentPlugin({
    // Add your environment variables here
    NODE_ENV: 'production'
  })],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'BTClockWidget',
      fileName: (format) => `btclock-widget.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
