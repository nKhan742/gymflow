import { axiosClient } from './axiosClient';
import { IApiResponse } from '../types/api.types';

export class ApiService {
  static async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const res = await axiosClient.get<IApiResponse<T>>(url, { params });
    return res.data?.data ?? (res.data as unknown as T);
  }

  static async post<T>(url: string, data?: unknown): Promise<T> {
    const res = await axiosClient.post<IApiResponse<T>>(url, data);
    return res.data?.data ?? (res.data as unknown as T);
  }

  static async put<T>(url: string, data?: unknown): Promise<T> {
    const res = await axiosClient.put<IApiResponse<T>>(url, data);
    return res.data?.data ?? (res.data as unknown as T);
  }

  static async patch<T>(url: string, data?: unknown): Promise<T> {
    const res = await axiosClient.patch<IApiResponse<T>>(url, data);
    return res.data?.data ?? (res.data as unknown as T);
  }

  static async delete<T>(url: string): Promise<T> {
    const res = await axiosClient.delete<IApiResponse<T>>(url);
    return res.data?.data ?? (res.data as unknown as T);
  }
}
