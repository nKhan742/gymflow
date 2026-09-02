import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { BaseResponse } from '../../../../shared/base/BaseResponse.js';

export class DashboardController {
  private service = new DashboardService();

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      const tenantId = user?.tenantId;
      const dbName = user?.dbName || tenantId?.replace('tenant_', '');

      const stats = await this.service.getExecutiveStats({ tenantId, dbName });
      res.status(200).json(BaseResponse.success(stats, 'Executive stats retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  };

  getRevenueAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      const tenantId = user?.tenantId;
      const dbName = user?.dbName || tenantId?.replace('tenant_', '');

      const data = await this.service.getRevenueAnalytics({ tenantId, dbName });
      res.status(200).json(BaseResponse.success(data, 'Revenue analytics retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  };

  getHourlyAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      const tenantId = user?.tenantId;
      const dbName = user?.dbName || tenantId?.replace('tenant_', '');

      const data = await this.service.getHourlyAttendance({ tenantId, dbName });
      res.status(200).json(BaseResponse.success(data, 'Attendance heatmap retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  };
}
