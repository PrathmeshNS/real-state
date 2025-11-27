import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const port = process.env.PORT ? Number(process.env.PORT) : 5173
  const allowedOnRender = ['.onrender.com']

  return {
    plugins: [react()],
    server: {
      host: true, // bind to 0.0.0.0 so Render preview can access it
      port,
    },
    preview: {
      host: true,
      port,
      // Allow Render subdomains (e.g. real-state-h237.onrender.com)
      allowedHosts: ['localhost', '127.0.0.1', ...allowedOnRender],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
})
