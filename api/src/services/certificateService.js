import { Certificate } from '../models/Certificate.js'
import { validateCertificatesContent } from '../validation/certificateContent.js'

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

function serializeCertificate(certificate) {
  const value = certificate?.toObject ? certificate.toObject() : certificate
  if (!value) return null

  const { __v, ...serialized } = value
  return serialized
}

function normalizeCertificate(input, fallback = {}) {
  const publicationStatus = input.publicationStatus ?? fallback.publicationStatus ?? 'draft'
  const isDraft = publicationStatus === 'draft'

  return {
    title: String(input.title ?? fallback.title ?? '').trim(),
    issuer: String(input.issuer ?? fallback.issuer ?? '').trim(),
    date: String(input.date ?? fallback.date ?? '').trim(),
    slug: slugify(input.slug ?? fallback.slug ?? input.title ?? fallback.title),
    thumbnail: String(input.thumbnail ?? fallback.thumbnail ?? '').trim(),
    file: String(input.file ?? fallback.file ?? '').trim(),
    credentialUrl: String(input.credentialUrl ?? fallback.credentialUrl ?? '').trim(),
    publicationStatus,
    visible: isDraft ? false : Boolean(input.visible ?? fallback.visible ?? true),
    featured: isDraft ? false : Boolean(input.featured ?? fallback.featured),
    order: Number.isFinite(Number(input.order ?? fallback.order))
      ? Number(input.order ?? fallback.order)
      : 0,
  }
}

async function uniqueSlug(value, ignoredId) {
  const root = slugify(value) || 'certificate'
  let candidate = root
  let suffix = 2

  while (await Certificate.exists({ slug: candidate, ...(ignoredId ? { _id: { $ne: ignoredId } } : {}) })) {
    candidate = `${root}-${suffix}`
    suffix += 1
  }

  return candidate
}

function validateCertificateState(certificate) {
  if (certificate.publicationStatus === 'draft') return
  validateCertificatesContent({ certificates: [certificate] })
}

export async function ensureCertificateResources(legacyCertificates = []) {
  if (await Certificate.exists({})) return
  if (!legacyCertificates.length) return

  const documents = await Promise.all(
    legacyCertificates.map(async (certificate, index) => ({
      ...normalizeCertificate(
        {
          ...certificate,
          publicationStatus: 'published',
          visible: certificate.visible !== false,
          order: index,
        },
        certificate,
      ),
      slug: await uniqueSlug(certificate.slug || certificate.title),
    })),
  )

  try {
    await Certificate.insertMany(documents, { ordered: false })
  } catch (error) {
    if (error?.code !== 11000) throw error
  }
}

export async function replaceCertificateResources(certificates = []) {
  await Certificate.deleteMany({})
  await ensureCertificateResources(certificates)
}

export async function listPublishedCertificates() {
  const certificates = await Certificate.find({
    publicationStatus: 'published',
    visible: true,
  })
    .sort({ order: 1, createdAt: 1 })
    .lean()
  return certificates.map(serializeCertificate)
}

export async function listAdminCertificates() {
  const certificates = await Certificate.find({}).sort({ order: 1, createdAt: 1 }).lean()
  return certificates.map(serializeCertificate)
}

export async function getAdminCertificate(slug) {
  const certificate = await Certificate.findOne({ slug }).lean()
  if (!certificate) throw httpError('Certificate not found', 404)
  return serializeCertificate(certificate)
}

export async function createDraftCertificate(name) {
  const title = String(name ?? '').trim()
  if (!title) throw httpError('Certificate name is required')

  const slug = await uniqueSlug(title)
  const lastCertificate = await Certificate.findOne({}).sort({ order: -1 }).select('order').lean()
  const certificate = await Certificate.create({
    title,
    issuer: '',
    date: '',
    slug,
    publicationStatus: 'draft',
    visible: false,
    featured: false,
    order: (lastCertificate?.order ?? -1) + 1,
  })

  return serializeCertificate(certificate)
}

export async function updateAdminCertificate(currentSlug, input) {
  const current = await Certificate.findOne({ slug: currentSlug }).lean()
  if (!current) throw httpError('Certificate not found', 404)

  const next = normalizeCertificate(input, current)
  if (!next.title) throw httpError('Certificate title is required')
  next.slug = await uniqueSlug(next.slug || next.title, current._id)

  if (!next.visible) next.featured = false
  validateCertificateState(next)

  const certificate = await Certificate.findByIdAndUpdate(
    current._id,
    { $set: next },
    { returnDocument: 'after', runValidators: true },
  ).lean()

  return serializeCertificate(certificate)
}

export async function deleteAdminCertificate(slug) {
  const certificate = await Certificate.findOneAndDelete({ slug }).lean()
  if (!certificate) throw httpError('Certificate not found', 404)
  return serializeCertificate(certificate)
}
