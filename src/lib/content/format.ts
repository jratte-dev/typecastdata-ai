/**
 * Pure formatting helpers. No `fs`, no Node imports — safe to use from
 * client components.
 */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Format an ISO date for display. "2026-05-04" -> "May 4, 2026".
 */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((s) => parseInt(s, 10));
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
