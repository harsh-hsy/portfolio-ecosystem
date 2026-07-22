import { Project } from '../models/Project.js'
import { validateProjectsContent } from '../validation/projectContent.js'

function httpError(message, statusCode = 400) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanList(value) {
  if (!Array.isArray(value)) return []
  return value.map((item) => String(item).trim()).filter(Boolean)
}

function cleanParagraphList(value) {
  const paragraph = Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean).join(', ')
    : String(value ?? '').trim()

  return paragraph ? [paragraph] : []
}

function serializeProject(project) {
  const value = project?.toObject ? project.toObject() : project
  if (!value) return null

  const { __v, ...serialized } = value
  return serialized
}

function normalizeProject(input, fallback = {}) {
  const images = cleanList(input.images ?? fallback.images)
  const publicationStatus = input.publicationStatus ?? fallback.publicationStatus ?? 'draft'
  const isDraft = publicationStatus === 'draft'

  return {
    title: String(input.title ?? fallback.title ?? '').trim(),
    shortTitle: String(input.shortTitle ?? fallback.shortTitle ?? '').trim(),
    slug: slugify(input.slug ?? fallback.slug),
    category: String(input.category ?? fallback.category ?? '').trim(),
    desc: String(input.desc ?? fallback.desc ?? '').trim(),
    live: String(input.live ?? fallback.live ?? '').trim(),
    github: String(input.github ?? fallback.github ?? '').trim(),
    thumbnail: String(input.thumbnail ?? fallback.thumbnail ?? '').trim() || images[0] || '',
    images,
    tech: cleanList(input.tech ?? fallback.tech),
    features: cleanList(input.features ?? fallback.features),
    problem: String(input.problem ?? fallback.problem ?? '').trim(),
    solution: String(input.solution ?? fallback.solution ?? '').trim(),
    challenges: cleanParagraphList(input.challenges ?? fallback.challenges),
    lessons: cleanParagraphList(input.lessons ?? fallback.lessons),
    publicationStatus,
    visible: isDraft ? false : Boolean(input.visible ?? fallback.visible ?? true),
    featured: isDraft ? false : Boolean(input.featured ?? fallback.featured),
    order: Number.isFinite(Number(input.order ?? fallback.order))
      ? Number(input.order ?? fallback.order)
      : 0,
  }
}

async function uniqueSlug(value, ignoredId) {
  const root = slugify(value) || 'project'
  let candidate = root
  let suffix = 2

  while (await Project.exists({ slug: candidate, ...(ignoredId ? { _id: { $ne: ignoredId } } : {}) })) {
    candidate = `${root}-${suffix}`
    suffix += 1
  }

  return candidate
}

async function validateProjectState(project, ignoredId) {
  if (project.publicationStatus === 'draft') return

  validateProjectsContent({ projects: [project] })

  if (project.featured) {
    const featuredCount = await Project.countDocuments({
      _id: { $ne: ignoredId },
      publicationStatus: 'published',
      visible: true,
      featured: true,
    })
    if (featuredCount >= 6) throw httpError('A maximum of 6 projects can be featured')
  }
}

export async function ensureProjectResources(legacyProjects = []) {
  if (await Project.exists({})) return
  if (!legacyProjects.length) return

  const documents = legacyProjects.map((project, index) =>
    normalizeProject(
      {
        ...project,
        publicationStatus: 'published',
        visible: project.visible !== false,
        order: index,
      },
      project,
    ),
  )

  try {
    await Project.insertMany(documents, { ordered: false })
  } catch (error) {
    if (error?.code !== 11000) throw error
  }
}

export async function replaceProjectResources(projects = []) {
  await Project.deleteMany({})
  await ensureProjectResources(projects)
}

export async function listPublishedProjects() {
  const projects = await Project.find({ publicationStatus: 'published' })
    .sort({ order: 1, createdAt: 1 })
    .lean()
  return projects.map(serializeProject)
}

export async function listAdminProjects() {
  const projects = await Project.find({}).sort({ order: 1, createdAt: 1 }).lean()
  return projects.map(serializeProject)
}

export async function getAdminProject(slug) {
  const project = await Project.findOne({ slug }).lean()
  if (!project) throw httpError('Project not found', 404)
  return serializeProject(project)
}

export async function createDraftProject(name) {
  const title = String(name ?? '').trim()
  if (!title) throw httpError('Project name is required')

  const slug = await uniqueSlug(title)
  const lastProject = await Project.findOne({}).sort({ order: -1 }).select('order').lean()
  const project = await Project.create({
    title,
    shortTitle: title,
    slug,
    publicationStatus: 'draft',
    visible: false,
    featured: false,
    order: (lastProject?.order ?? -1) + 1,
  })

  return serializeProject(project)
}

export async function updateAdminProject(currentSlug, input) {
  const current = await Project.findOne({ slug: currentSlug }).lean()
  if (!current) throw httpError('Project not found', 404)

  const next = normalizeProject(input, current)
  if (!next.title || !next.shortTitle) throw httpError('Project title and card title are required')
  next.slug = await uniqueSlug(next.slug || next.title, current._id)

  if (!next.visible) next.featured = false
  await validateProjectState(next, current._id)

  const project = await Project.findByIdAndUpdate(
    current._id,
    { $set: next },
    { returnDocument: 'after', runValidators: true },
  ).lean()

  return serializeProject(project)
}

export async function deleteAdminProject(slug) {
  const project = await Project.findOneAndDelete({ slug }).lean()
  if (!project) throw httpError('Project not found', 404)
  return serializeProject(project)
}
