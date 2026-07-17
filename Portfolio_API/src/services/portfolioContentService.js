import { defaultPortfolio } from '../data/defaultPortfolio.js'
import { PortfolioContent } from '../models/PortfolioContent.js'

const editableFields = new Set([
  'profile',
  'socials',
  'skills',
  'projects',
  'certificates',
  'timeline',
  'achievements',
  'milestones',
  'services',
  'sections',
  'stats',
])

export function getEditableFields() {
  return [...editableFields]
}

export function isEditableField(field) {
  return editableFields.has(field)
}

export async function getPublishedPortfolio() {
  return PortfolioContent.findOne({ status: 'published' }).lean()
}

export async function ensurePublishedPortfolio() {
  const existing = await PortfolioContent.findOne({ status: 'published' })
  if (existing) return existing

  return PortfolioContent.create({
    ...defaultPortfolio,
    status: 'published',
  })
}

export async function updatePortfolioField(field, value) {
  if (!isEditableField(field)) {
    const error = new Error('Unsupported portfolio field')
    error.statusCode = 400
    throw error
  }

  return PortfolioContent.findOneAndUpdate(
    { status: 'published' },
    { $set: { [field]: value } },
    { upsert: true, returnDocument: 'after' },
  ).lean()
}

export async function replacePublishedPortfolio(content) {
  return PortfolioContent.findOneAndUpdate(
    { status: 'published' },
    {
      ...content,
      status: 'published',
    },
    { upsert: true, returnDocument: 'after' },
  ).lean()
}

export async function resetPublishedPortfolio() {
  return replacePublishedPortfolio(defaultPortfolio)
}
