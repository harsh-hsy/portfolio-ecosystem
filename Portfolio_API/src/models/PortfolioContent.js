import mongoose from 'mongoose'

const portfolioContentSchema = new mongoose.Schema(
  {
    profile: { type: mongoose.Schema.Types.Mixed, default: {} },
    socials: { type: [mongoose.Schema.Types.Mixed], default: [] },
    skills: { type: [mongoose.Schema.Types.Mixed], default: [] },
    projects: { type: [mongoose.Schema.Types.Mixed], default: [] },
    certificates: { type: [mongoose.Schema.Types.Mixed], default: [] },
    timeline: { type: [mongoose.Schema.Types.Mixed], default: [] },
    achievements: { type: [String], default: [] },
    milestones: { type: [mongoose.Schema.Types.Mixed], default: [] },
    services: { type: [String], default: [] },
    sections: { type: mongoose.Schema.Types.Mixed, default: {} },
    stats: { type: [mongoose.Schema.Types.Mixed], default: [] },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true },
)

export const PortfolioContent = mongoose.model('PortfolioContent', portfolioContentSchema)
