import {
  FiActivity,
  FiShield,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const groups = [
  {
    id: "portfolio",
    eyebrow: "Public website",
    title: "Portfolio Settings",
    description: "Manage the behavior and accessibility of your public portfolio.",
    items: [
      { title: "Experience", description: "Loading, animation, scrolling, navigation, and motion controls.", icon: FiActivity, path: "/settings/portfolio/experience" },
    ],
  },
  {
    id: "maintenance",
    eyebrow: "Availability",
    title: "Maintenance",
    description: "Control temporary downtime messaging and public announcements.",
    items: [
      { title: "Maintenance & Announcement", description: "Maintenance mode, status copy, and announcement banner.", icon: FiShield, path: "/settings/maintenance" },
    ],
  },
];

function SettingsHub() {
  return (
    <section className="page settings-hub">
      <div className="settings-hub__groups">
        {groups.map((group) => (
          <section className="settings-hub__group" key={group.id}>
            <div className="settings-hub__group-heading">
              <p>{group.eyebrow}</p>
              <h2>{group.title}</h2>
              <span>{group.description}</span>
            </div>
            <div className={`settings-hub__grid${group.items.length === 1 ? " settings-hub__grid--single" : ""}`}>
              {group.items.map(({ title, description, icon: Icon, path }) => (
                <Link className="settings-hub-card" to={path} key={path}>
                  <span className="settings-hub-card__heading">
                    <span className="settings-hub-card__icon"><Icon aria-hidden="true" /></span>
                    <strong>{title}</strong>
                  </span>
                  <span className="settings-hub-card__footer">
                    <small>{description}</small>
                    <span className="settings-hub-card__arrow" aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

export default SettingsHub;
