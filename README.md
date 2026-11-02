# Inkworld

A blog application built with React Router, TanStack Router and TanStack Query, reading from
the public posts API at [api.oluwasetemi.dev](https://api.oluwasetemi.dev).

Live site: https://blog-app-navy-two.vercel.app

## Features

- Home page listing posts as cards, each with a title and excerpt, linking to its own page
- Detail page at `/posts/:postId` showing the full post, with a way back to the home page and
  to the previous page
- Create a new post, validated before it is sent
- Search and pagination, both stored in the URL
- 404 page for unknown routes and for a post id the API does not recognise
- Error Boundary around every route
- Lazy loading with Suspense, so each page is downloaded only when first visited
- Two routers: React Router serves the app at `/`, TanStack Router serves the same pages at
  `/ts`. The link in the header switches between them.

## Run it

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Stack

React 19, TypeScript, Vite, React Router 7, TanStack Router 1, TanStack Query 5,
React Hook Form with zod, Tailwind CSS v4, Lucide icons. Hosted on Vercel.

## How the two routers work

Two routers cannot both own the browser's history for the same paths, so only one is mounted
at a time. `main.tsx` checks whether the address starts with `/ts` and mounts TanStack Router
if it does, React Router otherwise.

So the pages are not tied to either library, nothing in `pages/` imports from a router. They
go through a small adapter in `navigation/` that exposes the current path, the route params,
the query string, navigate, back and Link. Each router supplies its own implementation.
