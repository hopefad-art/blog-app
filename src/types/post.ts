/**
 * These types mirror what https://api.oluwasetemi.dev/posts actually returns.
 * Most fields come back as null for a lot of the seeded posts, so almost
 * everything except id, title and content is optional here.
 */

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  status: PostStatus;
  category: string | null;
  tags: string | null;
  viewCount: number;
  author: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** The `meta` block the list endpoint sends alongside `data`. */
export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PostListResponse {
  data: Post[];
  meta: PageMeta;
}

/** The body POST /posts accepts. Only title and content are required. */
export interface NewPost {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string;
  featuredImage?: string;
  author?: string;
  status?: PostStatus;
}
