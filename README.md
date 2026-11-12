# Bubbles LIMS

A Laundry Information Management System for a commercial laundry: clients and their contacts, client jobs (yachts,
villas, hotels…), the catalogue of services and items with prices, and the work orders that move laundry through
the building. It's a mobile-first Progressive Web App backed by Firebase.

> **Status:** the initial rework is done (see [app/docs/Tasks.md](app/docs/Tasks.md)). Batches, Quotes, Invoices and
> Templates are basic named records for now, and the Dashboard shows sample data until each section is connected.

## Tech stack

| Area | Used |
|---|---|
| App | React 19, TypeScript, Vite 7, React Router 7 |
| Styling | Tailwind CSS 3.4 with named colour tokens, lucide-react icons |
| Data | TanStack React Query 5 (loading, caching, refresh), Zustand 5 (small app-wide state) |
| Backend | Firebase: Authentication, Firestore, Cloud Functions (2nd gen, Node 22), Hosting |
| PWA | vite-plugin-pwa (installable, offline app shell) |

## Getting started

Requirements: Node 20 or newer, npm, and the Firebase CLI (`npm install -g firebase-tools`) for deploying.

```bash
cd app
npm install
cp ../.env.example .env.local   # then fill in the Firebase web app settings
npm run dev                     # http://localhost:5173
```

The `.env.local` values come from the Firebase console → Project settings → Your apps (web app). They're public
web settings, not secrets, but keep them out of git anyway (`*.local` and `.env*` files are ignored).

Users can't sign themselves up (sign-up is turned off in Firebase Authentication). An owner or manager adds people
in the app under **Setup → Users**.

