import quickAccess from "../../data/quickAccess";
import QuickAccessCard from "./QuickAccessCard";

function QuickAccess() {
  return (
    <section className="quick-access">
      <div className="section-heading">
        <h2>Quick Access</h2>
      </div>

      <div className="quick-access__grid">
        {quickAccess.map((item) => (
          <QuickAccessCard
            key={item.id}
            {...item}
          />
        ))}
      </div>
    </section>
  );
}

export default QuickAccess;