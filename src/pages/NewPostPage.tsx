import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, TriangleAlert } from "lucide-react";
import { useNavigation } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { useCreatePost } from "@/hooks/usePosts";

/*
 * The API requires title and content and accepts the rest as optional.
 * The limits below match what POST /posts validates server-side, so a form
 * that passes here will not come back as a 422.
 */
const schema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give the post a title.")
    .max(500, "Titles can be at most 500 characters."),
  content: z
    .string()
    .trim()
    .min(1, "Write something before publishing.")
    .min(50, "Add a bit more. Posts should be at least 50 characters."),
  excerpt: z
    .string()
    .trim()
    .max(300, "Keep the summary under 300 characters.")
    .optional()
    .or(z.literal("")),
  author: z.string().trim().max(100, "That name is too long.").optional().or(z.literal("")),
  tags: z.string().trim().max(200, "That's a lot of tags.").optional().or(z.literal("")),
  status: z.enum(["PUBLISHED", "DRAFT"]),
});

type FormValues = z.infer<typeof schema>;

export default function NewPostPage() {
  const { navigate } = useNavigation();
  const { mutate, isPending, error } = useCreatePost();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    shouldFocusError: true,
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      author: "",
      tags: "",
      status: "PUBLISHED",
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(
      {
        title: values.title,
        content: values.content,
        status: values.status,
        // The API stores these as null, so send nothing rather than "".
        ...(values.excerpt ? { excerpt: values.excerpt } : {}),
        ...(values.author ? { author: values.author } : {}),
        ...(values.tags ? { tags: values.tags } : {}),
      },
      {
        onSuccess: (post) => {
          // Land on the list with the new post flagged, so it is obvious the
          // post really was saved and is now part of the feed.
          navigate(`/?new=${encodeURIComponent(post.id)}`);
        },
      },
    );
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Write a post</h1>
        <p className="mt-3 text-ink-soft">
          Your post is sent straight to the live API and appears in the feed. Fields marked{" "}
          <span className="text-alarm" aria-hidden="true">
            *
          </span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="mt-8 flex items-start gap-3 rounded-lg border border-alarm/25 bg-alarm-wash p-4"
        >
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-alarm" aria-hidden="true" />
          <div>
            <p className="font-semibold">The post wasn't saved</p>
            <p className="text-sm text-ink-soft">{error.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-6">
        <Field id="title" label="Title" required error={errors.title?.message}>
          {(a11y) => (
            <Input
              {...a11y}
              {...register("title")}
              autoComplete="off"
              placeholder="Ten steps to writing online copy that sells"
            />
          )}
        </Field>

        <Field
          id="excerpt"
          label="Summary"
          hint="Shown on the post card. Left blank, the opening of the post is used instead."
          error={errors.excerpt?.message}
        >
          {(a11y) => <Input {...a11y} {...register("excerpt")} autoComplete="off" />}
        </Field>

        <Field
          id="content"
          label="Post"
          required
          hint="Plain text. Leave a blank line between paragraphs."
          error={errors.content?.message}
        >
          {(a11y) => <Textarea {...a11y} {...register("content")} />}
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="author" label="Author" error={errors.author?.message}>
            {(a11y) => <Input {...a11y} {...register("author")} autoComplete="name" />}
          </Field>

          <Field
            id="tags"
            label="Tags"
            hint="Separated by commas."
            error={errors.tags?.message}
          >
            {(a11y) => (
              <Input {...a11y} {...register("tags")} autoComplete="off" placeholder="writing, seo" />
            )}
          </Field>
        </div>

        <Field id="status" label="Visibility" error={errors.status?.message}>
          {(a11y) => (
            <Select {...a11y} {...register("status")}>
              <option value="PUBLISHED">Publish now</option>
              <option value="DRAFT">Save as draft</option>
            </Select>
          )}
        </Field>

        <div className="flex flex-col-reverse gap-3 border-t border-rule pt-6 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => navigate("/")} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              "Publishing…"
            ) : (
              <>
                <Check aria-hidden="true" />
                Publish post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