### Scripts (in `app/`)

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run lint` | ESLint (slow on some machines; lint single folders while working, e.g. `npx eslint src/views/clients`) |
| `npm run preview` | Serve the built app locally |
| `npx tsc -b` | Type-check only |

## Project structure

```
app/
├── docs/Tasks.md            Rework checklist, decisions and notes
├── firebase.json            Hosting, Firestore rules and Functions config
├── firestore.rules          Security rules (deployed)
├── functions/               Cloud Functions: createUser, updateUser, deleteUser
│   └── src/permissions.ts   Role → permissions table (keep in step with src/functions/user_functions.ts)
└── src/
    ├── components/
    │   ├── ui/              Shared building blocks (Page, Card, Section, DataList, Form parts, Badge, Button…)
    │   ├── dashboard/       Dashboard tiles and charts
    │   ├── forms/           Shared form pieces (AddressFields)
    │   ├── layout/          AppShell, Sidebar, MobileNavigation, navigation list
    │   └── settings/        Settings tabs and the data export
    ├── functions/           Labels, option lists and helpers per area (client_, catalog_, work_order_, user_)
    ├── hooks/               React Query hooks per area (clientHooks, catalogHooks, userHooks…)
    ├── lib/                 queryClient, search helper
    ├── services/            Firestore access; firebase/crud.ts is the shared base
    ├── stores/              Zustand stores: auth, toasts, confirm dialog, device settings
    ├── types/               Data types (some describe future sections and aren't used yet)
    └── views/               One folder per section: Main (list), Card, Form, Page (one record)
```

## How a section is built

Every rebuilt section follows the same pattern, so a new one is mostly copy-and-adjust.

**Data**

- `services/<area>_service.ts` – `createCrudService<T>('collection', { label, sort })` gives `getAll`, `getOne`,
  `create`, `update` and `remove`, with readable error messages. Override a single function when a section needs
  special behaviour (e.g. deleting a client also deletes its client jobs and unlinks its contacts).
- `create` fills in `id`, `timestamp.createdAt/updatedAt` and `createdBy` (who created it) automatically; `update`
  sets `timestamp.updatedAt`.
- `listWhere()` finds linked records, e.g. contacts where `clientId` is a given client.
- `hooks/` – `createCrudHooks('collection', service)` gives `useList`, `useOne`, `useCreate`, `useUpdate` and
  `useRemove`. Lists refresh by themselves after a change, failed saves show an error message, and cached data is
  cleared on sign-out.

**Screens** (`views/<section>/`)

- `Main.tsx` – `Page` with header buttons (add, search), an add form that replaces the list while it's open,
  a search/filter panel, and a `DataList` (it handles loading, errors, empty and "no matches").
- `Card.tsx` – expandable `Card` for the list, with `DetailRow`s and `CardAction` buttons.
- `Page.tsx` – one record: a summary panel, then `Section`s that each have their own ✏️ edit form, and the shared
  `RecordSection` (created by, added, last updated). Delete and Back sit in the header.
- `Form.tsx` – small forms, one per section, built from `Field`, `Input`, `Select`, `Textarea`, `FieldRow` and
  `FormActions`. Errors show under the field.

Messages and confirmations: `toast.success()` / `toast.error()` from `stores/toastStore`, and
`await confirmDialog({ title, message, danger: true })` from `stores/confirmStore`.

**Basic sections** – Batches, Quotes, Invoices and Templates share one list and one page in `views/simple/`.
Adding another basic named collection is one line in `views/simple/sections.ts` plus its route, nav item and
security rule. Give it its own folder when it needs more than a name.

### Adding a new section – checklist

1. Type in `src/types/`, service in `src/services/`, hooks in `src/hooks/`.
2. Screens in `src/views/<section>/` (copy the closest existing section).
3. Routes in `src/App.tsx` and an item in `src/components/layout/navigation.ts`.
4. Add the collection to the allowed list in `firestore.rules` and deploy the rules.
5. Add it to `EXPORTABLE_COLLECTIONS` in `src/services/export_service.ts` (Settings → Data).

## Colours and styling

Colours are named by their job in `tailwind.config.js` and used like normal Tailwind classes:

| Name | Palette | Used for |
|---|---|---|
| `brand` | blue | backgrounds, panels, navigation |
| `accent` | cyan | borders, titles, icons, buttons |
| `muted` | gray | secondary text |
| `success` / `warning` / `danger` | green / amber / red | states and errors |

Change a palette there and the whole app follows, e.g. `accent: colors.teal`. Layout lives inside the components.
Dashboard charts use `accent-600` on a `brand-950` surface (checked for contrast and colour-blind safety).

## Data model (Firestore)

| Collection | Holds | Links |
|---|---|---|
| `users` | Staff: name, email, phone, role, permissions | Document id = login uid. Changed only by Cloud Functions |
| `clients` | Name, type, status, phone, email, address | – |
| `contacts` | People at clients: name, email, phone, address, role | `clientId` (one client, optional) |
| `client-jobs` | A client's yacht, property, club…: name, type, status, location, notes | `clientId` (required, can't change) |
| `services` | What the laundry offers: name, category, status, default prices per unit | – |
| `items` | Things that get laundered: name, category, status, sizes, prices | `prices[].serviceId` |
| `work-orders` | Laundry booked in: reference, status, dates, bags, items | `clientId`, `clientJobId`, `serviceIds` |
| `batches`, `quotes`, `invoices`, `templates` | Name only, for now | – |

Every record also has `timestamp` and `createdBy`. Deleting a client deletes its client jobs and unlinks its
contacts. A service can't be deleted while items have prices for it (set it to Inactive instead).

## Security

- **Firestore rules** (`app/firestore.rules`): only signed-in staff (people with a record in `users`) can read or
  write, and only the listed collections. Nobody writes `users` directly.
- **Users** are added, edited and deleted by Cloud Functions (`app/functions/src/index.ts`), which check the
  caller's permissions first. Only owners can add, change or delete owners; nobody can change their own role or
  delete themselves; emails can't be changed after creation; everyone can edit their own name and phone.
- **Roles** (owner, manager, operator, driver, developer) map to permissions in `functions/src/permissions.ts`.
  Each login token carries a `role` custom claim.
- Firebase settings and test passwords stay out of git: `.env*` and `*.local` files are ignored (so is the
  functions build output, `functions/lib`).

## Deploying (from `app/`)

```bash
npm run build && firebase deploy --only hosting   # the web app
firebase deploy --only firestore:rules            # security rules
firebase deploy --only functions                  # Cloud Functions (europe-west1)
```

- If a functions deploy fails with "User code failed to load… Timeout after 10000", give it longer
  (PowerShell): `$env:FUNCTIONS_DISCOVERY_TIMEOUT=60; firebase deploy --only functions`
- Old function container images are cleaned up automatically after 1 day (cleanup policy set in europe-west1).
- Cloud Functions need the Firebase Blaze (pay-as-you-go) plan.

## Testing

- `npx tsc -b` and `npm run lint` before committing.
- Two test logins (an owner and a manager) are kept in `app/.env.test.local` (git-ignored) so automated checks can
  sign in and exercise the services and Cloud Functions against the live project. Test records are named
  "… (test)".
- There's no separate test database yet; see "Safe test setup" in Tasks.md.

## Device settings

Settings → General → **Background animation** turns the moving bubbles on or off. It's saved per device (in the
browser) and starts off, so slower phones stay quick.
