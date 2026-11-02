import { ArrowLeft, Compass } from "lucide-react";
import { AppLink, useNavigation } from "@/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  /** Lets the post page reuse this for a post id that doesn't resolve. */
  title?: string;
  message?: string;
}

/**
 * Rendered by the catch-all route for any path that matches nothing, and by
 * the post page when the API says that post does not exist.
 */
export default function NotFoundPage({
  title = "We can't find that page",
  message = "The link may be out of date, or the address may have a typo in it.",
}: Props) {
  const { back } = useNavigation();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-24 text-center sm:px-6">
      <p className="font-display text-6xl font-semibold text-accent">404</p>
      <Compass className="size-8 text-ink-soft" aria-hidden="true" />
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="text-ink-soft">{message}</p>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <AppLink to="/">Go to all posts</AppLink>
        </Button>
        <Button variant="outline" onClick={back}>
          <ArrowLeft aria-hidden="true" />
          Back to the previous page
        </Button>
      </div>
    </div>
  );
}
