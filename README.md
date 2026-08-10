# Carovana

> Shared trip board for groups of friends — accommodations and places on a map, who's coming, and votes to decide together where to go.

**No login.** Whoever has the trip link can see and edit everything. The map is the star; everything else is a supporting character.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Redux--Saga-purple?logo=redux&logoColor=white" alt="Redux-Saga">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Firestore-FFCA28?logo=firebase&logoColor=black" alt="Firestore">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

## What it does

- Create a trip, share the link — no account needed.
- Add accommodations and points of interest (from a link or a pin on the map), all plotted on one map.
- Mark who's coming and vote to converge on the place to book.
- Everything in real time: open the map together and choose, without scrolling through 40 chat messages.

## Stack

- **Vite** + **React 19** — JavaScript, no TypeScript.
- **Redux Toolkit** + **redux-saga** + **immer** — state and side effects.
- **react-router-dom** — routing.
- **Firebase Firestore** — real-time data, no auth.
- **react-leaflet** + OpenStreetMap — map; **Nominatim** — address search.
- **SCSS** per component, **lucide-react** for icons.

## Architecture

*Fractal* structure (grouped by feature, not file type), based on
[frontend-react-arch](https://github.com/vscaperrotta/react-arch):

```
src/
├── api/          Firebase data layer, one module per resource (trips, people, places, geocode)
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

**Data flow:** components are "dumb" — they read with `useSelector` and dispatch
actions. Firestore realtime subscriptions (`onSnapshot`) live in sagas via
`eventChannel`; mutations (create/add/vote) go through
`request → success/failure` actions.

## Setup

```bash
npm install
cp .env.example .env   # fill in with your Firebase config, see below
npm run dev
```

Open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (localhost:5173) |
| `npm run build` | Production build in `dist/` |
| `npm run preview` | Preview the build |
| `npm run lint` | Lint with oxlint |

## Firebase

The web config lives in environment variables (`.env`, gitignored — use
[`.env.example`](.env.example) as a template):

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Values come from the Firebase console for your project → Project Settings →
Web app. **It's not a secret**: access is protected by Firestore security
rules, not by hiding it — it's in a `.env` file to keep the repo reusable
across different Firebase projects (forks, separate deploys), not for
secrecy.

**Before going to production, publish the rules** from [`firestore.rules`](firestore.rules):

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules --project carovana-d3152
```

The rules are intentionally open for read/write (no login, by design) —
anyone with a trip link can edit it. **Don't put sensitive data in a trip.**

If Firestore isn't enabled yet: [console.firebase.google.com](https://console.firebase.google.com)
→ `carovana-d3152` → Firestore Database → Create database (production mode, then publish the rules above).

### Admin keys (private)

The Admin SDK service-account key goes in `.admin/` and is **never committed**
(see [`.gitignore`](.gitignore)). It's only needed for server-side/CLI
operations locally; the client app never uses it and it must never be
included in the bundle.

## Data model

```
trips/{tripId}                        { name, startDate, endDate, createdAt }
trips/{tripId}/people/{personId}      { name, createdAt }
trips/{tripId}/places/{placeId}       { type: 'stay' | 'poi', title, url, address, lat, lng,
                                         addedBy, addedByName, createdAt, votes: { [personId]: true } }
```

A vote is a toggle stored as a `votes` map directly on the place document
(no subcollection), so the count and "most voted" stay realtime with a
single listener per trip.

## Identity

No authentication. On first visiting a trip, each person picks their own
name from the participant list (or adds it) — the choice stays in
`localStorage` on that device. It's only needed to add places and vote;
viewing is always open.

## Notes

- Geocoding via [Nominatim](https://nominatim.org/) (OpenStreetMap): light/personal use, no API key. If usage grows, consider a self-hosted instance or a paid provider.
- The production bundle is ~900KB (mostly Firebase + Leaflet), above Vite's warning threshold. Not an issue for the intended use; `React.lazy` on the `Trip` route is the first move if it starts to matter.

## Contributing

PRs welcome. Before opening one: `npm run lint` and `npm run build` must
pass. Keep the component convention (default export + `index.js` +
PropTypes + co-located SCSS) and route data through sagas, not scattered
Firebase calls in components.

## License

[MIT](LICENSE) © Vittorio Scaperrotta
