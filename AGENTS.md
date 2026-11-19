<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Commonplace client

- Login lives at `/login` and registration lives at `/signup`. Each page has its own submit handler and links to the other page. The forms use Better Auth email/password authentication. Google sign-in currently displays an availability toast.

## Project scope and current state

This repository is the Commonplace client, a community-service event platform. The responsive homepage and Create Event form UI are implemented from the user's supplied designs. The form submits to a local backend; authentication and live homepage event data are still pending.

- `/`, defined in `src/app/page.js`, composes the hero, community statistics, features, upcoming event cards, story gallery, and newsletter UI.
- `/add-form`, defined in `src/app/add-form/page.jsx`, renders the Create Event form with a required Host Name for an organization or community group. Required-field, future-date, and HTTP(S) image URL validation run before POSTing to `http://localhost:3001/add-event`. The response is read as JSON or text according to its Content-Type. Loading, success, and failure show toasts. Successful submission resets the form; failed submission preserves entries. There is no redirect. The submit button is disabled while a request is pending.
- `/all-events`, defined in `src/app/all-events/page.jsx`, fetches the event array from `GET http://localhost:3001/events` at request time. The async results component calls `io()` from `next/cache` outside its error handler and is wrapped in Suspense, so the page shell and skeleton can prerender with Cache Components enabled. Past/today dates are excluded using the Bangladesh calendar date, and results are sorted by date.
- `EventsBrowser` provides client-side category filters, title/location/host search, nine-event pagination, and empty/error states. Pagination appears only when more than one page is needed. Shared navigation and homepage event links open `/all-events`.
- `/all-events/[id]` is a public event-details page using `GET http://localhost:3001/event/:id`. It awaits `params` inside a Suspense-wrapped async component and validates MongoDB ObjectIds before fetching. Empty or missing records render the route's not-found UI; API failures show an error state.
- Event details include a responsive photo/title hero, date and location, actual description and host name, general volunteer guidelines, and a schedule summary using the available date/location. The API does not supply times, verification, or participant data; do not invent those facts.
- Join posts the volunteer’s ID, name, email, and event details to Express `POST /join-event`. MongoDB generates a separate joined-record ID. Leave calls `DELETE /leave-event/:id` with that ID, including after a page reload. The signed-in `/joined-events` page displays joined events in date order.
- Navbar and footer are shared by all pages and mounted inside `<body>` in the root layout. Do not add duplicate instances to individual pages. Shared links to homepage sections use `/#section-id` so they also work from `/add-form`.
- `src/data/home.js` holds static features and gallery captions. Sample event records have been removed. The homepage's `UpcomingEvents` component still accepts an `events` prop and shows an empty state until that separate homepage feed is connected; `/all-events` already uses the API.
- Event cards use the API fields `_id`, `title`, `type`, `date`, `location`, `description`, `thumbnailUrl`, and `hostName`, and link to `/all-events/[id]`. The shared card supports a `listing` variant for `/all-events`. Create-event links open `/add-form`; login and newsletter subscription still show informational toasts. Reading and creating events use the local Express backend; database persistence is owned by that separate backend.
- The form's organizer email is marked as available after login. When authentication is implemented, attach the actual authenticated user's email and protect `/add-form`; do not use a hardcoded sample email as the organizer identity.
- There are no implemented Next.js API routes, authentication flows, direct database integrations, application state libraries, or committed automated tests. Shared UI primitives are installed under `src/components/ui`.
- `README.md` is the default create-next-app documentation. Its `app/page.js` example refers to `src/app/page.js` in this repository.
- No environment variables are referenced by the current source, and no environment template is provided.

## Stack and tooling

- JavaScript and JSX, with ES module imports; configuration files use `.mjs`.
- Next.js `16.4.6`, React and React DOM `19.3.0`.
- Tailwind CSS `4.3.3`, integrated through `@tailwindcss/turbopack` `4.3.3`.
- React Compiler is enabled, with `babel-plugin-react-compiler` `1.0.0` installed.
- ESLint 9 with the Next.js Core Web Vitals flat configuration.
- Use npm; `package-lock.json` is the committed dependency lockfile. Keep it synchronized when changing dependencies.
- The installed Next.js package requires Node.js `>=20.9.0`; no repository-specific Node version pin is present.

## File map

