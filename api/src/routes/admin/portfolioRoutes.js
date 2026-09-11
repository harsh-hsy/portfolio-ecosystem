import { Router } from 'express'

import { cleanupUnusedMedia } from '../../services/adminMediaCleanup.js'
import {
  getPublishedPortfolio,
  updatePortfolioModule,
} from '../../services/portfolioContentService.js'

const router = Router()

router.get('/', async (req, res) => {
  res.json({ content: await getPublishedPortfolio() })
})

router.put('/module/:module', async (req, res) => {
  const content = await updatePortfolioModule(req.params.module, req.body)
  await cleanupUnusedMedia(content)
  res.json({ content })
})

export default router
