import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Blog, CreateBlogData, UpdateBlogData, BlogTag } from "@/models/blog";
import type { ApiResponse, PaginatedResponse } from "@/models/api";

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  status?: string;
  tag?: string;
  search?: string;
}

export const blogsApi = {
  getAll: async (params?: GetBlogsParams) => {
    const res = await apiClient.get<PaginatedResponse<Blog>>(
      API_ENDPOINTS.BLOGS.BASE,
      { params }
    );
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Blog>>(
      API_ENDPOINTS.BLOGS.BY_ID(id)
    );
    return res.data;
  },

  create: async (data: CreateBlogData) => {
    const res = await apiClient.post<ApiResponse<Blog>>(
      API_ENDPOINTS.BLOGS.BASE,
      data
    );
    return res.data;
  },

  update: async (id: string, data: UpdateBlogData) => {
    const res = await apiClient.put<ApiResponse<Blog>>(
      API_ENDPOINTS.BLOGS.BY_ID(id),
      data
    );
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.BLOGS.BY_ID(id)
    );
    return res.data;
  },

  getTags: async () => {
    const res = await apiClient.get<ApiResponse<BlogTag[]>>(
      API_ENDPOINTS.BLOGS.TAGS
    );
    return res.data;
  },
};