| Path | Responsibility |
| --- | --- |
| `src/components/auth/` | Separate login and signup forms and their shared input field. |
| `src/app/layout.js` | Root HTML/body shell, shared navbar/footer, global CSS import, font variables, and Commonplace metadata. |
| `src/app/page.js` | Responsive homepage at `/`; remains a Server Component. |
| `src/app/add-form/page.jsx` | Server Component page shell and metadata for creating an event. |
| `src/app/all-events/page.jsx` | Upcoming event listing shell, metadata, and streamed API request. |
| `src/app/all-events/[id]/` | Public details route, API request, and custom not-found page. |
| `src/components/events/event-details.jsx` | Responsive event hero, description, guidelines, schedule summary, and organizer information. |
| `src/components/events/event-actions.jsx` | Share, join, and leave controls for event details. |
| `src/components/events/event-details-loading.jsx` | Skeleton for streamed event details. |
| `src/components/events/events-browser.jsx` | Client-side event filters, search, pagination, and result states. |
| `src/components/events/events-loading.jsx` | Loading skeleton for the streamed event listing. |
| `src/components/events/create-event-form.jsx` | Client Component with event fields, Host Name, validation, and a POST request to the local Express backend. |
| `src/components/home/` | Separate Hero, Features, UpcomingEvents, Gallery, and Newsletter sections, event cards, and `create-event-button.jsx` linking to `/add-form`. |
| `src/components/layout/` | Navbar with mobile menu/theme toggle, and footer. |
| `src/components/layout/profile-menu.jsx` | Signed-in menu links to Create Event, Manage Events, and Joined Events. Logout uses Better Auth. |
| `src/app/my-events/page.jsx` | Signed-in organizer dashboard using the session email and Express GET /my-events/:email. Separate Edit and Delete dialogs call PATCH /update-event/:id and DELETE /delete-event/:id, then refresh the dashboard. |
| `src/data/home.js` | Static homepage features and gallery content; no sample event records. |
| `src/app/globals.css` | Tailwind import, theme tokens, class-based dark-mode colors, and body styles. |
| `src/app/favicon.ico` | App Router favicon asset. |
| `public/images/` | Community photos extracted from the supplied homepage reference. |
| `public/` | Also contains the unused default starter SVG assets. |
| `next.config.mjs` | Next.js feature flags and the Tailwind Turbopack CSS loader. |
| `tsconfig.json` | Active compiler configuration after adding `.ts` files; maps `@/*` imports to `./src/*`. |
| `jsconfig.json` | Original JavaScript configuration with the same alias; Next.js uses `tsconfig.json` when present. |
| `eslint.config.mjs` | Core Web Vitals rules; ignores `.next`, `out`, `build`, and `next-env.d.ts`. |
| `.gitignore` | Excludes dependencies, generated output, coverage, environment files, and deployment artifacts. |

## Rendering, styling, and configuration

- `RootLayout` supplies `<html lang="en">`, full-height and antialiasing classes, and a flex-column body. Keep the required root HTML/body structure when editing it.
- Metadata uses the Commonplace name, community tagline, and volunteer-event description.
- DM Sans and Space Grotesk are loaded through `next/font/google` with Latin subsets and exposed as `--font-dm-sans` and `--font-space-grotesk`. Production builds need Google Fonts access on a cold cache.
- `globals.css` imports Tailwind, `tw-animate-css`, and `shadcn/tailwind.css`. Semantic colors use the design's forest green, sage, cream, and coral palette, including dark-mode surfaces.
- Base styles apply border/outline tokens globally, background/foreground to the body, DM Sans to body text, and Space Grotesk 700 to headings. Shared layout classes live in `@layer components`; most component styling uses Tailwind utilities.
- The navbar theme toggle changes the HTML `.dark` class and saves the choice in local storage under `commonplace-theme`. The mobile menu uses local React state.
- Tailwind is wired through `turbopack.rules["*.css"]` in `next.config.mjs`. There is no PostCSS or Tailwind configuration file. Preserve the existing integration unless the task requires changing it.
- Next.js configuration enables `cacheComponents`, `partialPrefetching`, `reactCompiler`, and `experimental.agentFeedback`. Consult the installed documentation before changing these settings or adding data-fetching behavior.

## shadcn UI

