import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import {cloudflare} from "@cloudflare/vite-plugin";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [
      basicSsl({
        name: 'localhost',
        certDir: '.certs'
      }),
      react(),
      tailwindcss(),
      cloudflare(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      allowedHosts: true,
      host: true,
      https: {
        cert: './.certs/_cert.pem',
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
