// Date formatters for the detail panels. They return `null` rather than a
// string for missing values so DetailField applies its own empty-state styling
// instead of receiving a pre-baked "N/A".

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return null;
  return new Date(value).toLocaleString();
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return null;
  return new Date(value).toLocaleDateString();
}
