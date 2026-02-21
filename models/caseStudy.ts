export interface CaseStudySeo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface CaseStudyAuthor {
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  description: string;
  excerpt?: string;
  featuredImage?: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  author: CaseStudyAuthor;
  seo: CaseStudySeo;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseStudyData {
  title: string;
  description: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  status?: "draft" | "published" | "archived";
  publishedAt?: string;
  seo?: CaseStudySeo;
}

export interface UpdateCaseStudyData {
  title?: string;
  description?: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  status?: "draft" | "published" | "archived";
  publishedAt?: string;
  seo?: CaseStudySeo;
}

export interface CaseStudyTag {
  tag: string;
  count: number;
}
