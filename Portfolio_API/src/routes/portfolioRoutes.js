import { Router } from 'express'
import { PortfolioContent } from '../models/PortfolioContent.js'

const router = Router()

router.get('/', async (req, res) => {
  const content = await PortfolioContent.findOne({ status: 'published' }).lean()
  res.json({ content })
})

export default router
