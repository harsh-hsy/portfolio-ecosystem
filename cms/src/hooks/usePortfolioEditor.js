import { useEffect, useState } from "react";

import {
  getAdminPortfolio,
  initializeAdminPortfolio,
  updateAdminPortfolioModule,
} from "../services/portfolioService";

export function usePortfolioEditor({
  moduleName,
  getForm,
  getPortfolio,
  successMessage = "Content updated successfully.",
}) {
  const [portfolio, setPortfolio] = useState(null);
  const [form, setForm] = useState(() => getForm(null));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "success" });

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
        setPortfolio(content);
        setForm(getForm(content));
      } catch (error) {
        if (!active) return;
        setStatus({
          message: error.message || "Unable to load portfolio content.",
          type: "error",
        });
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadPortfolio();

    return () => {
      active = false;
    };
  }, [getForm, moduleName]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateForm(updater) {
    setForm((current) =>
      typeof updater === "function" ? updater(current) : updater,
    );
  }

  function resetForm() {
    if (!portfolio) return;
    setForm(getForm(portfolio));
    setStatus({ message: "Unsaved changes discarded.", type: "warning" });
  }

  async function saveForm(event) {
    event?.preventDefault();
    if (!portfolio) return;

    setIsSaving(true);
    setStatus({ message: "", type: "success" });

    try {
      const nextPortfolio = getPortfolio(portfolio, form);
      const response = await updateAdminPortfolioModule(moduleName, nextPortfolio);
      setPortfolio(response.content);
      setForm(getForm(response.content));
      setStatus({ message: successMessage, type: "success" });
    } catch (error) {
      setStatus({
        message: error.message || "Unable to save content.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return {
    portfolio,
    form,
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
