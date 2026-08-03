import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FiLock,
  FiLogIn,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const initialForm = {
  email: "",
  password: "",
};

function Login() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] =
    useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    location.state?.from?.pathname || "/dashboard";

  function update(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="login-page">
      <Helmet>
        <title>Admin Login | Portfolio CMS</title>
      </Helmet>

      <form
        className="login-card"
        onSubmit={submit}
      >
        <div className="login-card__icon">
          <FiLock size={22} />
        </div>

        <div>
          <p className="login-card__eyebrow">
            Private Portfolio CMS
          </p>
          <h1>Admin Login</h1>
          <p>
            Sign in with your protected admin
            account to manage portfolio content.
          </p>
        </div>

        <label className="login-field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            autoComplete="username"
            required
          />
        </label>

        <label className="login-field">
          <span>Password</span>
          <div className="login-password-wrapper">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={update}
              autoComplete="current-password"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              required
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              disabled={submitting}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </label>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
        >
          <FiLogIn />
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}

export default Login;
