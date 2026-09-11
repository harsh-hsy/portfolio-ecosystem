import { ensureCertificateResources, listPublishedCertificates } from './certificateService.js'
import { editorModules, portfolioModules } from './portfolioContentModules.js'
import { composePortfolio, withCodeOwnedIdentity } from './portfolioContentTransforms.js'
import { validatePortfolioModules } from './portfolioContentValidation.js'
import {
  ensureProjectResources,
  listPublishedProjects,
  replaceProjectResources,
} from './projectService.js'

async function readModuleDocuments() {
  const entries = await Promise.all(
    Object.entries(portfolioModules).map(async ([name, definition]) => {
      const document = await definition.model.findOne({ status: 'published' }).lean()
      return [name, document]
    }),
  )

  return Object.fromEntries(entries)
}

async function requireModuleDocuments() {
  const documents = await readModuleDocuments()
  const missingNames = Object.keys(portfolioModules).filter((name) => !documents[name])
  if (missingNames.length === 0) return documents

  const error = new Error(
    `Portfolio content is incomplete. Missing published modules: ${missingNames.join(', ')}`,
  )
  error.statusCode = 503
  throw error
}

async function writeModules(content, names, editorName) {
  const normalizedContent = {
    ...content,
    settings: withCodeOwnedIdentity({
      ...content.settings,
      maintenance: { ...content.settings?.maintenance },
    }),
    sections: { ...content.sections },
  }

  validatePortfolioModules(normalizedContent, names, editorName)

  await Promise.all(
    names.map((name) => {
      const definition = portfolioModules[name]
      if (!definition) {
        const error = new Error(`Unsupported portfolio module: ${name}`)
        error.statusCode = 400
        throw error
      }

      return definition.model.findOneAndUpdate(
        { status: 'published' },
        { $set: { data: definition.extract(normalizedContent), status: 'published' } },
        { upsert: true, returnDocument: 'after', runValidators: true },
      )
    }),
  )
}

export async function getPublishedPortfolio() {
  const content = composePortfolio(await requireModuleDocuments())
  await ensureProjectResources(content.projects)
  await ensureCertificateResources(content.certificates)

  return {
    ...content,
    projects: await listPublishedProjects(),
    certificates: await listPublishedCertificates(),
  }
}

export async function updatePortfolioModule(moduleName, content) {
  const names = editorModules[moduleName]
  if (!names) {
    const error = new Error('Unsupported portfolio module')
    error.statusCode = 400
    throw error
  }

  await requireModuleDocuments()
  await writeModules(content, names, moduleName)
  if (moduleName === 'projects') await replaceProjectResources(content.projects)
  return getPublishedPortfolio()
}
