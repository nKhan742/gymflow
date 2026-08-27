import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { BaseResponse } from '../../../../shared/base/BaseResponse.js';

export class DashboardController {
  private service = new DashboardService();

  getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.service.getExecutiveStats();
      res.status(200).json(BaseResponse.success(stats, 'Executive stats retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  };

  getRevenueAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getRevenueAnalytics();
      res.status(200).json(BaseResponse.success(data, 'Revenue analytics retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  };

  getHourlyAttendance = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getHourlyAttendance();
      res.status(200).json(BaseResponse.success(data, 'Attendance heatmap retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  };
}

