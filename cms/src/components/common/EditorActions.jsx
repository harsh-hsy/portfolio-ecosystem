import { FiRefreshCw, FiSave } from "react-icons/fi";

import PanelStatus from "./PanelStatus";

function EditorActions({
  status,
  isLoading,
  isSaving,
  onReset,
}) {
  return (
    <div className="panel-footer">
      <PanelStatus message={status.message} type={status.type} />

      <div className="panel-actions">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onReset}
          disabled={isLoading || isSaving}
        >
          <FiRefreshCw />
          Reset
        </button>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={isLoading || isSaving}
        >
          <FiSave />
          {isSaving ? "Saving" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default EditorActions;
