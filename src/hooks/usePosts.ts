import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, getPost, listPosts, type ListPostsParams } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { NewPost, Post, PostListResponse } from "@/types/post";

/**
 * Query keys in one place so the mutation below can invalidate every cached
 * page of the list with a single prefix, whatever page or search it used.
 */
export const postKeys = {
  all: ["posts"] as const,
  list: (params: ListPostsParams) => ["posts", "list", params] as const,
  detail: (idOrSlug: string) => ["posts", "detail", idOrSlug] as const,
};

export function usePostList(params: ListPostsParams) {
  return useQuery<PostListResponse>({
    queryKey: postKeys.list(params),
    queryFn: () => listPosts(params),
    // Keeps the previous page on screen while the next one loads, so the
    // layout doesn't collapse to a skeleton on every pagination click.
    placeholderData: (previous) => previous,
    staleTime: 60_000,
  });
}

export function usePost(idOrSlug: string | undefined) {
  return useQuery<Post>({
    queryKey: postKeys.detail(idOrSlug ?? ""),
    queryFn: () => getPost(idOrSlug!),
    enabled: Boolean(idOrSlug),
    staleTime: 60_000,
    // A missing post is an answer, not a flaky network. Don't retry it.
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status === 404 ? false : failureCount < 2,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, NewPost>({
    mutationFn: createPost,
    onSuccess: (post) => {
      // Seed the detail cache so opening the new post is instant, then mark
      // every cached list stale so it reappears with the new post included.
      queryClient.setQueryData(postKeys.detail(post.id), post);
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
