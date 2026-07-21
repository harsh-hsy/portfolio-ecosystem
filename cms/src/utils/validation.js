function isEmpty(value) {
  return value == null || String(value).trim() === "";
}

export const validators = {
  required:
    (message = "This field is required.") =>
    (value) =>
      isEmpty(value) ? message : "",

  email:
    (message = "Enter a valid email address.") =>
    (value) =>
      isEmpty(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : message,

  url:
    (message = "Enter a valid URL.") =>
    (value) => {
      if (isEmpty(value)) return "";

      try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol) ? "" : message;
      } catch {
        return message;
      }
    },

  json:
    (message = "Enter valid JSON.") =>
    (value) => {
      try {
        JSON.parse(value);
        return "";
      } catch {
        return message;
      }
    },

  maxLength:
    (limit, message = `Use ${limit} characters or fewer.`) =>
    (value) =>
      String(value ?? "").length > limit ? message : "",

  minItems:
    (limit, message = `Add at least ${limit} item.`) =>
    (value) =>
      Array.isArray(value) && value.length >= limit ? "" : message,
};

export function validateForm(form, rules = {}) {
  return Object.entries(rules).reduce((errors, [field, fieldRules]) => {
    const validatorsForField = Array.isArray(fieldRules)
      ? fieldRules
      : [fieldRules];

    for (const validate of validatorsForField) {
      const message = validate?.(form[field], form);

      if (message) {
        errors[field] = message;
        break;
      }
    }

    return errors;
  }, {});
}
