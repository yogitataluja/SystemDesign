# Micro Frontends — Module Federation with Vite

A minimal micro frontend setup: a **container** (host) app that composes two independently
deployable remotes — **homepage** and **courses** — at runtime using
[Module Federation](https://module-federation.io/) via
[`@module-federation/vite`](https://www.npmjs.com/package/@module-federation/vite).

Each app is a standalone React + TypeScript + Vite project with its own `package.json`,
`node_modules`, and dev server. They can be developed, built, and deployed separately.

## Architecture

```
                    ┌─────────────────────────────┐
                    │   container  (host, :5173)   │
                    │   name: containerPage        │
                    │   react-router-dom           │
                    │                              │
                    │   /         → HomePage       │
                    │   /courses  → Course         │
                    └───────┬──────────────┬───────┘
                            │              │
             loads remoteEntry.js at runtime
                            │              │
              ┌─────────────▼──┐        ┌──▼──────────────┐
              │ homepage :5174 │        │ courses  :5175  │
              │ name: mainPage │        │ name: coursePage│
              │                │        │                 │
              │ exposes:       │        │ exposes:        │
              │  ./HomePage    │        │  ./Course       │
              └────────────────┘        └─────────────────┘
```

`react` and `react-dom` are declared as **shared singletons** in all three apps, so the
browser loads exactly one React instance. Without this, hooks break across the host/remote
boundary.

### Apps

| App | MF name | Port | Role | Exposes |
|---|---|---|---|---|
| `container` | `containerPage` | 5173 | Host — routing + shell | — |
| `homepage` | `mainPage` | 5174 | Remote | `./HomePage` |
| `courses` | `coursePage` | 5175 | Remote | `./Course` |

## Getting started

Install dependencies in each app (they are separate npm projects — there is no workspace root):

```bash
cd homepage && npm install && cd ../courses && npm install && cd ../container && npm install
```

### Running in development

Each app needs its own terminal. **Start the remotes before the container** — the host
fetches `remoteEntry.js` from both remotes as it loads.

```bash
cd homepage && npm run dev
```

```bash
cd courses && npm run dev
```

```bash
cd container && npm run dev
```

Then open **http://localhost:5173**.

The remotes also run standalone at http://localhost:5174 and http://localhost:5175, which is
useful for developing a micro frontend in isolation.

### Building

```bash
cd homepage && npm run build
cd ../courses && npm run build
cd ../container && npm run build
```

Each build runs `tsc -b` first, then emits `dist/` containing that app's assets and its
`remoteEntry.js` manifest. Preview a production build with `npm run preview` (same ports).

## How the wiring works

### Remote — exposing a component

Each remote declares what it makes public. From [`courses/vite.config.ts`](courses/vite.config.ts):

```ts
federation({
  name: 'coursePage',
  filename: 'remoteEntry.js',
  exposes: {
    './Course': './src/components/Coures.tsx',
  },
  dts: false,
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

### Host — consuming remotes

The container points at each remote's entry URL. From [`container/vite.config.ts`](container/vite.config.ts):

```ts
federation({
  name: 'containerPage',
  filename: 'remoteEntry.js',
  remotes: {
    mainPage: {
      type: 'module',
      name: 'mainPage',
      entry: 'http://localhost:5174/remoteEntry.js',
    },
    coursePage: {
      type: 'module',
      name: 'coursePage',
      entry: 'http://localhost:5175/remoteEntry.js',
    },
  },
  // ...shared react/react-dom singletons
})
```

### Host — rendering them

Federated modules resolve **asynchronously**, so remotes are loaded with `React.lazy()` and
wrapped in `<Suspense>`. A static `import` would break the initial render.
From [`container/src/App.tsx`](container/src/App.tsx):

```tsx
const HomePage = lazy(() => import('mainPage/HomePage'));
const Courses = lazy(() => import('coursePage/Course'));

<Suspense fallback={<div>Loading…</div>}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/courses" element={<Courses />} />
  </Routes>
</Suspense>
```

The import specifier is always **`<remote MF name>/<exposed key>`** — these are case
sensitive and must match the configs exactly.

### TypeScript for remote modules

Remote imports have no local files to resolve against, so their types are declared by hand in
[`container/src/remoteTypes.d.ts`](container/src/remoteTypes.d.ts):

```ts
declare module 'coursePage/Course' {
  const Course: React.ComponentType;
  export default Course;
}
```

Automatic type sharing (`dts`) is disabled — it tries to download an `@mf-types.zip` from each
remote and was failing noisily in dev.

### The bootstrap indirection

[`container/src/main.tsx`](container/src/main.tsx) is just `import('./bootstrap')`. This
dynamic import defers app startup by one tick so Module Federation can negotiate the shared
scope (deciding which copy of React everyone uses) **before** any component renders. Rendering
directly from `main.tsx` would race that negotiation.

## Conventions and gotchas

- **Ports are pinned.** All three configs use `strictPort: true`. The host hardcodes the remote
  URLs, so a silent fallback to another port would produce a confusing "remote failed to load"
  instead of a clear startup error. Keep it on.
- **Remotes need CORS.** Each app sets `cors: true` and an explicit `origin` so the host can
  fetch `remoteEntry.js` cross-origin.
- **`build.target: 'esnext'`** is required — Module Federation relies on top-level `await`.
- **Remotes expose leaf components**, not their `App.tsx` wrappers, so the container does not
  inherit each remote's `App.css`. If you'd rather each micro frontend ship its own styling,
  point `exposes` at `./src/App.tsx` instead.
- **Adding a new remote** takes four steps: add `federation({ name, exposes, shared })` to the
  new app's `vite.config.ts` on a fresh port, add it to the container's `remotes`, add a module
  declaration to `remoteTypes.d.ts`, then `lazy()` it into a route.

## Troubleshooting

**`Error: Port 5175 is already in use`** — a previous dev server is still running. Free the ports:

```bash
lsof -ti tcp:5173 -ti tcp:5174 -ti tcp:5175 | xargs kill
```

**`Failed to fetch dynamically imported module` / remote won't load** — the remote's dev server
isn't running, or started after the container. Start the remotes first, then reload the host.

**`504 (Outdated Optimize Dep)`** — Vite re-optimized dependencies and invalidated its cache.
Hard-reload the browser. If it persists, clear the caches and restart:

```bash
rm -rf container/node_modules/.vite homepage/node_modules/.vite courses/node_modules/.vite
```

**Hook errors (`Invalid hook call`, `useState of null`)** — two React copies are loaded. Verify
`react` and `react-dom` are `singleton: true` in *every* app's federation config and that the
versions in each `package.json` match.

## Tech stack

React 19 · TypeScript · Vite 8 · `@module-federation/vite` · React Router 7
