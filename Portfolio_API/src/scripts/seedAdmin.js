import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { connectDatabase } from '../db/connect.js'
import { User } from '../models/User.js'

async function seedAdmin() {
  await connectDatabase()

  const email = env.adminEmail.toLowerCase()
  const passwordHash = await bcrypt.hash(env.adminPassword, 12)

  await User.findOneAndUpdate(
    { email },
    {
      name: env.adminName,
      email,
      passwordHash,
      role: 'admin',
    },
    { upsert: true, new: true },
  )

  console.log(`Admin user ready: ${email}`)
  process.exit(0)
}

seedAdmin().catch((error) => {
  console.error('Failed to seed admin user')
  console.error(error)
  process.exit(1)
})
