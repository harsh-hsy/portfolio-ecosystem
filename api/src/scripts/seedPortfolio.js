import { connectDatabase } from '../db/connect.js'
import { defaultPortfolio } from '../data/defaultPortfolio.js'
import { replacePublishedPortfolio } from '../services/portfolioContentService.js'

async function seedPortfolio() {
  await connectDatabase()

  await replacePublishedPortfolio(defaultPortfolio)

  console.log('Published portfolio content ready')
  process.exit(0)
}

seedPortfolio().catch((error) => {
  console.error('Failed to seed portfolio content')
  console.error(error)
  process.exit(1)
})
