import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { portfolioMetadataPlugin } from './config/portfolioMetadataPlugin.js'
import { profile } from './src/content/profile.js'
import { siteSettings } from './src/content/settings.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const defaults = {
    profile,
    settings: siteSettings,
    seo: {
      siteUrl: siteSettings.siteIdentity.portfolioUrl,
      title: siteSettings.socialSharing.openGraphTitle,
      description: siteSettings.socialSharing.openGraphDescription,
      keywords: 'Harsh Singh, frontend developer, React developer, UI engineer',
      author: siteSettings.siteIdentity.authorName,
      bingVerification: '7821903C0AC68D3A01EAD5788B45656C',
      allowIndexing: true,
    },
  }

  return {
    plugins: [
      portfolioMetadataPlugin({ apiBaseUrl: env.VITE_API_BASE_URL, defaults }),
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': 'http://localhost:4174',
      },
    },
    preview: {
      proxy: {
        '/api': 'http://localhost:4174',
      },
    },
  }
})
