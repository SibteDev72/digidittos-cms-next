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
  SETTINGS: {
    BASE: "/settings",
  },
} as const;
