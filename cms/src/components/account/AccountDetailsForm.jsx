function AccountDetailsForm({ formData, isSaving, onChange, onSubmit }) {
  return (
    <form id="account-details-form" className="account-edit-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label className="form-group">
          <span className="form-label">Name</span>
          <input
            className="form-input"
            name="name"
            type="text"
            value={formData.name}
            onChange={onChange}
            disabled={isSaving}
            autoComplete="name"
            maxLength={80}
            required
          />
        </label>

        <label className="form-group">
          <span className="form-label">Email</span>
          <input
            className="form-input"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            disabled={isSaving}
            autoComplete="email"
            maxLength={254}
            required
          />
        </label>

        <label className="form-group">
          <span className="form-label">Contact Number</span>
          <input
            className="form-input"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            disabled={isSaving}
            autoComplete="tel"
            inputMode="tel"
            maxLength={32}
            placeholder="+91 98765 43210"
          />
        </label>

        <label className="form-group">
          <span className="form-label">Date of Birth</span>
          <input
            className="form-input"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={onChange}
            disabled={isSaving}
            inputMode="numeric"
            autoComplete="bday"
            maxLength={10}
            placeholder="DD/MM/YYYY"
            aria-describedby="date-of-birth-hint"
          />
          <small id="date-of-birth-hint" className="form-hint">
            Day and month separators are added automatically.
          </small>
        </label>
      </div>
    </form>
  )
}

export default AccountDetailsForm
