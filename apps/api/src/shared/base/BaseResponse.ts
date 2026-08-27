export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors: Record<string, string[]> | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    timestamp: string;
  };
}

export class BaseResponse {
  static success<T>(data: T, message = 'Operation completed successfully', meta?: IApiResponse<T>['meta']): IApiResponse<T> {
    return {
      success: true,
      message,
      data,
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  static error(message = 'An error occurred', errors: Record<string, string[]> | null = null): IApiResponse<null> {
    return {
      success: false,
      message,
      data: null,
      errors,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
