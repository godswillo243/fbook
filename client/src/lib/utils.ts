export function formatDate(date: string) {
  const ndate = new Date(date);
  const formatted = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  }).format(ndate);

  return formatted;
}
