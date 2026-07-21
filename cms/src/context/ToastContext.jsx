import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ToastContext from "./toast-context";
import ToastViewport from "../components/common/ToastViewport";

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timer = timers.current.get(id);

    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, options = {}) => {
      if (!message) return null;

      const id = ++nextId.current;
      const toast = {
        id,
        message,
        type: options.type || "success",
      };

      setToasts((current) => [...current, toast]);

      const timer = window.setTimeout(
        () => dismissToast(id),
        options.duration ?? 4000,
      );
      timers.current.set(id, timer);

      return id;
    },
    [dismissToast],
  );

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
    },
    [],
  );

  const value = useMemo(
    () => ({ showToast, dismissToast }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export default ToastProvider;
