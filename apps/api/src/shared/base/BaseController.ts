import { Request, Response } from 'express';
import { BaseResponse } from './BaseResponse.js';

export abstract class BaseController {
  protected ok<T>(res: Response, data: T, message = 'Success', meta?: any): Response {
    return res.status(200).json(BaseResponse.success(data, message, meta));
  }

  protected created<T>(res: Response, data: T, message = 'Resource created successfully'): Response {
    return res.status(201).json(BaseResponse.success(data, message));
  }

  protected noContent(res: Response): Response {
    return res.status(204).send();
  }

  protected getTenantId(req: Request): string {
    return (req as any).tenantId || (req as any).user?.tenantId || 'default-tenant';
  }

  protected getUserId(req: Request): string | undefined {
    return (req as any).user?.id;
  }
}
