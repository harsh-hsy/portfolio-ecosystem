import { useState } from "react";

import PanelActions from "../common/PanelActions";

const initialValues = {
  username: "harshsingh",
  email: "harsh@example.com",
};

function AccountInfoSection() {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(initialValues);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleReset() {
    setFormData(initialValues);
  }

  function handleCancel() {
  setFormData(initialValues);

  setIsEditing(false);
}

function handleSave() {
  // Backend integration later

  setIsEditing(false);
}

  return (
    <section className="panel account-section">
      <h2 className="account-section__title">
        Account Information
      </h2>

      <div className="form-group">
        <label
          htmlFor="username"
          className="form-label"
        >
          Username
        </label>

        <input
          id="username"
          name="username"
          className="form-input"
          type="text"
          value={formData.username}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="email"
          className="form-label"
        >
          Email Address
        </label>

        <input
          id="email"
          name="email"
          className="form-input"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>

      {isEditing ? (
        <PanelActions
          primaryLabel="Save Changes"
          secondaryLabel="Reset"
          cancelLabel="Cancel"
          showCancel
          onPrimaryClick={handleSave}
          onSecondaryClick={handleReset}
          onCancelClick={handleCancel}
        />
      ) : (
        <PanelActions
          primaryLabel="Edit"
          primaryType="button"
          showSecondary={false}
          onPrimaryClick={handleEdit}
        />
      )}
    </section>
  );
}

export default AccountInfoSection;