import { useId } from "react";
import { FiChevronDown } from "react-icons/fi";

function FormField({
  label,
  name,
  error = "",
  helpText = "",
  as = "input",
  options = [],
  className = "",
  required = false,
  children,
  ...controlProps
}) {
  const generatedId = useId();
  const id = controlProps.id || `${name || "field"}-${generatedId}`;
  const describedBy = [
    helpText ? `${id}-help` : "",
    error ? `${id}-error` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const fieldClassName = [
    "form-group",
    className,
    error ? "form-group--error" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const sharedProps = {
    ...controlProps,
    id,
    name,
    required,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy || undefined,
    className: `form-input ${as === "textarea" ? "form-textarea" : ""}`.trim(),
  };

  return (
    <label className={fieldClassName} htmlFor={id}>
      <span className="form-label">
        {label}
        {required ? <span className="form-label__required"> *</span> : null}
      </span>

      {as === "textarea" ? (
        <textarea {...sharedProps} />
      ) : as === "select" ? (
        <span className="form-select-control">
          <select {...sharedProps}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FiChevronDown aria-hidden="true" />
        </span>
      ) : (
        <input {...sharedProps} />
      )}

      {children}
      {helpText ? (
        <span className="form-help" id={`${id}-help`}>
          {helpText}
        </span>
      ) : null}
      {error ? (
        <span className="form-error" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export default FormField;
