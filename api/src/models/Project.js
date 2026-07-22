import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    shortTitle: { type: String, required: true, trim: true },
    category: { type: String, default: '', trim: true },
    desc: { type: String, default: '', trim: true },
    live: { type: String, default: '', trim: true },
    github: { type: String, default: '', trim: true },
    thumbnail: { type: String, default: '', trim: true },
    images: { type: [String], default: [] },
    tech: { type: [String], default: [] },
    features: { type: [String], default: [] },
    problem: { type: String, default: '', trim: true },
    solution: { type: String, default: '', trim: true },
    challenges: { type: [String], default: [] },
    lessons: { type: [String], default: [] },
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
  { timestamps: true, collection: 'project_items' },
)

export const Project = mongoose.model('Project', projectSchema)
