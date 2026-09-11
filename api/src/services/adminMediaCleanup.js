import { listAdminCertificates } from './certificateService.js'
import { pruneUnreferencedCloudinaryAssets } from './mediaService.js'
import { getPublishedPortfolio } from './portfolioContentService.js'
import { listAdminProjects } from './projectService.js'

export async function cleanupUnusedMedia(content) {
  const portfolio = content ?? (await getPublishedPortfolio())
  const [projects, certificates] = await Promise.all([listAdminProjects(), listAdminCertificates()])
  await pruneUnreferencedCloudinaryAssets({ content: portfolio, projects, certificates })
}
