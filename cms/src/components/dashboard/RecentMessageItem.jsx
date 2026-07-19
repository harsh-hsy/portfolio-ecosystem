function RecentMessageItem({
  name,
  email,
  subject,
  date,
}) {
  return (
    <article className="message-card">
      <div className="message-card__header">
        <span className="message-card__name">
          {name}
        </span>

        <span className="message-card__divider">
          |
        </span>

        <span className="message-card__email">
          {email}
        </span>

        <span className="message-card__divider">
          |
        </span>

        <span className="message-card__date">
          {date}
        </span>
      </div>

      <p className="message-card__subject">
        {subject}
      </p>
    </article>
  );
}

export default RecentMessageItem;