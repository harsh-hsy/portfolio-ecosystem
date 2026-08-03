import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiClock,
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

function formatAccountDate(value, fallback = "Not available") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function maskDateOfBirth(value, appendSeparator = true) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length < 2) return digits;

  const day = digits.slice(0, 2);
  if (digits.length === 2) return appendSeparator ? `${day}/` : day;

  const month = digits.slice(2, 4);
  if (digits.length < 4) return `${day}/${month}`;
  if (digits.length === 4) return appendSeparator ? `${day}/${month}/` : `${day}/${month}`;

  return `${day}/${month}/${digits.slice(4)}`;
}

function isValidDateOfBirth(value) {
  if (!value) return true;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return year >= 1900
    && date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
    && date <= today;
}

function isValidPhone(value) {
  if (!value.trim()) return true;
  if (!/^[+\d\s().-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
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
    {
      id: "createdAt",
      label: "Member Since",
      value: formatAccountDate(user.createdAt),
      icon: FiClock,
    },
    {
      id: "lastLoginAt",
      label: "Last Login",
      value: formatAccountDate(user.lastLoginAt, "Recorded after next login"),
      icon: FiClock,
    },
    {
      id: "updatedAt",
      label: "Last Updated",
      value: formatAccountDate(user.updatedAt),
      icon: FiClock,
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
    if (name === "dateOfBirth") {
      const isDeleting = value.length < formData.dateOfBirth.length;
      setFormData((current) => ({
        ...current,
        dateOfBirth: maskDateOfBirth(value, !isDeleting),
      }));
      return;
    }
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setStatus({ message: "Name and email are required.", type: "error" });
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setStatus({
        message: "Enter a valid contact number containing 7 to 15 digits.",
        type: "error",
      });
      return;
    }

    if (!isValidDateOfBirth(formData.dateOfBirth)) {
      setStatus({
        message: "Enter a valid date of birth in DD/MM/YYYY format.",
        type: "error",
      });
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
                type="text"
                value={formData.name}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
