import { Feedback } from "@/types/dashboard";

export function redactAnonymous(
  rows: Feedback[],
  viewerId?: number,
): Feedback[] {
  return rows.map((row) => {
    if (
      row.isAnonymous &&
      (viewerId === undefined || row.authorId !== viewerId)
    ) {
      return { ...row, authorId: null, author: { name: null, email: null } };
    }
    return row;
  });
}
