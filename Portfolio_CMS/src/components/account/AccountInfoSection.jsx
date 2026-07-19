import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiEdit3,
  FiLoader,
} from "react-icons/fi";

import { useMemo, useState } from "react";

import PanelStatus from "../common/PanelStatus";
import { updateAccount } from "../../services/accountService";

function formatRole(role) {
  return role === "admin" ? "Administrator" : role || "Admin";
}

function formatStatus(status) {
  return status === "active" ? "Active" : "Disabled";
}

function AccountInfoSection({
  user,
  isLoading = false,
  onUserChange,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    dateOfBirth: user.dateOfBirth,
  });

  const accountDetails = useMemo(() => [
    {
      id: "name",
      label: "Name",
      value: user.name || "Not set",
      icon: FiUser,
    },
    {
      id: "email",
      label: "Email",
      value: user.email || "Not set",
      icon: FiMail,
    },
    {
      id: "phone",
      label: "Contact Number",
      value: user.phone || "Not set",
      icon: FiPhone,
    },
    {
      id: "dob",
      label: "Date of Birth",
      value: user.dateOfBirth || "Not set",
      icon: FiCalendar,
    },
    {
      id: "role",
      label: "Role",
      value: formatRole(user.role),
      icon: FiShield,
    },
    {
      id: "status",
      label: "Account Status",
      value: formatStatus(user.status),
      icon: FiShield,
      status: true,
    },
  ], [user]);

  function startEditing() {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      dateOfBirth: user.dateOfBirth || "",
    });
    setStatus({ message: "", type: "" });
    setIsEditing(true);
  }

  function cancelEditing() {
    setStatus({ message: "", type: "" });
    setIsEditing(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setStatus({ message: "Name and email are required.", type: "error" });
      return;
    }

    setIsSaving(true);
    setStatus({ message: "Saving account details...", type: "warning" });

    try {
      const response = await updateAccount(formData);
      onUserChange(response.user);
      setStatus({ message: "Account details updated successfully.", type: "success" });
      setIsEditing(false);
    } catch (error) {
      setStatus({
        message: error.message || "Unable to update account details.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }


  return (
    <section className="panel account-section">

      <div className="account-section__header">

        <h2 className="account-section__title">
          Account Information
        </h2>

      </div>


      <div className="account-info-grid">

        {accountDetails.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.id}
              className="account-info-card"
            >

              <div className="account-info-card__icon">
                <Icon size={20} />
              </div>


              <div className="account-info-card__content">

                <span className="account-info-card__label">
                  {item.label}
                </span>


                <span
                  className={
                    item.status
                      ? "account-info-card__value account-info-card__value--success"
                      : "account-info-card__value"
                  }
                >
                  {item.value}
                </span>

              </div>

            </article>
          );
        })}

      </div>

      {isEditing ? (
        <form id="account-details-form" className="account-edit-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">Name</span>
              <input
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSaving}
              />
            </label>

            <label className="form-group">
              <span className="form-label">Email</span>
              <input
                className="form-input"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSaving}
              />
            </label>

            <label className="form-group">
              <span className="form-label">Contact Number</span>
              <input
                className="form-input"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSaving}
              />
            </label>

            <label className="form-group">
              <span className="form-label">Date of Birth</span>
              <input
                className="form-input"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="01 January 2004"
              />
            </label>
          </div>
        </form>
      ) : null}

      {status.message && (
        <PanelStatus message={status.message} type={status.type} />
      )}


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
                  <FiLoader className="spin" />
                  Saving...
                </>
              ) : (
                "Save Details"
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
            <FiEdit3 size={16} />

            Edit Details
          </button>
        )}

      </div>

    </section>
  );
}


export default AccountInfoSection;
