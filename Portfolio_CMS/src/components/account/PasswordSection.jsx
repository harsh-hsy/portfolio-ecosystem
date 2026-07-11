function PasswordSection() {
  return (
    <section className="panel account-section">
      <h2 className="account-section__title">
        Password & Security
      </h2>

      <div className="form-group">
        <label
          htmlFor="current-password"
          className="form-label"
        >
          Current Password
        </label>

        <input
          id="current-password"
          className="form-input"
          type="password"
          placeholder="Enter current password"
          autoComplete="current-password"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="new-password"
          className="form-label"
        >
          New Password
        </label>

        <input
          id="new-password"
          className="form-input"
          type="password"
          placeholder="Enter new password"
          autoComplete="new-password"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="confirm-password"
          className="form-label"
        >
          Confirm Password
        </label>

        <input
          id="confirm-password"
          className="form-input"
          type="password"
          placeholder="Confirm new password"
          autoComplete="new-password"
        />
      </div>
    </section>
  );
}

export default PasswordSection;