import { FiCalendar, FiClock, FiMail, FiPhone, FiShield, FiUser } from 'react-icons/fi'

function formatAccountDate(value, fallback = 'Not available') {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function AccountDetailsGrid({ user }) {
  const details = [
    { id: 'name', label: 'Name', value: user.name || 'Not set', icon: FiUser },
    { id: 'email', label: 'Email', value: user.email || 'Not set', icon: FiMail },
    { id: 'phone', label: 'Contact Number', value: user.phone || 'Not set', icon: FiPhone },
    {
      id: 'dob',
      label: 'Date of Birth',
      value: user.dateOfBirth || 'Not set',
      icon: FiCalendar,
    },
    {
      id: 'role',
      label: 'Role',
      value: user.role === 'admin' ? 'Administrator' : user.role || 'Admin',
      icon: FiShield,
    },
    {
      id: 'status',
      label: 'Account Status',
      value: user.status === 'active' ? 'Active' : 'Disabled',
      icon: FiShield,
      status: true,
    },
    {
      id: 'createdAt',
      label: 'Member Since',
      value: formatAccountDate(user.createdAt),
      icon: FiClock,
    },
    {
      id: 'lastLoginAt',
      label: 'Last Login',
      value: formatAccountDate(user.lastLoginAt, 'Recorded after next login'),
      icon: FiClock,
    },
    {
      id: 'updatedAt',
      label: 'Last Updated',
      value: formatAccountDate(user.updatedAt),
      icon: FiClock,
    },
  ]

  return (
    <div className="account-info-grid">
      {details.map((item) => {
        const Icon = item.icon
        return (
          <article key={item.id} className="account-info-card">
            <div className="account-info-card__icon">
              <Icon size={20} />
            </div>
            <div className="account-info-card__content">
              <span className="account-info-card__label">{item.label}</span>
              <span
                className={
                  item.status
                    ? 'account-info-card__value account-info-card__value--success'
                    : 'account-info-card__value'
                }
              >
                {item.value}
              </span>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default AccountDetailsGrid
