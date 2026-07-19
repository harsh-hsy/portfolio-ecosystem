import mongoose from 'mongoose'

const mediaAssetSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    section: { type: String, default: 'general' },
    provider: { type: String, enum: ['local', 'cloudinary', 'external'], default: 'external' },
  },
  { timestamps: true },
)

export const MediaAsset = mongoose.model('MediaAsset', mediaAssetSchema)
