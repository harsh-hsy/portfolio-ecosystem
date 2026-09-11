import { Router } from 'express'
import { getPublishedPortfolio } from '../services/portfolioContentService.js'

const router = Router()

router.get('/', async (req, res) => {
  const content = await getPublishedPortfolio()
  // Portfolio content is edited independently of the frontend deployment. Do not
  // let a browser or an intermediate CDN keep serving the previous CMS snapshot.
  res
    .set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    })
    .json({ content })
})

export default router
