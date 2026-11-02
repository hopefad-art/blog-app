import { useEffect, useState } from "react";
import { useNavigation } from "@/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/blog/Pagination";
import {
  PostListEmpty,
  PostListError,
  PostListSkeleton,
} from "@/components/blog/PostListStates";
import { usePostList } from "@/hooks/usePosts";

const PER_PAGE = 9;

export default function HomePage() {
  // Page and search live in the URL, so the browser back button steps through
  // them and any view of the list can be linked to or reloaded.
  const { search: searchParams, setSearch } = useNavigation();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const search = searchParams.get("search") ?? "";

  // The input is kept separately so typing stays instant; it is copied into
  // the URL (and so into the query) once the typing pauses.
  const [draft, setDraft] = useState(search);

  // When the URL's search changes from somewhere other than this input (the
  // back button, or the Clear button), bring the input back in step with it.
  // Adjusting during render rather than in an effect avoids a second paint.
  const [lastSearch, setLastSearch] = useState(search);
  if (search !== lastSearch) {
    setLastSearch(search);
    if (search !== draft.trim()) setDraft(search);
  }

  useEffect(() => {
    if (draft === search) return;
    const timer = setTimeout(() => {
      setSearch(draft.trim() ? { search: draft.trim() } : {}, { replace: true });
    }, 400);
    return () => clearTimeout(timer);
  }, [draft, search, setSearch]);

  // The create page sends the new post's id back as ?new=<id> so the list can
  // flag it. A query param rather than router state, so it survives a reload
  // and behaves the same under both routers.
  const newPostId = searchParams.get("new");

  const { data, error, isPending, isFetching, refetch } = usePostList({
    page,
    limit: PER_PAGE,
    search,
  });

  const goToPage = (next: number) => {
    const params: Record<string, string> = { page: String(next) };
    if (search) params.search = search;
    setSearch(params);
    window.scrollTo({ top: 0 });
  };

  const posts = data?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl leading-[1.1] font-semibold text-balance sm:text-5xl">
          Writing about writing for the web
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Essays on copy, structure and search, pulled live from the posts API. Read one, or add
          your own.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full max-w-md">
          <label htmlFor="post-search" className="mb-2 block text-sm font-semibold">
            Search posts
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft"
            />
            <Input
              id="post-search"
              type="search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Try “copywriting” or “keywords”"
              autoComplete="off"
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex min-h-11 items-center gap-3">
          <p aria-live="polite" className="text-sm text-ink-soft">
            {data
              ? search
                ? `${data.meta.total} posts match “${search}”`
                : `${data.meta.total} posts`
              : " "}
          </p>
          {search && (
            <Button variant="quiet" size="sm" onClick={() => setSearch({})}>
              <X aria-hidden="true" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8">
        {isPending && <PostListSkeleton count={PER_PAGE} />}

        {error && !isPending && (
          <PostListError message={error.message} onRetry={() => void refetch()} />
        )}

        {data && !error && posts.length === 0 && (
          <PostListEmpty search={search} onClear={() => setSearch({})} />
        )}

        {data && !error && posts.length > 0 && (
          <>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.id} className="h-full">
                  <PostCard post={post} isNew={post.id === newPostId} />
                </li>
              ))}
            </ul>

            <div className="mt-10">
              {/* The page number comes from the URL rather than the last
                  response, so the indicator updates on click instead of
                  waiting for the next page to arrive. */}
              <Pagination
                meta={{
                  ...data.meta,
                  page,
                  hasPreviousPage: page > 1,
                  hasNextPage: page < data.meta.totalPages,
                }}
                onPageChange={goToPage}
                busy={isFetching}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
