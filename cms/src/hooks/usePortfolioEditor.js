import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getAdminPortfolio,
  initializeAdminPortfolio,
  updateAdminPortfolioModule,
} from "../services/portfolioService";
import { useToast } from "./useToast";
import { useUnsavedChanges } from "./useUnsavedChanges";

function serializeForm(form) {
  return JSON.stringify(form);
}

export function usePortfolioEditor({
  moduleName,
  getForm,
  getPortfolio,
  validate = () => ({}),
  successMessage = "Content updated successfully.",
}) {
  const { showToast } = useToast();
  const [portfolio, setPortfolio] = useState(null);
  const [form, setForm] = useState(() => getForm(null));
  const [savedForm, setSavedForm] = useState(() => getForm(null));
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "success" });
  const isDirty = useMemo(
    () => serializeForm(form) !== serializeForm(savedForm),
    [form, savedForm],
  );

  useUnsavedChanges(isDirty && !isSaving);

  useEffect(() => {
    let active = true;

    async function loadPortfolio() {
      setIsLoading(true);
      setStatus({ message: "", type: "success" });

      try {
        const response = await getAdminPortfolio();
        const content = response.content
          ? response.content
          : (await initializeAdminPortfolio()).content;

        if (!active) return;

        const nextForm = getForm(content);
        setPortfolio(content);
        setForm(nextForm);
        setSavedForm(nextForm);
        setErrors({});
      } catch (error) {
        if (!active) return;

        const message = error.message || "Unable to load portfolio content.";
        setStatus({ message, type: "error" });
        showToast(message, { type: "error" });
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadPortfolio();

    return () => {
      active = false;
    };
  }, [getForm, moduleName, showToast]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;

      const nextErrors = { ...current };
      delete nextErrors[name];
      return nextErrors;
    });
    setStatus((current) =>
      current.type === "error" ? { message: "", type: "success" } : current,
    );
  }

  function updateForm(updater) {
    setForm((current) =>
      typeof updater === "function" ? updater(current) : updater,
    );
  }

  function resetForm() {
    if (!portfolio) return;

    const nextForm = getForm(portfolio);
    setForm(nextForm);
    setSavedForm(nextForm);
    setErrors({});
    setStatus({ message: "Unsaved changes discarded.", type: "warning" });
    showToast("Unsaved changes discarded.", { type: "warning" });
  }

  const saveForm = useCallback(
    async (event) => {
      event?.preventDefault();
      if (!portfolio || isSaving) return false;

      const validationErrors = validate(form);

      if (Object.keys(validationErrors).length) {
        const message = "Review the highlighted fields before saving.";
        setErrors(validationErrors);
        setStatus({ message, type: "error" });
        showToast(message, { type: "error" });
        return false;
      }

      setIsSaving(true);
      setErrors({});
      setStatus({ message: "", type: "success" });

      try {
        const nextPortfolio = getPortfolio(portfolio, form);
        const response = await updateAdminPortfolioModule(
          moduleName,
          nextPortfolio,
        );
        const nextForm = getForm(response.content);

        setPortfolio(response.content);
        setForm(nextForm);
        setSavedForm(nextForm);
        setStatus({ message: successMessage, type: "success" });
        showToast(successMessage, { type: "success" });
        return true;
      } catch (error) {
        const message = error.message || "Unable to save content.";
        setStatus({ message, type: "error" });
        showToast(message, { type: "error" });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [
      form,
      getForm,
      getPortfolio,
      isSaving,
      moduleName,
      portfolio,
      showToast,
      successMessage,
      validate,
    ],
  );

  return {
    portfolio,
    form,
    savedForm,
    errors,
    isDirty,
    isLoading,
    isSaving,
    status,
    setStatus,
    updateField,
    updateForm,
    resetForm,
    saveForm,
  };
}
