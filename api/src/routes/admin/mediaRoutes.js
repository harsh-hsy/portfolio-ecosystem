import { Router } from 'express'

import {
  createUploadSignature,
  deleteCloudinaryAsset,
  getCloudinaryClientConfig,
  registerCloudinaryAsset,
} from '../../services/mediaService.js'

const router = Router()

router.get('/config', (req, res) => {
  res.json(getCloudinaryClientConfig())
})

router.post('/signature', (req, res) => {
  res.json({ signature: createUploadSignature(req.body?.paramsToSign ?? {}) })
})

router.post('/', async (req, res) => {
  const asset = await registerCloudinaryAsset(req.body)
  res.status(201).json({ asset })
})

router.delete('/:id', async (req, res) => {
  const asset = await deleteCloudinaryAsset(req.params.id)
  res.json({ asset })
})

export default router
