import { useState } from "react";

import {
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

function PasswordField({
  id,
  name,
  label,
  value,
  placeholder,
  autoComplete,
  disabled = false,
  required = false,
  error = "",
  helperText = "",
  minLength,
  maxLength,
  onChange,
}) {
  const [showPassword, setShowPassword] =
    useState(false);


  function handleToggleVisibility() {
    if (disabled) {
      return;
    }

    setShowPassword(
      (previousValue) => !previousValue
    );
  }


  return (
    <div className="form-group">

      <label
        htmlFor={id}
        className="form-label"
      >
        {label}
      </label>


      <div className="password-input-wrapper">

        <input
          id={id}
          name={name}
          className={`form-input ${
            error
              ? "form-input--error"
              : ""
          }`}
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
        />


        <button
          type="button"
          className="password-input-toggle"
          onClick={handleToggleVisibility}
          disabled={disabled}
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          aria-pressed={showPassword}
        >
          {showPassword ? (
            <FiEyeOff />
          ) : (
            <FiEye />
          )}
        </button>

      </div>


      {helperText && !error && (
        <p className="field-helper">
          {helperText}
        </p>
      )}


      {error && (
        <p className="field-error">
          {error}
        </p>
      )}

    </div>
  );
}

export default PasswordField;