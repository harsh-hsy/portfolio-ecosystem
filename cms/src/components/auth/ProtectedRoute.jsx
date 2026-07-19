import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute({ children }) {
  const {
    authenticated,
    checkingSession,
  } = useAuth();
  const location = useLocation();

  if (checkingSession) {
    return (
      <div className="auth-loading">
        Checking secure session...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
