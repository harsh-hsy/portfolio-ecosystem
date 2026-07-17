import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  ensurePublishedPortfolio,
  getEditableFields,
  getPublishedPortfolio,
  replacePublishedPortfolio,
  resetPublishedPortfolio,
  updatePortfolioField,
} from '../services/portfolioContentService.js'

const router = Router()

router.use(requireAuth)

router.get('/me', (req, res) => {
  res.json({ user: req.user })
})

router.get('/portfolio', async (req, res) => {
  const content = await getPublishedPortfolio()
  res.json({ content })
})

router.post('/portfolio/initialize', async (req, res) => {
  const content = await ensurePublishedPortfolio()
  res.status(201).json({ content })
})

router.put('/portfolio', async (req, res) => {
  const content = await replacePublishedPortfolio(req.body)
  res.json({ content })
})

router.put('/portfolio/:field', async (req, res) => {
  const content = await updatePortfolioField(req.params.field, req.body.value)
  res.json({ content })
})

router.post('/portfolio/reset', async (req, res) => {
  const content = await resetPublishedPortfolio()
  res.json({ content })
})

router.get('/portfolio-fields', (req, res) => {
  res.json({ fields: getEditableFields() })
})

export default router
