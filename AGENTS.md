# AGENTS.md

Instructions for AI coding agents working in this repo. Humans: see [README.md](README.md).

## What this is

Carovana — a shared trip board for groups of friends: accommodations and
points of interest on a map, who's coming, votes to converge on where to
stay, walking routes between places. **No login** — whoever has the trip
link can see and edit everything. The map is the star; everything else is
a supporting character.

## Stack

- **Vite** + **React 19** — JavaScript, no TypeScript. Don't introduce TS.
- **Redux Toolkit** + **redux-saga** + **immer** — state and side effects.
- **react-router-dom** — routing.
- **Firebase Firestore** — realtime data, no auth.
- **react-leaflet** + OpenStreetMap — map; **Nominatim** — address search;
  **OpenRouteService** — walking directions.
- **SCSS** per component, **lucide-react** for icons.

## Commands

```bash
npm run dev      # dev server, localhost:5173
npm run build    # production build in dist/
npm run lint     # oxlint — must pass before considering work done
npm run test     # node --test
npm run preview  # preview the production build
```

There is no separate typecheck step (no TypeScript). Always run `npm run
lint` on changed files after edits; run `npm run build` before claiming a
change is complete if the edit could plausibly break the build.

## Architecture

*Fractal* structure (grouped by feature, not file type), based on
[frontend-react-arch](https://github.com/vscaperrotta/react-arch):

```
src/
├── api/          Firebase data layer, one module per resource (trips, people, places, routes, geocode, ors)
├── containers/   App.jsx — Redux Provider + Router
├── routes/       Home + Trip (routes.jsx defines the routes)
├── store/        Redux
│   ├── actions/    createAction + actionTypes
│   ├── reducers/   ACTION_HANDLERS with immer
│   ├── sagas/      eventChannel for realtime, request/success for mutations
│   └── selectors/
├── components/   Presentational components (default export, PropTypes, co-located SCSS)
├── utils/        Shared helpers
└── styles/       Global SCSS + config (variables, mixins, theme)
```

**Data flow:** components are "dumb" — they read with `useSelector` and
dispatch actions. Firestore realtime subscriptions (`onSnapshot`) live in
sagas via `eventChannel`; mutations (create/add/edit/delete/vote) go
through `request → success/failure` action triples. Never call Firebase
directly from a component — route it through `api/` + a saga.

## Conventions

- **Components:** one folder per component, default export from
  `Component.jsx`, re-exported via `index.js`, PropTypes on every
  exported component, co-located `Component.scss` imported directly in
  the JSX file. Follow this shape for every new component.
- **Redux:** actions live in `store/actions/<resource>.js` with an
  `actionTypes` object + `createAction` helpers (see
  `src/utils/action.js`). Reducers use immer's `produce` per action type
  in an `ACTION_HANDLERS` map — don't hand-write immutable spreads.
  Sagas: `takeLatest` for realtime subscriptions (one live listener per
  resource per trip), `takeEvery` for request/success/failure mutations.
- **i18n:** all user-facing strings go through `t('namespace.key')` from
  `src/utils/i18n.js`, with both `it` and `en` entries added together —
  locale is auto-detected from the browser, no manual switcher. Never
  hardcode user-facing text in JSX.
- **Styling:** SCSS per component, brand tokens/spacing from
  `src/styles/config` (`@use "../../styles/config" as *;`), no inline
  styles except for computed/dynamic values. Respect the existing
  spacing scale (`$space-*`) instead of hardcoding pixel values.
- **Format:** 2-space indent, single quotes, semicolons — match
  surrounding code; there's no Prettier config, so mirror what's already
  in the file.

## Data model (Firestore)

```
trips/{tripId}                        { name, startDate, endDate, createdAt }
trips/{tripId}/people/{personId}      { name, createdAt }
trips/{tripId}/places/{placeId}       { type: 'stay' | 'poi', title, price, url, address, lat, lng,
                                         addedBy, addedByName, createdAt, votes: { [personId]: true } }
trips/{tripId}/routes/{routeId}       { fromPlaceId, toPlaceId, profile: 'foot-walking',
                                         geometry: [{ lat, lng }, ...], distanceMeters, durationSeconds,
                                         addedBy, addedByName, createdAt }
```

A vote is a toggle stored as a `votes` map directly on the place document
(no subcollection) so the count stays realtime with a single listener per
trip.

## Identity model

No authentication. On first visiting a trip, each person picks their own
name from the participant list (or adds it) — the choice is stored in
`localStorage` on that device, used only to gate adding places/voting;
viewing is always open. Anyone can rename or remove anyone (no
owner/admin tier); removing someone strips their votes from every place.

## Environment / secrets

- Firebase web config (`VITE_FIREBASE_*`) is **not secret** — access is
  gated by Firestore security rules (`firestore.rules`), not by hiding
  the config. It's in `.env` only to keep the repo reusable across
  Firebase projects.
- `VITE_ORS_API_KEY` (OpenRouteService) **is meant to stay private** —
  it ships in the client bundle (no backend to hide it behind) but should
  never be committed; a leaked key just eats into quota, restrict it by
  HTTP referrer in the ORS dashboard when possible.
- The Admin SDK service-account key goes in `.admin/`, is gitignored, and
  is **never** used by the client app or included in the bundle.
- Never commit `.env`, `.admin/`, or any real API key/token. When editing
  `.env.example`, only add placeholder values.

## Deploy

Vercel, with a SPA rewrite (`vercel.json`) so deep links survive a page
refresh. `VITE_ORS_API_KEY` must be set in Vercel's project env vars
separately from local `.env` — Vite bakes env vars in at build time, so a
missing prod var silently breaks ORS requests (surfaces as a CORS error
in the browser, not an auth error, because ORS omits CORS headers on
failed auth).

## Before opening a PR / finishing a task

- `npm run lint` and `npm run build` must both pass.
- Keep the component convention (default export + `index.js` + PropTypes
  + co-located SCSS).
- Route all data access through sagas — no scattered Firebase calls in
  components.
- For UI changes, verify in a running dev server (`npm run dev`) rather
  than assuming the change works from reading the diff alone.
