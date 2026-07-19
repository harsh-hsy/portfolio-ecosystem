import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminSession,
  loginAdmin,
  logoutAdmin,
} from "../services/authService";
import { AuthContext } from "./auth-context";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] =
    useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const session = await getAdminSession();
      setUser(session.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getAdminSession()
      .then((session) => {
        if (active) {
          setUser(session.user ?? null);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setCheckingSession(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const session = await loginAdmin(credentials);
    setUser(session.user ?? null);
    return session;
  }, []);

  const logout = useCallback(async () => {
    await logoutAdmin();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      authenticated: Boolean(user),
      checkingSession,
      user,
      login,
      logout,
      refreshSession,
    }),
    [
      checkingSession,
      login,
      logout,
      refreshSession,
      user,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
