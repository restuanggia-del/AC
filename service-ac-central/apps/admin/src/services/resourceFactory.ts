import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types";

export function createResourceApi<T>(endpoint: string) {
  return {
    getAll: async (params?: Record<string, string>): Promise<T[]> => {
      const res = await apiClient.get<ApiResponse<T[]>>(endpoint, { params });
      return res.data.data;
    },
    getOne: async (id: string): Promise<T> => {
      const res = await apiClient.get<ApiResponse<T>>(`${endpoint}/${id}`);
      return res.data.data;
    },
    create: async (payload: Partial<T>): Promise<T> => {
      const res = await apiClient.post<ApiResponse<T>>(endpoint, payload);
      return res.data.data;
    },
    update: async (id: string, payload: Partial<T>): Promise<T> => {
      const res = await apiClient.put<ApiResponse<T>>(`${endpoint}/${id}`, payload);
      return res.data.data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`${endpoint}/${id}`);
    },
  };
}
