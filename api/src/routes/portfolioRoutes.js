import { Router } from 'express'
import { ensurePublishedPortfolio } from '../services/portfolioContentService.js'

const router = Router()

router.get('/', async (req, res) => {
  const content = await ensurePublishedPortfolio()
  res.json({ content })
})

export default router
