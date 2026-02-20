export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface BlogAuthor {
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  author: BlogAuthor;
  seo: BlogSeo;
  readingTime: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  status?: "draft" | "published" | "archived";
  seo?: BlogSeo;
}

export interface UpdateBlogData {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  status?: "draft" | "published" | "archived";
  seo?: BlogSeo;
}

export interface BlogTag {
  tag: string;
  count: number;
}