- `components.json` configures `base-nova`, Base UI primitives, React Server Component support, JavaScript output (`tsx: false`), neutral CSS variables, Lucide icons, and no RTL. Do not assume Radix APIs or `asChild`; inspect the local component and its Base UI API before composing it.
- Reuse components from `@/components/ui` before adding duplicate primitives. The installed set includes forms, navigation, overlays, sidebar, tables, charts, calendar, carousel, toasts, and messaging/code-display components such as `message`, `bubble`, `attachment`, `questionnaire`, `trace`, and `code-block`. These are building blocks, not implemented product flows.
- Aliases: `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, and `@/hooks`. `src/lib/utils.js` re-exports `cn` from the `cn` package; generated components also import directly from `cn`. Do not assume a local clsx/tailwind-merge implementation.
- Variants use `class-variance-authority`; preserve semantic theme classes, accessibility behavior, and `data-slot` attributes when editing primitives.
- `src/hooks/use-mobile.js` provides a 768px mobile breakpoint. `src/hooks/use-highlighted-code.js` supports incremental code highlighting through `src/lib/highlighter.jsx`, which lazily loads Shiki languages and GitHub light/dark themes.
- Supporting dependencies include `@base-ui/react`, `@shadcn/react`, Lucide, Recharts, date-fns, react-day-picker, Embla, cmdk, input-otp, react-resizable-panels, and Shiki. Check `package.json` for current versions.
- `react-hot-toast` is installed; its `Toaster` is mounted by the navbar. No sidebar provider is currently mounted. Check provider requirements before using additional components.

## Figma typography requirements

The user supplied these font choices for the COMMONPLACE Figma design; they are implemented in the root layout and theme.

- Space Grotesk, bold (700): headings, hero titles, and card titles.
- DM Sans, regular (400), medium (500), and bold (700): paragraphs, navigation, buttons, and forms.

## Working conventions

- Keep code simple and readable. Prefer straightforward solutions over clever or complicated approaches.
- Use beginner-friendly JavaScript. Avoid advanced syntax, complicated abstractions, unnecessary design patterns, and premature optimization.
- Read the relevant installed Next.js guide before writing application code. Start with `node_modules/next/dist/docs/01-app/01-getting-started/`; consult the matching API reference for the feature being changed.
- Keep the managed Next.js instructions above intact. Put project-specific guidance outside the managed markers.
- Use simple, beginner-friendly commit messages, such as `add navbar`, `create login page`, or `fix event form`, as requested by the user.
- Match the surrounding JavaScript/JSX style: double quotes and two-space indentation; generated UI files often omit semicolons. No formatter configuration exists. A TypeScript configuration is now present for `.ts` files; preserve the `@/*` alias in `tsconfig.json` when changing compiler settings.
- Keep routes under `src/app`. Use the existing `@/` alias where it makes imports clearer.
- Follow App Router server/client boundaries; add `"use client"` to components that need client-side interactivity rather than making the root layout a client component.
- Prefer the existing Tailwind utilities and global theme tokens for UI work. Keep global CSS imported from the root layout.
- Add dependencies, directories, and abstractions when needed by an actual feature; no additional architecture has been established yet.
- Do not edit generated `.next/` output or installed `node_modules/` files as application source. Do not commit secrets or `.env` files.
- Update this guide when routes, integrations, scripts, or established conventions change. Describe implemented behavior separately from planned work.

## Commands and validation

Run commands from the repository root:

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependencies from the committed lockfile. |
| `npm run dev` | Start the Next.js development server; the default URL is `http://localhost:3000`. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Produce a production build. |
| `npm start` | Serve a previously built production application. |

On Windows PowerShell, use `npm.cmd` instead of `npm` if execution policy blocks `npm.ps1`; changing execution policy is unnecessary.

- For application changes, run lint and an appropriate production build, and inspect affected UI flows when relevant. Report any checks that could not complete.
- No `test` or type-check script is configured. Do not claim those checks ran.
- For documentation-only edits, review the diff and file paths; a production build is unnecessary.
- Homepage validation on 2026-11-18: production build and ESLint on homepage files passed. Full-project lint also reports existing `react-hooks/set-state-in-effect` errors in `src/components/ui/carousel.jsx` and `src/hooks/use-mobile.js`, which are not used by the homepage.
