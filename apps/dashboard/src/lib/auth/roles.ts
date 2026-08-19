import { Role } from "@prisma/client";

export const OFFICER_ROLES: Role[] = [
  Role.NORTHEASTERN_ADMIN,
  Role.SUPER_ADMIN,
];

export function isOfficer(user: { role: Role }) {
  return OFFICER_ROLES.includes(user.role);
}
