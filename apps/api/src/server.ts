import { createApp } from './app.js';
import { appConfig } from './config/app.config.js';
import { DatabaseConnection } from './database/connection.js';
import { seedDatabase } from './database/seeder.js';
import { logger } from './core/logger/winston.logger.js';

async function bootstrap() {
  try {
    try {
      await DatabaseConnection.connect();
      await seedDatabase();
    } catch {
      logger.warn('[GymFlow API] MongoDB connection could not be established immediately. Starting in offline mode.');
    }

    const app = createApp();

    app.listen(appConfig.port, () => {
      logger.info(`[GymFlow API] Server running in ${appConfig.env} mode on port ${appConfig.port}`);
      logger.info(`[GymFlow API] Base URL: http://localhost:${appConfig.port}${appConfig.apiPrefix}`);
      logger.info(`[GymFlow API] Health Check: http://localhost:${appConfig.port}${appConfig.apiPrefix}/health`);
    });
  } catch (error) {
    logger.error('[GymFlow API] Bootstrap failed:', error);
    process.exit(1);
  }
}

bootstrap();
