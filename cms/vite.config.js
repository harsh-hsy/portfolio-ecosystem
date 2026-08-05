import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { cmsMetadataPlugin } from './config/cmsMetadataPlugin.js'

const metadataDefaults = {
  manifest: {
    name: 'Portfolio CMS',
    description: 'Private content management dashboard for the Harsh Singh portfolio.',
    cmsUrl: 'https://harsh-hsy-cms.onrender.com',
  },
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
  const manifestUrl = `${apiBaseUrl}/api/portfolio/cms-manifest.webmanifest`

  return {
    plugins: [
      react(),
      cmsMetadataPlugin({ apiBaseUrl, defaults: metadataDefaults }),
      {
        name: 'cms-manifest-url',
        transformIndexHtml(html) {
          return html.replace('%CMS_MANIFEST_URL%', manifestUrl)
        },
      },
    ],
    server: {
      port: 5174,
      proxy: {
        '/api': 'http://localhost:4174',
      },
    },
  }
})
