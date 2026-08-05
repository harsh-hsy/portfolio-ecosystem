import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

function QuickAccessCard({
  title,
  description,
  icon: Icon,
  path,
}) {
  return (
    <Link
      to={path}
      className="quick-access-card"
    >
      <div className="quick-access-card__heading">
        <div className="quick-access-card__icon">
          <Icon size={22} />
        </div>
        <h3>{title}</h3>
      </div>

      <div className="quick-access-card__footer">
        <p>{description}</p>
        <FiArrowRight
          size={18}
          className="quick-access-card__arrow"
        />
      </div>
    </Link>
  );
}

export default QuickAccessCard;
