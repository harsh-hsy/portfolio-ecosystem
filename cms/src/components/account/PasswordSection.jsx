import { useMemo, useState } from "react";
import { FiLoader } from "react-icons/fi";

import PasswordForm from "./PasswordForm";
import PasswordInfoPanel from "./PasswordInfoPanel";

import PanelStatus from "../common/PanelStatus";

import {
  PASSWORD_RULES,
  SECURITY_TIPS,
} from "../../data/password";
import { updatePassword } from "../../services/accountService";


const INITIAL_FORM_DATA = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};


function PasswordSection({ isLoading = false, passwordChangedAt = null }) {
  const [isEditing, setIsEditing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [status, setStatus] =
    useState({
      message: "",
      type: "",
    });

  const [errors, setErrors] =
    useState({});


  const [formData, setFormData] =
    useState(INITIAL_FORM_DATA);

  const [latestPasswordChange, setLatestPasswordChange] =
    useState(null);


  const requirements = useMemo(() => {
    return PASSWORD_RULES.map((rule) => ({
      ...rule,
      valid: rule.validator(
        formData.newPassword
      ),
    }));
  }, [formData.newPassword]);



  const passwordsMatch =
    formData.confirmPassword.length === 0
      ? null
      : formData.newPassword ===
        formData.confirmPassword;


  const canSave =
    formData.currentPassword.trim().length > 0 &&
    requirements.every(
      (rule) => rule.valid
    ) &&
    passwordsMatch === true &&
    !isSaving;


  function handleChange(event) {
    const { name, value } =
      event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  }


  function handleEdit() {
    setStatus({
      message: "",
      type: "",
    });

    setIsEditing(true);
  }


  function resetForm() {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
  }


  function handleCancel() {
    resetForm();

    setStatus({
      message: "",
      type: "",
    });

    setIsEditing(false);
  }


  function validateForm() {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword =
        "Current password is required.";
    }


    if (
      formData.newPassword ===
      formData.currentPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password.";
    }


    if (
      !requirements.every(
        (rule) => rule.valid
      )
    ) {
      newErrors.newPassword =
        "Password does not meet requirements.";
    }


    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }


    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  }


  async function handleSave(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }


    setIsSaving(true);

    setStatus({
      message: "Updating password...",
      type: "warning",
    });


    try {
      const response = await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setLatestPasswordChange(response.passwordChangedAt ?? new Date().toISOString());


      setStatus({
        message:
          "Password updated successfully.",
        type: "success",
      });


      resetForm();

      setIsEditing(false);

    } catch (error) {
      setStatus({
        message:
          error.message || "Unable to update password.",
        type: "error",
      });

    } finally {
      setIsSaving(false);
    }
  }


  return (
    <section className="panel account-section">

      <h2 className="account-section__title">
        Password & Security
      </h2>


      <div className="password-layout">

        <PasswordForm
          formData={formData}
          isEditing={isEditing}
          onChange={handleChange}
          onSubmit={handleSave}
          errors={errors}
        />


        <PasswordInfoPanel
          isEditing={isEditing}
          securityTips={SECURITY_TIPS}
          requirements={requirements}
          passwordsMatch={passwordsMatch}
          passwordChangedAt={latestPasswordChange ?? passwordChangedAt}
        />

      </div>


      {status.message && (
  <PanelStatus
    message={status.message}
    type={status.type}
  />
)}


      <div className="password-actions">

        {isEditing ? (
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="btn btn-primary"
              form="password-security-form"
              disabled={!canSave}
            >
              {isSaving ? (
                <>
                  <FiLoader className="spin" />

                  <span>
                    Saving...
                  </span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleEdit}
            disabled={isLoading}
          >
            Change Password
          </button>
        )}

      </div>

    </section>
  );
}


export default PasswordSection;
