import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

function ConfirmDialog({
  isOpen,
  title = "Delete item?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isConfirming = false,
  onConfirm,
  onCancel,
}) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    cancelButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isConfirming) {
        onCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isConfirming, isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="dialog-backdrop" onMouseDown={onCancel}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="confirm-dialog__icon">
          <FiAlertTriangle aria-hidden="true" />
        </div>

        <div className="confirm-dialog__content">
          <div className="confirm-dialog__header">
            <h2 id="confirm-dialog-title">{title}</h2>
            <button
              type="button"
              className="confirm-dialog__close"
              onClick={onCancel}
              disabled={isConfirming}
              aria-label="Close confirmation"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>

          <p id="confirm-dialog-description">{message}</p>

          <div className="confirm-dialog__actions">
            <button
              ref={cancelButtonRef}
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isConfirming}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? "Deleting" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
