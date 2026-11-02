import type { NewPost, Post, PostListResponse } from "@/types/post";

export const API_BASE = "https://api.oluwasetemi.dev";

/**
 * Thrown for any non-2xx response. `status` lets the UI tell a missing post
 * (404, show the not-found page) apart from a server or network problem
 * (show the error state with a retry).
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    // fetch only rejects when the request never reached the server.
    throw new ApiError("Could not reach the server. Check your connection.", 0);
  }

  if (!response.ok) {
    throw new ApiError(await describeFailure(response), response.status);
  }

  return (await response.json()) as T;
}

/** Turns an error response into a sentence worth showing someone. */
async function describeFailure(response: Response): Promise<string> {
  if (response.status === 404) return "That post does not exist.";

  try {
    const body = await response.json();
    const issues = body?.error?.issues ?? body?.issues;
    if (Array.isArray(issues) && issues.length > 0) {
      return issues.map((i: { message?: string }) => i.message).filter(Boolean).join(" ");
    }
    if (typeof body?.message === "string") return body.message;
  } catch {
    // Body was not JSON. Fall through to the generic message.
  }

  return `The server responded with ${response.status}.`;
}

export interface ListPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export function listPosts({
  page = 1,
  limit = 9,
  search,
  category,
}: ListPostsParams = {}): Promise<PostListResponse> {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search?.trim()) query.set("search", search.trim());
  if (category?.trim()) query.set("category", category.trim());

  return request<PostListResponse>(`/posts?${query}`);
}

/**
 * The detail endpoint accepts an id or a slug. It returns the post on its own
 * rather than wrapped in `data`, but we unwrap defensively so either shape works.
 */
export async function getPost(idOrSlug: string): Promise<Post> {
  const body = await request<Post | { data: Post }>(`/posts/${encodeURIComponent(idOrSlug)}`);
  return "data" in body ? body.data : body;
}

export async function createPost(input: NewPost): Promise<Post> {
  const body = await request<Post | { data: Post }>("/posts", {
    method: "POST",
    body: JSON.stringify({ status: "PUBLISHED", ...input }),
  });
  return "data" in body ? body.data : body;
}
