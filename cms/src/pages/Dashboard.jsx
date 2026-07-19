import GreetingCard from "../components/dashboard/GreetingCard";
import QuickAccess from "../components/dashboard/QuickAccess";
import RecentMessages from "../components/dashboard/RecentMessages";
import RecentActivity from "../components/dashboard/RecentActivity";

function Dashboard() {
  return (
    <>
      <GreetingCard />

      <QuickAccess />

      <div className="dashboard-widgets">
        <RecentMessages />

        <RecentActivity />
      </div>
    </>
  );
}

export default Dashboard;