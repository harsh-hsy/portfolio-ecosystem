import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { cmsIdentity } from './config/cmsIdentity.js'
import { cmsMetadataPlugin } from './config/cmsMetadataPlugin.js'

const metadataDefaults = {
  manifest: cmsIdentity,
  sharing: {
    openGraphTitle: 'Portfolio CMS | Harsh Singh',
    openGraphDescription: 'Private content management dashboard for the Harsh Singh portfolio.',
    twitterCard: 'summary_large_image',
  },
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const apiBaseUrl = String(env.VITE_API_BASE_URL || '').replace(/\/$/, '')

  return {
    plugins: [
      react(),
      cmsMetadataPlugin({ apiBaseUrl, defaults: metadataDefaults }),
    ],
    server: {
      port: 5174,
      proxy: {
        '/api': 'http://localhost:4174',
      },
    },
  }
})
