import AccountInfoSection from "./AccountInfoSection";
import PasswordSection from "./PasswordSection";
import FormActions from "./FormActions";

function AccountForm() {
  return (
    <main className="page account-page">
      <header className="page-header">
        <h1 className="page-title">
          Account
        </h1>

        <p className="page-description">
          Manage your CMS account credentials and security settings.
        </p>
      </header>

      <AccountInfoSection />

      <PasswordSection />

      <FormActions />
    </main>
  );
}

export default AccountForm;