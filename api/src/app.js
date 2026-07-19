import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { corsOptions } from './config/cors.js'
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import portfolioRoutes from './routes/portfolioRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

app.use(cors(corsOptions))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/admin', adminRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
