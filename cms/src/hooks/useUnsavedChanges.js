import { useEffect } from "react";

export function useUnsavedChanges(
  isDirty,
  message = "You have unsaved changes. Leave without saving?",
) {
  useEffect(() => {
    if (!isDirty) return undefined;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    function handleDocumentClick(event) {
      const link = event.target.closest?.("a[href]");

      if (!link || event.defaultPrevented || link.target === "_blank") return;

      const targetUrl = new URL(link.href, window.location.href);
      const currentUrl = new URL(window.location.href);

      if (
        targetUrl.origin !== currentUrl.origin ||
        targetUrl.href === currentUrl.href
      ) {
        return;
      }

      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isDirty, message]);
}
