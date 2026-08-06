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
      keywords: 'Harsh Singh, Harsh Kumar Singh, Harsh HSY, harsh-hsy, harsh.hsy, codewithharshsingh, Frontend Developer, React Developer, JavaScript Developer, MERN Stack Developer, Web Developer, UI Developer, Portfolio, Kanpur, Uttar Pradesh, India, Responsive Web Design, HTML, CSS, JavaScript, React, Vite, Node.js, Express.js, MongoDB, GitHub, QR Fusion, QR Code Generator, harsh-hsy portfolio, harsh-hsy.netlify.app, harsh-hsy.onrender.com',
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
