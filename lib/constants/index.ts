export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Digidittos CMS";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  AUTHOR: "author",
  VIEWER: "viewer",
} as const;
