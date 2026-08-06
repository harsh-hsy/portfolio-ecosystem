import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'portfolio-api',
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  })
})

export default router