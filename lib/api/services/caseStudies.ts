import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CaseStudy,
  CreateCaseStudyData,
  UpdateCaseStudyData,
  CaseStudyTag,
} from "@/models/caseStudy";
import type { ApiResponse, PaginatedResponse } from "@/models/api";

export interface GetCaseStudiesParams {
  page?: number;
  limit?: number;
  status?: string;
  tag?: string;
  search?: string;
}

export const caseStudiesApi = {
  getAll: async (params?: GetCaseStudiesParams) => {
    const res = await apiClient.get<PaginatedResponse<CaseStudy>>(
      API_ENDPOINTS.CASE_STUDIES.BASE,
      { params }
    );
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<CaseStudy>>(
      API_ENDPOINTS.CASE_STUDIES.BY_ID(id)
    );
    return res.data;
  },

  create: async (data: CreateCaseStudyData) => {
    const res = await apiClient.post<ApiResponse<CaseStudy>>(
      API_ENDPOINTS.CASE_STUDIES.BASE,
      data
    );
    return res.data;
  },

  update: async (id: string, data: UpdateCaseStudyData) => {
    const res = await apiClient.put<ApiResponse<CaseStudy>>(
      API_ENDPOINTS.CASE_STUDIES.BY_ID(id),
      data
    );
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.CASE_STUDIES.BY_ID(id)
    );
    return res.data;
  },

  getTags: async () => {
    const res = await apiClient.get<ApiResponse<CaseStudyTag[]>>(
      API_ENDPOINTS.CASE_STUDIES.TAGS
    );
    return res.data;
  },
};
