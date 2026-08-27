import { Request, Response, NextFunction } from 'express';
import { MembersService } from '../service/members.service.js';
import { BaseResponse } from '../../../../shared/base/BaseResponse.js';

export class MembersController {
  private service = new MembersService();

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getMembers(req.query);
      res.status(200).json(BaseResponse.success(result, 'Members retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.service.getMemberById(id);
      res.status(200).json(BaseResponse.success(result, 'Member profile retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.createMember(req.body);
      res.status(201).json(BaseResponse.success(result, 'Member created successfully.'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.service.updateMember(id, req.body);
      res.status(200).json(BaseResponse.success(result, 'Member updated successfully.'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.service.deleteMember(id);
      res.status(200).json(BaseResponse.success(result, 'Member removed successfully.'));
    } catch (error) {
      next(error);
    }
  };

  freeze = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { days, reason } = req.body;
      const result = await this.service.freezeMembership(id, days, reason);
      res.status(200).json(BaseResponse.success(result, 'Membership frozen successfully.'));
    } catch (error) {
      next(error);
    }
  };

  renew = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { durationMonths } = req.body;
      const result = await this.service.renewMembership(id, durationMonths);
      res.status(200).json(BaseResponse.success(result, 'Membership renewed successfully.'));
    } catch (error) {
      next(error);
    }
  };

  checkIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { method } = req.body;
      const result = await this.service.recordCheckIn(id, method);
      res.status(200).json(BaseResponse.success(result, 'Attendance check-in verified.'));
    } catch (error) {
      next(error);
    }
  };
}
