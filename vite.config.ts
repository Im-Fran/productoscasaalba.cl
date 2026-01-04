import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import {cloudflare} from "@cloudflare/vite-plugin";
import mkcert from 'vite-plugin-mkcert'
import sassDts from 'vite-plugin-sass-dts'

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [
      mkcert({
        savePath: './.certs',
        hosts: ['local.productoscasaalba.cl']
      }),
      react(),
      tailwindcss(),
      cloudflare(),
      sassDts()
    ],
    css: {
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      allowedHosts: true,
      host: true,
      https: {
        cert: './.certs/cert.pem',
        key: './.certs/dev.pem',
      },
      proxy: {
        '/api': {
          target: process.env.VITE_CMS_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  })
}
