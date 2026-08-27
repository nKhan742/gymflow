import mongoose from 'mongoose';
import { databaseConfig } from '../config/database.config.js';

export class DatabaseConnection {
  private static isConnected = false;

  static async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      if (databaseConfig.debug) {
        mongoose.set('debug', true);
      }

      await mongoose.connect(databaseConfig.uri, databaseConfig.options);
      this.isConnected = true;
      console.log('[Database] MongoDB connection established successfully.');
    } catch (error) {
      console.error('[Database] Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    await mongoose.disconnect();
    this.isConnected = false;
    console.log('[Database] MongoDB disconnected.');
  }
}
