import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

import recentMessages from "../../data/recentMessages";
import RecentMessageItem from "./RecentMessageItem";

function RecentMessages() {
  return (
    <section className="dashboard-widget">
      <div className="section-heading section-heading--between">
        <h2>Recent Messages</h2>

        <Link
          to="/inbox"
          className="section-link"
        >
          View All

          <FiArrowRight size={16} />
        </Link>
      </div>

      <div className="message-list">
        {recentMessages.map((message) => (
          <RecentMessageItem
            key={message.id}
            {...message}
          />
        ))}
      </div>
    </section>
  );
}

export default RecentMessages;