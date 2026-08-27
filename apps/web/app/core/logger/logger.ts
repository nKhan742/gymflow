export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log('[INFO] [GymFlow] ' + message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn('[WARN] [GymFlow] ' + message, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error('[ERROR] [GymFlow] ' + message, ...args);
  },
};
