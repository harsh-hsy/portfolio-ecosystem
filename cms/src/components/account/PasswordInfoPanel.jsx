import {
  FiCheck,
  FiCircle,
  FiX,
} from "react-icons/fi";


function PasswordInfoPanel({
  isEditing,
  securityTips,
  requirements,
  passwordsMatch,
}) {
  return (
    <aside className="password-sidebar">
      <div className="info-card">

        <h3 className="info-card__title">
          {isEditing
            ? "Password Requirements"
            : "Password Security Tips"}
        </h3>


        {!isEditing && (
          <ul className="info-card__list">

            {securityTips.map((tip) => (
              <li
                key={tip}
                className="info-card__item"
              >
                <FiCheck className="requirement-icon requirement-icon--success" />

                <span>
                  {tip}
                </span>
              </li>
            ))}

          </ul>
        )}


        {isEditing && (
          <>

            <ul
              className="info-card__list"
              aria-live="polite"
            >

              {requirements.map((rule) => (
                <li
                  key={rule.id}
                  className="info-card__item"
                >

                  {rule.valid ? (
                    <FiCheck className="requirement-icon requirement-icon--success" />
                  ) : (
                    <FiCircle className="requirement-icon requirement-icon--pending" />
                  )}

                  <span>
                    {rule.label}
                  </span>

                </li>
              ))}

            </ul>


            {passwordsMatch !== null && (
              passwordsMatch ? (
                <p className="password-match password-match--success">
                  <FiCheck />

                  <span>
                    Passwords match
                  </span>
                </p>
              ) : (
                <p className="password-match password-match--error">
                  <FiX />

                  <span>
                    Passwords do not match
                  </span>
                </p>
              )
            )}

          </>
        )}

      </div>
    </aside>
  );
}


export default PasswordInfoPanel;