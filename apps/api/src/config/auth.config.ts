export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'gymflow_dev_jwt_secret',
  jwtExpiration: process.env.JWT_EXPIRATION || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'gymflow_dev_refresh_secret',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
};
