import { Router } from 'express'

import { cleanupUnusedMedia } from '../../services/adminMediaCleanup.js'
import {
  createDraftProject,
  deleteAdminProject,
  getAdminProject,
  listAdminProjects,
  updateAdminProject,
} from '../../services/projectService.js'

const router = Router()

router.get('/', async (req, res) => {
  res.json({ projects: await listAdminProjects() })
})

router.post('/', async (req, res) => {
  const project = await createDraftProject(req.body.name)
  res.status(201).json({ project })
})

router.get('/:slug', async (req, res) => {
  res.json({ project: await getAdminProject(req.params.slug) })
})

router.put('/:slug', async (req, res) => {
  const project = await updateAdminProject(req.params.slug, req.body)
  await cleanupUnusedMedia()
  res.json({ project })
})

router.delete('/:slug', async (req, res) => {
  const project = await deleteAdminProject(req.params.slug)
  await cleanupUnusedMedia()
  res.json({ project })
})

export default router
