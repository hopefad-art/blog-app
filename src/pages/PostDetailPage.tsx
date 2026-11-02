import { ArrowLeft, Eye, RotateCw, WifiOff } from "lucide-react";
import { AppLink, useNavigation } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { usePost } from "@/hooks/usePosts";
import { ApiError } from "@/lib/api";
import { formatDate, paragraphsOf, readingMinutes, tagsOf } from "@/lib/utils";
import NotFoundPage from "./NotFoundPage";

export default function PostDetailPage() {
  // The :postId segment accepts the post's id or its slug; the API resolves both.
  const { params, back } = useNavigation();
  const postId = params.postId;
  const { data: post, error, isPending, refetch } = usePost(postId);

  // A post that isn't there is a 404, not a failure worth a retry button.
  if (error instanceof ApiError && error.status === 404) {
    return <NotFoundPage title="That post doesn't exist" />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-center gap-2">
        {/* Back to wherever they came from, then an always-correct route home. */}
        <Button variant="quiet" size="sm" onClick={back}>
          <ArrowLeft aria-hidden="true" />
          Back
        </Button>
        <span className="text-rule-strong" aria-hidden="true">
          |
        </span>
        <Button variant="quiet" size="sm" asChild>
          <AppLink to="/">All posts</AppLink>
        </Button>
      </div>

      {isPending && <ArticleSkeleton />}

      {error && !isPending && (
        <div
          role="alert"
          className="mt-8 flex flex-col items-center gap-4 rounded-lg border border-alarm/25 bg-alarm-wash px-6 py-14 text-center"
        >
          <WifiOff className="size-9 text-alarm" aria-hidden="true" />
          <div className="max-w-sm space-y-1">
            <h1 className="font-display text-xl font-semibold">Couldn't load this post</h1>
            <p className="text-ink-soft">{error.message}</p>
          </div>
          <Button variant="outline" onClick={() => void refetch()}>
            <RotateCw aria-hidden="true" />
            Try again
          </Button>
        </div>
      )}

      {post && (
        <article className="mt-8">
          <header className="border-b border-rule pb-8">
            <h1 className="font-display text-3xl leading-[1.15] font-semibold text-balance sm:text-4xl">
              {post.title}
            </h1>

            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft">
              {post.author && (
                <>
                  <span>By {post.author}</span>
                  <span className="text-rule-strong" aria-hidden="true">
                    |
                  </span>
                </>
              )}
              <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
              <span className="text-rule-strong" aria-hidden="true">
                |
              </span>
              <span>{readingMinutes(post.content)} min read</span>
              {post.viewCount > 0 && (
                <>
                  <span className="text-rule-strong" aria-hidden="true">
                    |
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="size-3.5" aria-hidden="true" />
                    {post.viewCount} {post.viewCount === 1 ? "view" : "views"}
                  </span>
                </>
              )}
            </p>

            {tagsOf(post).length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {tagsOf(post).map((tag) => (
                  <li key={tag}>
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
            )}
          </header>

          <div className="prose-article mt-8">
            {paragraphsOf(post.content).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 border-t border-rule pt-6">
            <Button variant="outline" asChild>
              <AppLink to="/">
                <ArrowLeft aria-hidden="true" />
                Back to all posts
              </AppLink>
            </Button>
          </div>
        </article>
      )}
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div role="status" aria-busy="true" className="mt-8">
      <span className="sr-only">Loading post</span>
      <div aria-hidden="true">
        <div className="h-9 w-11/12 animate-pulse rounded bg-rule" />
        <div className="mt-3 h-9 w-2/3 animate-pulse rounded bg-rule" />
        <div className="mt-6 h-3 w-56 animate-pulse rounded bg-rule/70" />
        <div className="mt-10 space-y-3">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded bg-rule/70"
              style={{ width: `${[100, 97, 99, 72, 100, 95, 98, 88, 60][i]}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
