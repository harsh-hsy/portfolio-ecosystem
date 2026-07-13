import AccountInfoSection from "./AccountInfoSection";
import PasswordSection from "./PasswordSection";

function AccountForm() {
  return (
    <div className="page account-page">
      <header className="page-header">
        <h1 className="page-title">
          Account
        </h1>
      </header>

      <AccountInfoSection />

      <PasswordSection />
    </div>
  );
}

export default AccountForm;