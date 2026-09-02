import mongoose from 'mongoose';
import { databaseConfig } from '../config/database.config.js';

export class DatabaseConnection {
  public static lastError: string | null = null;

  static async connect(): Promise<void> {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return;
    }

    try {
      if (databaseConfig.debug) {
        mongoose.set('debug', true);
      }

      await mongoose.connect(databaseConfig.uri, databaseConfig.options);
      this.lastError = null;
      console.log('[Database] MongoDB connection established successfully. State:', mongoose.connection.readyState);
    } catch (error: any) {
      this.lastError = error?.message || String(error);
      console.error('[Database] Failed to connect to MongoDB:', error?.message || error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    if (!mongoose.connection || mongoose.connection.readyState === 0) return;
    await mongoose.disconnect();
    console.log('[Database] MongoDB disconnected.');
  }
}
