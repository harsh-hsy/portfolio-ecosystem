import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { requireAuth } from '../middleware/auth.js'
import { User } from '../models/User.js'
import {
  ensurePublishedPortfolio,
  getEditableFields,
  getPublishedPortfolio,
  updatePortfolioModule,
  replacePublishedPortfolio,
  resetPublishedPortfolio,
  updatePortfolioField,
} from '../services/portfolioContentService.js'
import {
  createDraftProject,
  deleteAdminProject,
  getAdminProject,
  listAdminProjects,
  updateAdminProject,
} from '../services/projectService.js'

const router = Router()

router.use(requireAuth)

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    dateOfBirth: user.dateOfBirth || '',
    role: user.role,
    status: user.status || 'active',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

router.get('/me', (req, res) => {
  res.json({ user: serializeUser(req.user) })
})

router.get('/account', (req, res) => {
  res.json({ user: serializeUser(req.user) })
})

router.put('/account', async (req, res) => {
  const { name, email, phone, dateOfBirth } = req.body

  if (!name?.trim() || !email?.trim()) {
    res.status(400).json({ message: 'Name and email are required' })
    return
  }

  const normalizedEmail = String(email).toLowerCase().trim()
  const existingUser = await User.findOne({
    email: normalizedEmail,
    _id: { $ne: req.user._id },
  })

  if (existingUser) {
    res.status(409).json({ message: 'Email is already in use' })
    return
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: String(name).trim(),
      email: normalizedEmail,
      phone: phone ? String(phone).trim() : '',
      dateOfBirth: dateOfBirth ? String(dateOfBirth).trim() : '',
    },
    { returnDocument: 'after', runValidators: true },
  ).select('-passwordHash')

  res.json({ user: serializeUser(user) })
})

router.put('/account/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: 'Current password and new password are required' })
    return
  }

  if (String(newPassword).length < 8) {
    res.status(400).json({ message: 'New password must be at least 8 characters' })
    return
  }

  const user = await User.findById(req.user._id)
  if (!user || !(await user.verifyPassword(currentPassword))) {
    res.status(401).json({ message: 'Current password is incorrect' })
    return
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12)
  await user.save()

  res.json({ message: 'Password updated successfully' })
})

router.get('/portfolio', async (req, res) => {
  const content = await getPublishedPortfolio()
  res.json({ content })
})

router.get('/projects', async (req, res) => {
  res.json({ projects: await listAdminProjects() })
})

router.post('/projects', async (req, res) => {
  const project = await createDraftProject(req.body.name)
  res.status(201).json({ project })
})

router.get('/projects/:slug', async (req, res) => {
  res.json({ project: await getAdminProject(req.params.slug) })
})

router.put('/projects/:slug', async (req, res) => {
  const project = await updateAdminProject(req.params.slug, req.body)
  res.json({ project })
})

router.delete('/projects/:slug', async (req, res) => {
  const project = await deleteAdminProject(req.params.slug)
  res.json({ project })
})

router.post('/portfolio/initialize', async (req, res) => {
  const content = await ensurePublishedPortfolio()
  res.status(201).json({ content })
})

router.put('/portfolio', async (req, res) => {
  const content = await replacePublishedPortfolio(req.body)
  res.json({ content })
})

router.put('/portfolio/module/:module', async (req, res) => {
  const content = await updatePortfolioModule(req.params.module, req.body)
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
