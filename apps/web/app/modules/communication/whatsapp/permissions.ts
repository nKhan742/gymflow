export const WHATSAPP_PERMISSIONS = {
  VIEW: 'communication:whatsapp:view',
  CREATE: 'communication:whatsapp:create',
  UPDATE: 'communication:whatsapp:update',
  DELETE: 'communication:whatsapp:delete',
  EXPORT: 'communication:whatsapp:export',
  IMPORT: 'communication:whatsapp:import',
} as const;

export type WhatsappPermissionType = typeof WHATSAPP_PERMISSIONS[keyof typeof WHATSAPP_PERMISSIONS];
