import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { PortfolioContent } from '../models/PortfolioContent.js'

const router = Router()

router.use(requireAuth)

router.get('/me', (req, res) => {
  res.json({ user: req.user })
})

router.get('/portfolio', async (req, res) => {
  const content = await PortfolioContent.findOne({ status: 'published' }).lean()
  res.json({ content })
})

export default router
