# Inkworld

A blog application built with React Router, TanStack Router and TanStack Query. It reads posts from the public
API at [api.oluwasetemi.dev](https://api.oluwasetemi.dev), shows them as cards on a home page,
opens each one on its own page, and lets you publish a new post.

Live site: _add your Vercel URL here after deploying_

## Features

- **Home page** listing posts as cards, each with a title, a short excerpt, its tags and a
  reading time, linking through to the post.
- **Detail page** at `/posts/:postId` showing the full post. The route segment accepts the
  post's id or its slug, and the API resolves either.
- **Create a post** at `/new`, validated before it is sent and posted to the live API. The new
  post is flagged in the list when you land back on the home page.
- **Search and pagination**, both stored in the URL so the back button steps through them and
  any view of the list can be linked to.
- **404 page** for any address that matches nothing, and for a post id the API does not know.
- **Error Boundary** around every route, so a rendering error shows a message with a reset
  instead of a blank page.
- **Lazy loading with Suspense**: each page is downloaded only when you first visit it.
- **Two routers.** The same app is served by React Router at `/` and by TanStack Router at
  `/ts`. The link in the header moves between them.
- Loading, empty and error states throughout, and a layout that works down to phone width.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open the address Vite prints, usually http://localhost:5173.

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Type-checks, then builds into `dist/` |
| `npm run preview` | Serves the built site locally |
| `npm run lint` | Runs oxlint over the source |

## Technology stack

| Area | Choice |
| --- | --- |
| Framework | React 19, functional components and hooks |
| Language | TypeScript |
| Build tool | Vite |
| Routing | React Router 7 and TanStack Router 1 |
| Data fetching | TanStack Query 5 |
| Forms | React Hook Form with zod validation |
| Styling | Tailwind CSS v4 |
| Icons | Lucide |

## How it is put together

```
src/
  components/
    ui/          button, form field, tag
    blog/        PostCard, Pagination, list loading/empty/error states
    layout/      Header, AppShell
    ErrorBoundary.tsx, RouteFallback.tsx
  hooks/         usePosts.ts  (every query and mutation)
  lib/           api.ts (fetch wrapper), queryClient.ts, utils.ts
  navigation/    the adapter both routers implement
  pages/         HomePage, PostDetailPage, NewPostPage, NotFoundPage
  types/         post.ts
  routes.tsx         React Router's route table
  tanstackRoutes.tsx TanStack Router's route table
  main.tsx           picks which router to mount
```

A few decisions worth explaining:

**Both routers run the same pages, not two copies of the app.** Two routers cannot both own
the browser's history for the same paths, so only one is mounted at a time: `main.tsx` checks
whether the address starts with `/ts` and mounts TanStack Router if it does, React Router
otherwise. To stop the pages being tied to one library, nothing in `pages/` or `components/`
imports from either router. They go through a small adapter in `navigation/` that exposes only
what the pages actually use: the current path, the route params, the query string, a navigate
function, a back function and a Link. Each router supplies its own implementation of that
adapter. Adding a page means writing it once and listing it in both route tables.

One wrinkle worth knowing about: TanStack Router JSON-encodes search values by default, so
`?page=2` is written as `?page=%222%22`. Since the pages read the query string as plain text,
the TanStack router is configured with its own `parseSearch` and `stringifySearch` so both
routers produce identical URLs.

**Every call to the API goes through one file.** `lib/api.ts` wraps `fetch`, throws a typed
`ApiError` carrying the HTTP status, and turns the server's validation messages into a sentence
worth showing someone. Because the status comes along with the error, the detail page can tell a
missing post (404, show the 404 page) apart from a server problem (show a retry).

**Server state lives in TanStack Query, not in `useState`.** `hooks/usePosts.ts` holds the
queries and the create mutation. The list uses `placeholderData` so the previous page stays on
screen while the next one loads, instead of collapsing back to a skeleton on every click. After
a post is created, the mutation writes it into the detail cache and marks every cached list
stale, so the new post appears without a manual refetch.

**404s are not retried.** Retrying a post that does not exist just delays the answer, so the
query client only retries on network and server errors.

**Page and search live in the URL.** This is what makes the browser back button work the way
people expect, and it means a search result can be linked to or reloaded.

**The Error Boundary is keyed on the pathname.** Navigating to another route clears a previous
error rather than leaving the whole app stuck on the error screen.

## Trying the edge cases

- **Loading:** reload the home page and watch the card skeletons.
- **404 page:** visit any made-up address, for example `/does-not-exist`.
- **Missing post:** visit `/posts/not-a-real-id`.
- **Empty state:** search for something nonsense, like `zzzzz`.
- **Error state:** switch off your internet and reload, or block
  `api.oluwasetemi.dev` in the browser's network tools. A retry button appears.
- **Error Boundary:** temporarily add `throw new Error("boom")` inside `PostCard` and reload.
- **Lazy loading:** open the Network tab and move between pages. Each page arrives as its own
  JavaScript file the first time you visit it.

## Known issues and limitations

- **No authentication.** The API has a login system, but the brief does not need one, so posts
  are created anonymously. That also means a post cannot be edited or deleted from this app,
  since those endpoints need an account.
- **The API's post content is plain text.** There is no formatting stored with it, so the
  detail page splits the text into paragraphs itself. Where a post arrives as one unbroken
  block, it is grouped into paragraphs by sentence so it stays readable.
- **Search is handled by the API**, so how closely a result matches is out of the app's hands.
- **Draft posts still appear in the list.** The list endpoint returns them alongside published
  posts, and the app does not filter by status.
- **No comments.** The API supports them, but they are outside the brief.
- **Switching router is a full page load.** The link in the header moves between `/` and `/ts`,
  and since each router owns its own route tree, the browser reloads. Navigation inside either
  tree is client-side as normal.

## Future improvements

- Filter by category and status, using the query parameters the API already accepts.
- Add the comments API to the detail page.
- Add login so posts can be edited and deleted by whoever wrote them.
- Replace the plain textarea with a rich text editor and store formatted content.
- Prefetch a post on hover so opening it feels instant.
- Add tests with Vitest and React Testing Library, covering the form validation and the routing.

## Deployment

The site is a static build, so any static host works.

1. Push the project to a GitHub repository.
2. Sign in to [vercel.com](https://vercel.com) with GitHub and choose **Add New Project**.
3. Import the repository. Vercel detects Vite on its own: build command `npm run build`,
   output directory `dist`.
4. Click **Deploy**.

No environment variables are needed. Every push to `main` triggers a new deployment.

One thing to be aware of on a static host: this app uses normal URLs rather than hash URLs, so
the host has to send every path back to `index.html`. Vercel does this for Vite projects
automatically. The included `vercel.json` makes it explicit, so a direct visit to
`/posts/some-id` loads the app instead of returning a 404 from the host.
