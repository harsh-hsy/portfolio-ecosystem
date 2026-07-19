function PanelStatus({
  message = "",
  type = "success",
}) {
  return (
    <p
      className={`panel-status ${
        message ? `panel-status--${type}` : ""
      }`}
    >
      {message}
    </p>
  );
}

export default PanelStatus;