import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import {cloudflare} from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [
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
      proxy: {
        '/api': {
          target: process.env.VITE_CMS_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              // Asegurar que las cookies se envíen en el proxy request
              if (req.headers.cookie) {
                proxyReq.setHeader('cookie', req.headers.cookie);
              }
            });
            proxy.on('proxyRes', (proxyRes, _req, res) => {
              // Manejar las cookies de respuesta, especialmente refresh_token
              const setCookieHeaders = proxyRes.headers['set-cookie'];
              if (setCookieHeaders) {
                // Modificar las cookies para que funcionen correctamente en desarrollo
                const modifiedCookies = setCookieHeaders.map(cookie => {
                  // Para desarrollo local, remover Secure flag si está presente
                  if (process.env.NODE_ENV === 'development') {
                    return cookie.replace(/;\s*Secure/gi, '');
                  }
                  return cookie;
                });
                res.setHeader('set-cookie', modifiedCookies);
              }
            });
          }
        }
      }
    }
  })
}
