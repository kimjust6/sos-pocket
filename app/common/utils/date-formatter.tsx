export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString([], timeFormat);
}

const timeFormat: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
};
