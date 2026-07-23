import { FiRefreshCw, FiSave } from "react-icons/fi";

import PanelStatus from "./PanelStatus";

function EditorActions({
  status,
  isDirty,
  isLoading,
  isSaving,
  onReset,
}) {
  const displayStatus =
    isDirty && !status.message
      ? { message: "You have unsaved changes.", type: "warning" }
      : status;

  return (
    <footer className="panel-footer">
      <PanelStatus
        message={displayStatus.message}
        type={displayStatus.type}
      />

      <div className="panel-actions">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onReset}
          disabled={isLoading || isSaving || !isDirty}
        >
          <FiRefreshCw aria-hidden="true" />
          Reset
        </button>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={isLoading || isSaving || !isDirty}
        >
          <FiSave aria-hidden="true" />
          {isSaving ? "Saving" : "Save Changes"}
        </button>
      </div>
    </footer>
  );
}

export default EditorActions;
