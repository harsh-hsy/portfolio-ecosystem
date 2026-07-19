import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

import recentActivity from "../../data/recentActivity";
import RecentActivityItem from "./RecentActivityItem";

function RecentActivity() {
  return (
    <section className="dashboard-widget">
      <div className="section-heading section-heading--between">
        <h2>Recent Activity</h2>

        <Link
          to="/profile"
          className="section-link"
        >
          View All

          <FiArrowRight size={16} />
        </Link>
      </div>

      <div className="activity-list">
        {recentActivity.map((activity) => (
          <RecentActivityItem
            key={activity.id}
            {...activity}
          />
        ))}
      </div>
    </section>
  );
}

export default RecentActivity;