import { FiUser, FiSettings } from 'react-icons/fi'

const quickAccess = [
  {
    id: 'account',
    title: 'Account',
    description: 'Manage your CMS account',
    icon: FiUser,
    path: '/account',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Manage portfolio and CMS settings',
    icon: FiSettings,
    path: '/settings',
  },
]

export default quickAccess
