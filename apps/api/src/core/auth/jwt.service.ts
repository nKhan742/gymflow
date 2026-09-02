import jwt from 'jsonwebtoken';
import { authConfig } from '../../config/auth.config.js';

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
  tenantId: string;
  branchId?: string;
  permissions: string[];
  planTier?: 'ESSENTIAL' | 'PROFESSIONAL' | 'ENTERPRISE';
}

export class JwtService {
  static signAccessToken(payload: IJwtPayload): string {
    return jwt.sign(payload, authConfig.jwtSecret, { expiresIn: authConfig.jwtExpiration as any });
  }

  static signRefreshToken(payload: IJwtPayload): string {
    return jwt.sign(payload, authConfig.jwtRefreshSecret, { expiresIn: authConfig.jwtRefreshExpiration as any });
  }

  static verifyAccessToken(token: string): IJwtPayload {
    return jwt.verify(token, authConfig.jwtSecret) as IJwtPayload;
  }

  static verifyRefreshToken(token: string): IJwtPayload {
    return jwt.verify(token, authConfig.jwtRefreshSecret) as IJwtPayload;
  }
}
