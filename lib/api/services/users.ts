import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { User, CreateUserData, UpdateUserData } from "@/models/user";
import type { ApiResponse, PaginatedResponse } from "@/models/api";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: string;
}

export const usersApi = {
  getAll: async (params?: GetUsersParams) => {
    const res = await apiClient.get<PaginatedResponse<User>>(
      API_ENDPOINTS.USERS.BASE,
      { params }
    );
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    return res.data;
  },

  create: async (data: CreateUserData) => {
    const res = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.USERS.BASE,
      data
    );
    return res.data;
  },

  update: async (id: string, data: UpdateUserData) => {
    const res = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USERS.BY_ID(id),
      data
    );
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    return res.data;
  },
};
