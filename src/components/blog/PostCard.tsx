import { AppLink } from "@/navigation";
import { Tag } from "@/components/ui/tag";
import { excerptOf, formatDate, readingMinutes, tagsOf } from "@/lib/utils";
import type { Post } from "@/types/post";

interface Props {
  post: Post;
  /** Marks a post created in this session so it stands out in the list. */
  isNew?: boolean;
}

/**
 * One post in the list. The whole card is one link: the anchor covers it with
 * an overlay so any click lands on the post, while the heading still carries
 * the accessible name for screen readers and keyboard users.
 */
export function PostCard({ post, isNew }: Props) {
  const date = formatDate(post.publishedAt ?? post.createdAt);
  const tags = tagsOf(post).slice(0, 3);

  return (
    <article
      className={`group relative flex h-full flex-col rounded-lg border bg-surface p-6 transition-colors ${
        isNew ? "border-ochre ring-4 ring-ochre/20" : "border-rule hover:border-rule-strong"
      }`}
    >
      {isNew && (
        <span className="mb-3 inline-flex w-fit items-center rounded-full bg-ochre px-2.5 py-0.5 text-xs font-semibold text-ink">
          Just published
        </span>
      )}

      <h2 className="font-display text-xl leading-snug font-semibold text-balance">
        <AppLink
          to={`/posts/${post.id}`}
          className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent-deep"
        >
          {post.title}
        </AppLink>
      </h2>

      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">{excerptOf(post)}</p>

      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 border-t border-rule pt-3 text-sm text-ink-soft">
        {date && <span>{date}</span>}
        {date && <span className="mx-2 text-rule-strong">|</span>}
        <span>{readingMinutes(post.content)} min read</span>
      </p>
    </article>
  );
}
