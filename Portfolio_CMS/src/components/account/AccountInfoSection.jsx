import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiEdit3,
} from "react-icons/fi";


function AccountInfoSection() {
  const accountDetails = [
    {
      id: "name",
      label: "Name",
      value: "Harsh Singh",
      icon: FiUser,
    },
    {
      id: "email",
      label: "Email",
      value: "admin@example.com",
      icon: FiMail,
    },
    {
      id: "phone",
      label: "Contact Number",
      value: "+91 98765 43210",
      icon: FiPhone,
    },
    {
      id: "dob",
      label: "Date of Birth",
      value: "01 January 2004",
      icon: FiCalendar,
    },
    {
      id: "role",
      label: "Role",
      value: "Administrator",
      icon: FiShield,
    },
    {
      id: "status",
      label: "Account Status",
      value: "Active",
      icon: FiShield,
      status: true,
    },
  ];


  return (
    <section className="panel account-section">

      <div className="account-section__header">

        <h2 className="account-section__title">
          Account Information
        </h2>

      </div>


      <div className="account-info-grid">

        {accountDetails.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.id}
              className="account-info-card"
            >

              <div className="account-info-card__icon">
                <Icon size={20} />
              </div>


              <div className="account-info-card__content">

                <span className="account-info-card__label">
                  {item.label}
                </span>


                <span
                  className={
                    item.status
                      ? "account-info-card__value account-info-card__value--success"
                      : "account-info-card__value"
                  }
                >
                  {item.value}
                </span>

              </div>

            </article>
          );
        })}

      </div>


      <div className="account-info-actions">

        <button
          type="button"
          className="btn btn-primary"
        >
          <FiEdit3 size={16} />

          Edit Details
        </button>

      </div>

    </section>
  );
}


export default AccountInfoSection;