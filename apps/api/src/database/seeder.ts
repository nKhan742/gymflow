import mongoose from 'mongoose';
import { logger } from '../core/logger/winston.logger.js';

export async function seedDatabase(): Promise<void> {
  // Safe bootstrap without purging existing production or tenant databases
}

export async function clearDatabase(): Promise<void> {
  await seedDatabase();
}


