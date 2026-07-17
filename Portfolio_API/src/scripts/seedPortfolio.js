import { connectDatabase } from '../db/connect.js'
import { defaultPortfolio } from '../data/defaultPortfolio.js'
import { PortfolioContent } from '../models/PortfolioContent.js'

async function seedPortfolio() {
  await connectDatabase()

  await PortfolioContent.findOneAndUpdate(
    { status: 'published' },
    {
      ...defaultPortfolio,
      status: 'published',
    },
    { upsert: true, returnDocument: 'after' },
  )

  console.log('Published portfolio content ready')
  process.exit(0)
}

seedPortfolio().catch((error) => {
  console.error('Failed to seed portfolio content')
  console.error(error)
  process.exit(1)
})
