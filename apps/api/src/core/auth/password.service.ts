import bcrypt from 'bcrypt';
import { appConfig } from '../../config/app.config.js';

export class PasswordService {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, appConfig.bcryptSaltRounds);
  }

  static async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
