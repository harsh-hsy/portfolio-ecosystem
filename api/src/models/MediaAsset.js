import mongoose from 'mongoose'

const mediaAssetSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    originalUrl: { type: String, default: '' },
    publicId: { type: String, default: '', trim: true, index: true },
    assetId: { type: String, default: '', trim: true },
    alt: { type: String, default: '' },
    section: { type: String, default: 'general' },
    provider: { type: String, enum: ['local', 'cloudinary', 'external'], default: 'external' },
    resourceType: { type: String, default: 'image' },
    format: { type: String, default: '' },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    bytes: { type: Number, default: 0 },
    hasCustomCrop: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const MediaAsset = mongoose.model('MediaAsset', mediaAssetSchema)
