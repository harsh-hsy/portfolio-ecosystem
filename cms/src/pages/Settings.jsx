import { FiGlobe, FiUser } from "react-icons/fi";

import QuickAccessCard from "../components/dashboard/QuickAccessCard";

const settingsDestinations = [
  {
    id: "global-pages",
    title: "Global Pages",
    description: "Manage Footer and 404 page content.",
    icon: FiGlobe,
    path: "/global-pages",
  },
  {
    id: "account",
    title: "Account & Security",
    description: "Manage private admin details and password security.",
    icon: FiUser,
    path: "/account",
  },
];

function Settings() {
  return (
    <section className="page settings-page">
      <div className="page-header">
        <p className="page-kicker">Configuration</p>
        <h1 className="page-title">Settings</h1>
        <p className="page-description">
          Access site-wide content and private CMS configuration from one place.
        </p>
      </div>

      <section className="panel settings-overview">
        <div className="settings-overview__header">
          <h2>Settings Workspace</h2>
          <p>
            Public utility-page content now lives in Global Pages. Private admin
            information remains inside Account & Security.
          </p>
        </div>

        <div className="quick-access__grid settings-overview__grid">
          {settingsDestinations.map((item) => (
            <QuickAccessCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </section>
  );
}

export default Settings;
