import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import PortfolioApp from './PortfolioApp.jsx'

// The production build contains crawler-readable fallback metadata. Once the
// app starts, Helmet becomes the sole owner of those tags so route changes do
// not leave duplicate SEO elements in the document head.
document.querySelectorAll('[data-build-seo]').forEach((element) => element.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <PortfolioApp />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
