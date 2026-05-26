import { UserRole } from '@prisma/client';

export const PERMISSIONS = {
  BOSS: {
    sheets: { view: true, edit: true, delete: true, create: true },
    users: { create: true, edit: true, delete: true, viewAll: true },
    system: { settings: true, logs: true }
  },
  COORDINADOR: {
    sheets: { view: true, edit: true, delete: true, create: true },
    users: { create: false, edit: false, delete: false, viewAll: false },
    system: { settings: false, logs: false }
  },
  AGENDADOR: {
    sheets: { view: true, edit: false, delete: false, create: false },
    users: { create: false, edit: false, delete: false, viewAll: false },
    system: { settings: false, logs: false }
  }
} as const;

export function canPerform(
  role: UserRole,
  resource: keyof typeof PERMISSIONS.BOSS,
  action: string
): boolean {
  const perms = PERMISSIONS[role]?.[resource] as Record<string, boolean>;
  return perms?.[action] ?? false;
}

export function getUserPermissions(role: UserRole) {
  return PERMISSIONS[role];
}
