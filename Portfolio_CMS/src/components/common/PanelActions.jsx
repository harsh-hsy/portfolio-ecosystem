function PanelActions({
  primaryLabel = "Save Changes",
  secondaryLabel = "Reset",
  cancelLabel = "Cancel",

  primaryType = "submit",
  secondaryType = "button",
  cancelType = "button",

  showPrimary = true,
  showSecondary = true,
  showCancel = false,

  onPrimaryClick,
  onSecondaryClick,
  onCancelClick,
}) {
  return (
    <div className="panel-actions">
      {showCancel && (
        <button
          type={cancelType}
          className="btn btn-secondary"
          onClick={onCancelClick}
        >
          {cancelLabel}
        </button>
      )}

      {showSecondary && (
        <button
          type={secondaryType}
          className="btn btn-secondary"
          onClick={onSecondaryClick}
        >
          {secondaryLabel}
        </button>
      )}

      {showPrimary && (
        <button
          type={primaryType}
          className="btn btn-primary"
          onClick={onPrimaryClick}
        >
          {primaryLabel}
        </button>
      )}
    </div>
  );
}

export default PanelActions;