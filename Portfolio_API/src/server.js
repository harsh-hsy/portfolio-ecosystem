import app from './app.js'
import { env } from './config/env.js'
import { connectDatabase } from './db/connect.js'

async function startServer() {
  await connectDatabase()
  app.listen(env.port, () => {
    console.log(`Portfolio API listening on http://localhost:${env.port}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start Portfolio API')
  console.error(error)
  process.exit(1)
})
