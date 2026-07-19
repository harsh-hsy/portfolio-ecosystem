import PasswordField from "../common/PasswordField";

function PasswordForm({
  formData,
  isEditing,
  onChange,
  onSubmit,
  errors = {},
  children,
}) {
  return (
    <form
  id="password-security-form"
  className="password-form"
  onSubmit={onSubmit}
  noValidate
>
      <PasswordField
        id="current-password"
        name="currentPassword"
        label="Current Password"
        placeholder="Enter current password"
        autoComplete="current-password"
        value={formData.currentPassword}
        onChange={onChange}
        disabled={!isEditing}
        required={isEditing}
        error={errors.currentPassword}
      />

      <PasswordField
        id="new-password"
        name="newPassword"
        label="New Password"
        placeholder="Enter new password"
        autoComplete="new-password"
        value={formData.newPassword}
        onChange={onChange}
        disabled={!isEditing}
        required={isEditing}
        minLength={8}
        error={errors.newPassword}
      />

      <PasswordField
        id="confirm-password"
        name="confirmPassword"
        label="Confirm New Password"
        placeholder="Confirm new password"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={onChange}
        disabled={!isEditing}
        required={isEditing}
        error={errors.confirmPassword}
      />

      {children}
    </form>
  );
}

export default PasswordForm;