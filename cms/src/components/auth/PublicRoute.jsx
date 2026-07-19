import { Navigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function PublicRoute({ children }) {
  const {
    authenticated,
    checkingSession,
  } = useAuth();

  if (checkingSession) {
    return (
      <div className="auth-loading">
        Checking secure session...
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
