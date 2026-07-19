export const SECURITY_TIPS = [
  "Never share your password with anyone.",
  "Use a unique password for every account.",
  "Avoid using personal information.",
  "Change your password regularly.",
];


export const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 8 characters",
    validator: (password) =>
      password.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    validator: (password) =>
      /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    validator: (password) =>
      /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    validator: (password) =>
      /\d/.test(password),
  },
  {
    id: "special",
    label: "One special character",
    validator: (password) =>
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];
