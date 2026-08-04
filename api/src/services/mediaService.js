import { v2 as cloudinary } from 'cloudinary'
import { env } from '../config/env.js'
import { MediaAsset } from '../models/MediaAsset.js'

const allowedSections = new Set([
  'home',
  'about',
  'skills',
  'projects',
  'certificates',
  'settings',
])

function configurationError() {
  const error = new Error('Cloudinary is not configured on the API')
  error.statusCode = 503
  return error
}

function assertConfigured() {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw configurationError()
  }

  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  })
}

function normalizeSection(value) {
  const section = String(value ?? '').trim().toLowerCase()
  if (!allowedSections.has(section)) {
    const error = new Error('Unsupported media section')
    error.statusCode = 400
    throw error
  }
  return section
}

function sanitizeSigningParameters(input = {}) {
  const blocked = new Set([
    'api_key',
    'cloud_name',
    'file',
    'resource_type',
    'signature',
  ])

  return Object.fromEntries(
    Object.entries(input).filter(([key, value]) => !blocked.has(key) && value !== undefined),
  )
}

function buildDeliveryUrl(publicId, hasCustomCrop) {
  const transformations = []

  if (hasCustomCrop) {
    transformations.push({ crop: 'crop', gravity: 'custom' })
  }

  transformations.push({ quality: 'auto', fetch_format: 'auto' })

  return cloudinary.url(publicId, {
    secure: true,
    resource_type: 'image',
    type: 'upload',
    transformation: transformations,
  })
}

export function getCloudinaryClientConfig() {
  assertConfigured()
  return {
    cloudName: env.cloudinaryCloudName,
    apiKey: env.cloudinaryApiKey,
    folder: env.cloudinaryFolder,
  }
}

export function createUploadSignature(parameters) {
  assertConfigured()
  const sanitized = sanitizeSigningParameters(parameters)
  return cloudinary.utils.api_sign_request(sanitized, env.cloudinaryApiSecret)
}

export async function registerCloudinaryAsset(input = {}) {
  assertConfigured()

  const publicId = String(input.publicId ?? '').trim()
  const originalUrl = String(input.secureUrl ?? '').trim()
  const section = normalizeSection(input.section)
  const hasCustomCrop = Boolean(input.hasCustomCrop)

  if (!publicId || !originalUrl.startsWith('https://res.cloudinary.com/')) {
    const error = new Error('Invalid Cloudinary upload result')
    error.statusCode = 400
    throw error
  }

  const values = {
    url: buildDeliveryUrl(publicId, hasCustomCrop),
    originalUrl,
    publicId,
    assetId: String(input.assetId ?? '').trim(),
    alt: String(input.alt ?? '').trim(),
    section,
    provider: 'cloudinary',
    resourceType: 'image',
    format: String(input.format ?? '').trim(),
    width: Math.max(0, Number(input.width) || 0),
    height: Math.max(0, Number(input.height) || 0),
    bytes: Math.max(0, Number(input.bytes) || 0),
    hasCustomCrop,
  }

  const asset = await MediaAsset.findOneAndUpdate(
    { publicId },
    { $set: values },
    { upsert: true, returnDocument: 'after', runValidators: true },
  )

  return asset.toObject()
}

export async function deleteCloudinaryAsset(id) {
  assertConfigured()
  const asset = await MediaAsset.findById(id)

  if (!asset) {
    const error = new Error('Media asset not found')
    error.statusCode = 404
    throw error
  }

  if (asset.provider === 'cloudinary' && asset.publicId) {
    await cloudinary.uploader.destroy(asset.publicId, {
      resource_type: asset.resourceType || 'image',
      invalidate: true,
    })
  }

  await asset.deleteOne()
  return asset.toObject()
}

function collectReferencedUrls(value, urls = new Set()) {
  if (typeof value === 'string') {
    if (value.startsWith('https://res.cloudinary.com/')) urls.add(value)
    return urls
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectReferencedUrls(item, urls))
    return urls
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectReferencedUrls(item, urls))
  }

  return urls
}

export async function pruneUnreferencedCloudinaryAssets(content) {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) return

  assertConfigured()
  const referencedUrls = collectReferencedUrls(content)
  const assets = await MediaAsset.find({
    provider: 'cloudinary',
    updatedAt: { $lt: new Date(Date.now() - 60 * 60 * 1000) },
  })

  await Promise.all(assets.map(async (asset) => {
    const isReferenced = referencedUrls.has(asset.url) || referencedUrls.has(asset.originalUrl)
    if (isReferenced) return

    try {
      if (asset.publicId) {
        await cloudinary.uploader.destroy(asset.publicId, {
          resource_type: asset.resourceType || 'image',
          invalidate: true,
        })
      }
      await asset.deleteOne()
    } catch (error) {
      console.error(`Unable to remove orphaned Cloudinary asset ${asset.publicId}:`, error.message)
    }
  }))
}
