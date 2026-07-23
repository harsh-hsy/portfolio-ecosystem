import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    issuer: { type: String, default: '', trim: true },
    date: { type: String, default: '', trim: true },
    thumbnail: { type: String, default: '', trim: true },
    file: { type: String, default: '', trim: true },
    credentialUrl: { type: String, default: '', trim: true },
    publicationStatus: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    visible: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, collection: 'certificate_items' },
)

export const Certificate = mongoose.model('Certificate', certificateSchema)
