import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const icons = {
  error: FiAlertCircle,
  info: FiInfo,
  success: FiCheckCircle,
  warning: FiAlertCircle,
};

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || FiInfo;

        return (
          <div
            className={`toast toast--${toast.type}`}
            key={toast.id}
            role={toast.type === "error" ? "alert" : "status"}
          >
            <Icon className="toast__icon" aria-hidden="true" />
            <span className="toast__message">{toast.message}</span>
            <button
              type="button"
              className="toast__dismiss"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastViewport;
