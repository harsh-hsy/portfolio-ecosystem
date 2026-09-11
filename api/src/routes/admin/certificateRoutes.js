import { Router } from 'express'

import { cleanupUnusedMedia } from '../../services/adminMediaCleanup.js'
import {
  createDraftCertificate,
  deleteAdminCertificate,
  getAdminCertificate,
  listAdminCertificates,
  updateAdminCertificate,
} from '../../services/certificateService.js'
import { getPublishedPortfolio } from '../../services/portfolioContentService.js'

const router = Router()

router.get('/', async (req, res) => {
  await getPublishedPortfolio()
  res.json({ certificates: await listAdminCertificates() })
})

router.post('/', async (req, res) => {
  const certificate = await createDraftCertificate(req.body.name)
  res.status(201).json({ certificate })
})

router.get('/:slug', async (req, res) => {
  await getPublishedPortfolio()
  res.json({ certificate: await getAdminCertificate(req.params.slug) })
})

router.put('/:slug', async (req, res) => {
  const certificate = await updateAdminCertificate(req.params.slug, req.body)
  await cleanupUnusedMedia()
  res.json({ certificate })
})

router.delete('/:slug', async (req, res) => {
  const certificate = await deleteAdminCertificate(req.params.slug)
  await cleanupUnusedMedia()
  res.json({ certificate })
})

export default router
