# Smart Bookmark App

An App which helps you to save and manage bookmarks in one place. You sign in with Google, add links with a title and URL, and they stay in sync across tabs and devices. I built it to learn the Next.js App Router with Supabase and to have a personal bookmark manager that actually stays out of the way.

# Features

- Google OAuth login – Sign in with a Google account; no passwords to manage.
- Private bookmarks per user – Each user only sees and can change their own bookmarks.
- Add and delete bookmarks – Simple form (title + URL) and a delete button on each card with a quick confirmation.
- Realtime updates– Open the app in two tabs; add or delete in one and the other updates without a refresh.
- Secure access – Supabase Row Level Security (RLS) ensures the database only returns or changes rows for the logged-in user.

# Tech stack

- Next.js 16 (App Router, no Pages Router)
- Supabase (Auth with Google, Postgres for bookmarks, Realtime for live updates)
- Tailwind CSS for styling
- Framer Motion for light animations (landing, login, bookmark cards)
- Deployed on Vercel

# How the app works

Auth is handled by Supabase. When you sign in with Google, Supabase issues a session that we store in cookies (via `@supabase/auth-helpers-nextjs`). We use one Supabase client in the browser (for forms, logout, realtime) and one on the server (for fetching the current user and bookmarks). That way both client components and server components see the same session.

Bookmarks live in a single `bookmarks` table keyed by `user_id`. Every query and Realtime subscription runs with the user’s JWT, so RLS automatically limits results to that user’s rows. We don’t pass `user_id` in the query; RLS does the filtering.

Realtime is a Postgres Changes subscription on the `bookmarks` table for INSERT and DELETE. When a row is inserted or deleted, Supabase pushes an event only if the row is visible to the current user under RLS. The client updates local state so the list re-renders (with a small animation). We avoid duplicates when adding in the same tab by checking if the new row’s id is already in the list before appending.

Protected routes are enforced on the server. The bookmarks page calls `getUser()` and redirects to `/login` if there’s no session. The login page does the opposite: if there is a session, it redirects to `/bookmarks`. So you can’t stay on the login page when logged in or reach the bookmarks page when logged out. The navbar is a client component that uses `getSession()` and `onAuthStateChange` to show the right links and a logout button.

## Local setup

1. Clone the repo and install dependencies:

   npm install

2. Create a `.env.local` in the project root and add your Supabase values:
   - `NEXT_PUBLIC_SUPABASE_URL` – your project URL from the Supabase dashboard
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – the anon/public key

   Do not commit this file.

3. In Supabase: enable the Google auth provider (Auth → Providers), set your OAuth client ID and secret, and add your site URL and redirect URL (e.g. `http://localhost:3000/auth/callback` for local dev). Create the `bookmarks` table and RLS policies (see `supabase/schema.sql` and `supabase/rls-policies.sql`), and enable the table for Realtime in the Realtime / Publication settings.

4. Run the dev server:

   npm run dev

   Open http://localhost:3000. You should see the landing page; use “Try it free” to go to login and then to the bookmarks page after signing in.

# Deployment

The app is set up to deploy on Vercel. Connect the repo, add the same env variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings, and deploy. After that, in Supabase (Auth → URL configuration) add your production site URL and redirect URL (e.g. `https://your-app.vercel.app` and `https://your-app.vercel.app/auth/callback`). Without that, Google sign-in will fail in production.

# Problems I faced and how they were solved

Auth in the App Router--> The tricky part was having a single session work for both client and server. We use cookie-based sessions so the server can read the same session that the client has. The server client is created per-request with `cookies()` from `next/headers` and passes `getAll` / `setAll` so Supabase can read and write the auth cookies. That way `getUser()` on the server and `getSession()` on the client stay in sync.

Protecting routes--> We don’t use middleware for auth. Instead, the bookmarks page is an async server component that calls `getUser()` and redirects to `/login` if there’s no user. The login page does the reverse and redirects to `/bookmarks` if there is a user. It’s simple and keeps all auth checks in one place per route.

Realtime without duplicates--> When you add a bookmark in the same tab, we both insert via the client and call `router.refresh()`, so the server refetches and sends new props. The Realtime subscription also fires for that insert. To avoid showing the same bookmark twice, the INSERT handler checks whether the new row’s id is already in the list before adding it to state.

RLS and Realtime--> Realtime respects RLS. The subscription is to the whole `bookmarks` table, but Supabase only sends events for rows the current user is allowed to see. So we didn’t need to filter by `user_id` in the subscription; RLS does it.

Logout and navbar state--> The navbar needs to know if the user is logged in. We use `getSession()` on mount and `onAuthStateChange` so that after logout (or login in another tab) the navbar updates without a full reload. Logout is a two-click flow (“Click again to logout”) to avoid accidental sign-outs.

# Final notes

I got a solid feel for the App Router, server vs client components, and how to wire Supabase auth and Realtime into a Next app without fighting the framework. If I had more time, I’d add middleware to centralize redirects (e.g. redirect logged-in users away from `/login` before the page runs), and maybe edit bookmarks or simple folders/tags. The current setup is enough for a minimal, usable bookmark app that stays in sync and keeps data private per user.
