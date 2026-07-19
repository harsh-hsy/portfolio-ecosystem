import mongoose from 'mongoose'

function createModuleModel(modelName, collectionName) {
  const schema = new mongoose.Schema(
    {
      status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published',
        index: true,
      },
      data: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: true, collection: collectionName },
  )

  return mongoose.model(modelName, schema)
}

export const HomeContent = createModuleModel('HomeContent', 'home')
export const AboutContent = createModuleModel('AboutContent', 'about')
export const SkillsContent = createModuleModel('SkillsContent', 'skills')
export const ProjectsContent = createModuleModel('ProjectsContent', 'projects')
export const CertificatesContent = createModuleModel('CertificatesContent', 'certificates')
export const JourneyContent = createModuleModel('JourneyContent', 'journey')
export const MilestonesContent = createModuleModel('MilestonesContent', 'milestones')
export const ServicesContent = createModuleModel('ServicesContent', 'services')
export const AchievementsContent = createModuleModel('AchievementsContent', 'achievements')
export const ContactContent = createModuleModel('ContactContent', 'contact')
export const LinksContent = createModuleModel('LinksContent', 'links')
export const SettingsContent = createModuleModel('SettingsContent', 'settings')
