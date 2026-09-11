import { useState } from 'react'
import { FiEdit3, FiLoader } from 'react-icons/fi'

import { updateAccount } from '../../services/accountService'
import { isValidDateOfBirth, isValidPhone, maskDateOfBirth } from '../../utils/accountDetails'
import PanelStatus from '../common/PanelStatus'
import AccountDetailsForm from './AccountDetailsForm'
import AccountDetailsGrid from './AccountDetailsGrid'

function AccountInfoSection({ user, isLoading = false, onUserChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState({ message: '', type: '' })
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    dateOfBirth: user.dateOfBirth,
  })

  function startEditing() {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
    })
    setStatus({ message: '', type: '' })
    setIsEditing(true)
  }

  function cancelEditing() {
    setStatus({ message: '', type: '' })
    setIsEditing(false)
  }

  function handleChange(event) {
    const { name, value } = event.target
    if (name === 'dateOfBirth') {
      const isDeleting = value.length < formData.dateOfBirth.length
      setFormData((current) => ({
        ...current,
        dateOfBirth: maskDateOfBirth(value, !isDeleting),
      }))
      return
    }

    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      setStatus({ message: 'Name and email are required.', type: 'error' })
      return
    }

    if (!isValidPhone(formData.phone)) {
      setStatus({
        message: 'Enter a valid contact number containing 7 to 15 digits.',
        type: 'error',
      })
      return
    }

    if (!isValidDateOfBirth(formData.dateOfBirth)) {
      setStatus({
        message: 'Enter a valid date of birth in DD/MM/YYYY format.',
        type: 'error',
      })
      return
    }

    setIsSaving(true)
    setStatus({ message: 'Saving account details...', type: 'warning' })

    try {
      const response = await updateAccount(formData)
      onUserChange(response.user)
      setStatus({ message: 'Account details updated successfully.', type: 'success' })
      setIsEditing(false)
    } catch (error) {
      setStatus({
        message: error.message || 'Unable to update account details.',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="panel account-section">
      <div className="account-section__header">
        <h2 className="account-section__title">Account Information</h2>
      </div>

      <AccountDetailsGrid user={user} />

      {isEditing ? (
        <AccountDetailsForm
          formData={formData}
          isSaving={isSaving}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      ) : null}

      {status.message ? <PanelStatus message={status.message} type={status.type} /> : null}

      <div className="account-info-actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelEditing}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              form="account-details-form"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <FiLoader className="spin" /> Saving...
                </>
              ) : (
                'Save Details'
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={startEditing}
            disabled={isLoading}
          >
            <FiEdit3 size={16} /> Edit Details
          </button>
        )}
      </div>
    </section>
  )
}

export default AccountInfoSection
