import { Router } from 'express'

import { requireAuth } from '../middleware/auth.js'
import accountRoutes from './admin/accountRoutes.js'
import certificateRoutes from './admin/certificateRoutes.js'
import mediaRoutes from './admin/mediaRoutes.js'
import portfolioRoutes from './admin/portfolioRoutes.js'
import projectRoutes from './admin/projectRoutes.js'

const router = Router()

router.use(requireAuth)
router.use(accountRoutes)
router.use('/media', mediaRoutes)
router.use('/projects', projectRoutes)
router.use('/certificates', certificateRoutes)
router.use('/portfolio', portfolioRoutes)

export default router
