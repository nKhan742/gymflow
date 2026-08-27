export const storageConfig = {
  provider: process.env.STORAGE_PROVIDER || 'local',
  localPath: process.env.STORAGE_LOCAL_PATH || './uploads',
};
