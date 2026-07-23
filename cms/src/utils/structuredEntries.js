export function cleanStructuredEntries(entries = []) {
  return entries.map((entry) => ({
    title: String(entry?.title ?? "").trim(),
    label: String(entry?.label ?? "").trim(),
    period: String(entry?.period ?? "").trim(),
    body: String(entry?.body ?? "").trim(),
  }));
}

export function validateStructuredEntries(
  entries,
  {
    collectionLabel = "entries",
    itemLabel = "entry",
  } = {},
) {
  if (!Array.isArray(entries) || entries.length < 1 || entries.length > 12) {
    return `Add between one and twelve ${collectionLabel}.`;
  }

  return entries.every(
    (entry) =>
      entry.title.trim() &&
      entry.title.length <= 120 &&
      entry.label.trim() &&
      entry.label.length <= 40 &&
      entry.period.trim() &&
      entry.period.length <= 60 &&
      entry.body.trim() &&
      entry.body.length <= 500,
  )
    ? ""
    : `Complete the title, category, status, and description for every ${itemLabel}.`;
}
