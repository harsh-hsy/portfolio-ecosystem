function RecentActivityItem({
  title,
  description,
  date,
}) {
  return (
    <article className="activity-card">
      <div className="activity-card__header">
        <span className="activity-card__title">
          {title}
        </span>

        <span className="activity-card__divider">
          |
        </span>

        <span className="activity-card__date">
          {date}
        </span>
      </div>

      <p className="activity-card__description">
        {description}
      </p>
    </article>
  );
}

export default RecentActivityItem;