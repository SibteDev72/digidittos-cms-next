import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Team, CreateTeamData, UpdateTeamData } from "@/models/team";
import type { ApiResponse, PaginatedResponse } from "@/models/api";

export interface GetTeamsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: string;
}

export const teamsApi = {
  getAll: async (params?: GetTeamsParams) => {
    const res = await apiClient.get<PaginatedResponse<Team>>(
      API_ENDPOINTS.TEAMS.BASE,
      { params }
    );
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Team>>(
      API_ENDPOINTS.TEAMS.BY_ID(id)
    );
    return res.data;
  },

  create: async (data: CreateTeamData) => {
    const res = await apiClient.post<ApiResponse<Team>>(
      API_ENDPOINTS.TEAMS.BASE,
      data
    );
    return res.data;
  },

  update: async (id: string, data: UpdateTeamData) => {
    const res = await apiClient.put<ApiResponse<Team>>(
      API_ENDPOINTS.TEAMS.BY_ID(id),
      data
    );
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.TEAMS.BY_ID(id)
    );
    return res.data;
  },

  reorder: async (orderedIds: string[]) => {
    const res = await apiClient.put<ApiResponse<null>>(
      API_ENDPOINTS.TEAMS.REORDER,
      { orderedIds }
    );
    return res.data;
  },
};
