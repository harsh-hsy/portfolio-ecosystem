import { useEffect, useState } from "react";

import AccountInfoSection from "./AccountInfoSection";
import PasswordSection from "./PasswordSection";
import { getAccount } from "../../services/accountService";

const emptyUser = {
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  role: "admin",
  status: "active",
};

function AccountForm() {
  const [user, setUser] = useState(emptyUser);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await getAccount();
        if (active) {
          setUser({ ...emptyUser, ...(response.user ?? {}) });
        }
      } catch (error) {
        if (active) {
          setLoadError(error.message || "Unable to load account details.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadAccount();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page account-page">
      <header className="page-header">
        <h1 className="page-title">
          Account
        </h1>
        <p className="page-description">
          Manage the private CMS admin profile and password connected to the backend.
        </p>
      </header>

      {loadError && (
        <p className="panel-status panel-status--error">
          {loadError}
        </p>
      )}

      <AccountInfoSection
        user={user}
        isLoading={isLoading}
        onUserChange={setUser}
      />

      <PasswordSection isLoading={isLoading} />
    </div>
  );
}

export default AccountForm;
