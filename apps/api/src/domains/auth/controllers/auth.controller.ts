import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { BaseResponse } from '../../../shared/base/BaseResponse.js';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body || {});
      res.status(201).json(BaseResponse.success(result, 'Organization and administrator account registered successfully.'));
    } catch (error: any) {
      console.error('[AuthController.register] Registration failed:', error.message || error);
      res.status(error.statusCode || 400).json(BaseResponse.error(error.message || 'Registration failed.'));
    }
  };

  login = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        res.status(400).json(BaseResponse.error('Email and password are required.'));
        return;
      }

      const result = await this.authService.login(email, password);
      res.status(200).json(BaseResponse.success(result, 'Authentication successful.'));
    } catch (error: any) {
      res.status(error.statusCode || 401).json(BaseResponse.error(error.message || 'Authentication failed.'));
    }
  };

  logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json(BaseResponse.success(null, 'Logged out successfully.'));
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const currentUser = (req as any).user;
      res.status(200).json(BaseResponse.success(currentUser, 'User profile fetched successfully.'));
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body || {};
      if (!refreshToken) {
        res.status(400).json(BaseResponse.error('Refresh token is required.'));
        return;
      }
      const result = await this.authService.refreshToken(refreshToken);
      res.status(200).json(BaseResponse.success(result, 'Token refreshed successfully.'));
    } catch (error) {
      next(error);
    }
  };
}
