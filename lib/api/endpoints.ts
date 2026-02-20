export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh-token",
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },
  CONTENT: {
    BASE: "/content",
    BY_ID: (id: string) => `/content/${id}`,
    BY_SLUG: (slug: string) => `/content/slug/${slug}`,
  },
  MEDIA: {
    BASE: "/media",
    UPLOAD: "/media/upload",
    BY_ID: (id: string) => `/media/${id}`,
  },
  BLOGS: {
    BASE: "/blogs",
    PUBLISHED: "/blogs/published",
    TAGS: "/blogs/tags",
    BY_ID: (id: string) => `/blogs/${id}`,
    BY_SLUG: (slug: string) => `/blogs/slug/${slug}`,
  },
  TEAMS: {
    BASE: "/teams",
    PUBLIC: "/teams/public",
    REORDER: "/teams/reorder",
    BY_ID: (id: string) => `/teams/${id}`,
    BY_SLUG: (slug: string) => `/teams/slug/${slug}`,
  },
  SETTINGS: {
    BASE: "/settings",
  },
} as const;
