export const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export function getAttendanceCutoff(): Date {
  return new Date(Date.now() - TWO_HOURS_MS);
}
