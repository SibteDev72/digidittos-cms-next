export interface Content {
  _id: string;
  title: string;
  slug: string;
  body: string;
  excerpt?: string;
  status: "draft" | "published" | "archived";
  author: string;
  featuredImage?: string;
  tags?: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
}
