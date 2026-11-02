import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Post } from "@/types/post";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "29 October 2026", or an empty string if the date is missing or unparseable. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Most seeded posts have a null excerpt, so fall back to the opening of the
 * content and cut on a word boundary rather than mid-word.
 */
export function excerptOf(post: Post, maxLength = 180): string {
  const source = post.excerpt?.trim() || post.content?.trim() || "";
  if (source.length <= maxLength) return source;

  const clipped = source.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

/** The API stores tags as one comma-separated string. */
export function tagsOf(post: Post): string[] {
  return (post.tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/** Roughly 230 words a minute, floored at one minute. */
export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

/** Splits the API's plain-text content into paragraphs for the article body. */
export function paragraphsOf(content: string): string[] {
  const byBlankLine = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (byBlankLine.length > 1) return byBlankLine;

  // Some posts arrive as one unbroken block. Group sentences so the article
  // is still readable instead of a single wall of text.
  const sentences = content.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [content];
  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += 4) {
    chunks.push(sentences.slice(i, i + 4).join("").trim());
  }
  return chunks.filter(Boolean);
}
