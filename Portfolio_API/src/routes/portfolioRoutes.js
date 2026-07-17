import { Router } from 'express'
import { getPublishedPortfolio } from '../services/portfolioContentService.js'

const router = Router()

router.get('/', async (req, res) => {
  const content = await getPublishedPortfolio()
  res.json({ content })
})

export default router
