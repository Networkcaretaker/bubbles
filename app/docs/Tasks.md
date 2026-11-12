# Bubbles LIMS – Rework Tasks

Work one section at a time. Finish and test a section before starting the next.
Old sections keep working on the old theme until they are rebuilt.

---

## Phase 0 – Prep
- [x] Create a `rework` branch from `dev`
- [x] Delete the `services` branch (already fully merged into `dev`)
- [x] Fix ESLint (ignore `.firebase/` build output) and the one lint error in `Background.tsx`
- [x] Remove the auth token `console.log` in `AuthProvider.tsx`
- [x] Check Firestore security rules in the Firebase console and compare with the draft `firestore.rules`
  - Live rules allow any signed-in account to read/write everything, including `users` (so a user could change their own role)
  - Deploy the stricter draft together with the Phase 4 user-creation fix
- [x] Check whether public sign-up is enabled in Firebase Authentication (anyone could create an account)
  - Sign-up and self-delete turned off in Authentication → Settings → User actions
  - Adding users from the app won't work until the Phase 4 fix
- [x] Delete unused `views/Template.tsx`
- Keep `views/orders/` for possible later use (not routed)
- Keep `views/template/` until the new templates exist

## Phase 1 – Colour theme
- [x] Move colours into `tailwind.config.js` as named colours: `brand`, `accent`, `muted`, `success`, `warning`, `danger`
- [x] Use them like normal Tailwind classes: `bg-brand-900/80`, `text-accent-400`, `border-accent-500`
- [x] Rename existing blue/cyan/gray/red classes across the app to the new names (no visual change)
- [x] Label colours (job statuses, user roles) moved into the shared `Badge` tones
- [x] Layout styling lives inside the shared components, not in a theme file
- [x] Remove the old theme files

## Phase 2 – App shell
- [x] Rebuild `AppShell` layout (sidebar on desktop, bottom nav on mobile)
  - Shell owns the screen height (`h-dvh`); pages fill it and scroll inside
- [x] Sidebar and MobileNavigation share one nav list and one sign-out function
- [x] Give each nav item its own icon (several are using the same one)
- [x] Sidebar: grouped sections, logo at top, signed-in email above Sign Out
- [x] Mobile: 4 pinned tabs (Dashboard, Jobs, Clients, Invoices) + More sheet
- [x] Fix Dashboard always showing as active in the nav
- [x] Shared `PageHeader` component: icon, title, action buttons on the right
- [x] Fixed header height (56px), content fills the rest
- [x] `IconButton` for header actions (with tooltip/label)
- [x] Check the shell on phone and desktop in the browser
- [x] Loading and error states (replace `alert()` / `confirm()` with in-app messages and a confirm dialog)
  - `toast.success/error/info()` messages (`stores/toastStore.ts`, `ui/Toaster.tsx`)
  - `await confirmDialog({...})` for deletes and risky actions (`stores/confirmStore.ts`, `ui/ConfirmDialog.tsx`)
  - `Spinner`, `LoadingState`, `ErrorState`, `EmptyState` (`ui/States.tsx`), used from Phase 3 on
  - All 18 form `alert()`s now use `toast.error()`

## Phase 3 – Shared building blocks
- [x] `Page` – header + scrollable content area (built early; used by Dashboard, Batches, Invoices, Quotes)
- [x] `Card` – header (avatar, title, subtitle, badge), tap to expand, `CardSection`, `DetailRow`, `CardActions`/`CardAction`, plus `Panel` (`ui/Card.tsx`)
- [x] `Badge` and `Avatar` (`ui/Badge.tsx`)
- [x] `DataList` – loading, error + retry, empty, "no matches", renders items (`ui/DataList.tsx`); `matchesSearch()` helper (`lib/search.ts`)
- [x] Form parts – `Field`, `Input`, `Select`, `Textarea`, `FieldRow`, `FormActions` (`ui/Form.tsx`) and `Button` (`ui/Button.tsx`)
- [x] Shared Firestore helpers: `createCrudService()` with friendly error messages (`services/firebase/crud.ts`)
- [x] Firestore set to ignore `undefined` fields when saving
- [x] React Query set up (`lib/queryClient.ts`); `createCrudHooks()` gives each section `useList/useOne/useCreate/useUpdate/useRemove` (`hooks/createCrudHooks.ts`)
- [x] Failed saves/deletes show an error message automatically; loaded data is cleared on sign-out
- [x] Try the pieces out for real in the Users section (Phase 4) and adjust
- [x] Starter for new sections: `views/simple` (basic) or copy the closest full section; old `views/template` removed

## Phase 4 – Users (first section on the new setup)
- [x] Rename "Staff" to "Users" consistently (route, folder, nav); `/staff` redirects to `/users`
- [x] List and cards using the shared components, with search and role filter
- [x] Add/edit user form with errors shown under each field
- [x] Cloud Functions `createUser`, `updateUser`, `deleteUser` (`functions/src/index.ts`, region europe-west1)
  - Check the caller's permissions; only owners can add, change or delete owners; nobody can change their own role or delete themselves
- [x] Role saved on each login token as a custom claim (`role`) when a user is added or their role changes
- [x] Show/hide Add, Edit and Delete buttons by the signed-in person's permissions
- [x] Delete asks for confirmation first
- [x] User page (`/users/:id`) with Edit, Delete and Back in the header; list cards link to it
- [x] My Profile (`/profile`) from the sidebar email and the mobile More menu
- [x] Everyone can edit their own name and phone; email and role need user-edit permission (checked in `updateUser`)
- [x] Email can't be changed after a user is created (form, app and `updateUser` all refuse it)
- [x] Hide the users list while the "New user" form is open
- [ ] Later: change password section on the user profile page
- [ ] Later: activity log and personal settings on the user page
- [ ] Later: who can see the Users list and other people's pages (role rules task)
- [x] Deploy the functions: `firebase deploy --only functions` (from `app/`)
- [x] Test add, edit and delete in the app
- [x] Automated checks with the Claude test accounts: 33/33 pass (permissions, owner protection, validation, email change, delete, direct-write blocked)
- [x] Fix: managers could change an owner's email (login takeover risk) – now only owners can change owners' details
- [x] Deploy the stricter `firestore.rules` (staff only; nobody writes `users` directly) – live since 2026-11-11
- [ ] Existing users get their role claim the next time their role is changed (only matters once rules use claims)
- [x] Shared components adjusted along the way (Section, RecordSection, CardAction disabled, AddressFields)

## Phase 5 – Clients and Contacts (built together)
Decisions (2026-11-11): fresh start with the data (exported first); a contact belongs to one client;
keep the name "Client Jobs".

**Data**
- [x] Contact: `name, email, phone, address, clientId?, role?` – the link and the role (primary, billing, captain…) live on the contact only
- [x] Client: `name, email, phone, address, clientType, status, clientJobs[]` – drop `clientContacts` and old `contacts`
- [x] Clean `ClientType` list (removed `'Yacht Maintainence'`; kept `'yacht-cleaning'` as a real type)
- [x] Client page finds its contacts with "contacts where clientId = this client" (nothing to keep in sync)
- [x] Deleting a client unlinks its contacts (contacts are kept)
- [x] Services and hooks on `createCrudService` / `createCrudHooks`; keep `getAllClients`/`getClient` working for the Jobs section until it's rebuilt

**Contacts screens**
- [x] List with search and "client" filter; add contact (optionally choose client and role)
- [x] Contact page: details, linked client (link/unlink, role), edit, delete

**Clients screens**
- [x] List with search, status and type filters; add client (name, type, status only)
- [x] Client page with sections, each with its own small edit form:
  - Details (name, type, status) · Contact info (phone, email, address) · Contacts (linked list; add existing or new contact; change role; unlink) · Client Jobs (linked list; add existing or new; unlink)

**Client Jobs (own collection `client-jobs`)**
- [x] Client Job: `name, jobType, status (active/inactive), clientId?, address, notes` – linked to a client the same way as contacts
- [x] Client Jobs section (list with search and client/type/status filters; add; page with edit/delete)
- [x] Client page lists its Client Jobs and can add new ones (no unlink/link existing: a job stays with its client)
- [x] Client is required when creating a client job and can't be changed afterwards
- [x] Deleting a client also deletes its Client Jobs (contacts are only unlinked)
- [x] Old `clientJobs` list removed from clients; the Jobs "new job" form now picks from the client's active Client Jobs
- [x] Added to Settings → Data export

**Record and editing**
- [x] `createdBy` (uid + name) saved automatically on every new record by `createCrudService`; shown in a shared Record section with added/last updated
- [x] Contact page edited section by section like clients: Client (client + role) and Details (name, email, phone, address)
- [x] Client Job page edited section by section: Details (name, type, status), Location, Notes. Client is shown but can't be changed after creation
- [x] Deploy `firestore.rules` (adds `client-jobs`) – needed before Client Jobs can be read or saved

**Finish**
- [x] Automated checks with the Claude test accounts (create, link, unlink, delete): 28/28 pass, runs the app's real service code
- [x] Old client/contact data cleared (exported first)
- [x] Jobs section replaced by Work Orders (Phase 7)
- [x] Remove old client/contact views

## Phase 6 – Services and Items
Decisions (2026-11-11): item prices link to a specific service by id (like Jobs already do);
convert the 19 existing services in place; delete and re-add the 2 items (Pillow, Pillow Case).

**Data**
- [x] Service: `name, category, status (active/inactive), description?, prices[{unit, price}]` – prices always saved as numbers
- [x] Item: `name, category, status, sizes[], prices[{serviceId, unit, price? | sizePrices[{size, price}]}]`
- [x] Item price falls back to the service's default price when the item has none
- [x] One-off conversion of the 19 services: text prices → numbers, `default_prices` → `prices`, status active
- [x] Delete the 2 old items (they're in the export)
- [x] Items re-added in the new screens
- [x] Services and hooks on `createCrudService` / `createCrudHooks`; keep `getAllServices` working for the Jobs section

**Services screens**
- [x] List grouped or filtered by category, with search and status filter; add service
- [x] Service page with sections: Details (name, category, status, description) · Prices (unit + price list) · Items that use it · Record

**Items screens**
- [x] List with search, category and status filters; add item
- [x] Item page with sections: Details (name, category, status) · Sizes · Prices per service (one price, or a price per size) · Record

**Copy**
- [x] Copy button on item and service pages: opens a New item/service form with the details filled in; the copy also gets the sizes and prices (item) or default prices (service)

**Finish**
- [x] Automated checks with the test accounts (create, prices as numbers, item ↔ service link, fallback price): 20/20 pass
- [x] Jobs section still loads services (`getAllServices` kept; category field renamed `service` → `category`)
- [x] Remove old service/item views

## Phase 7 – Work Orders and basic collections
Decisions (2026-11-12): Jobs becomes Work Orders (`work-orders`) with the same data for now; Batches, Quotes,
Invoices and Templates start as basic named documents. Dashboard and Settings come after testing.

**Work Orders**
- [x] `WorkOrder`: reference, clientId, clientJobId, status, dateRequired/Received/Complete, bags, items, serviceIds
- [x] List with search, status and client filters; new work order (client → active client job → required date), reference made automatically
- [x] Page: Status (progress bar, "Mark as next stage", Received/Completed record the time) · Client (fixed) · Dates · Quantities · Services · Record
- [x] Old Jobs screens removed; `/jobs` links go to Work Orders (`views/orders` kept, with the old job service/types it uses)

**Basic collections: Batches, Quotes, Invoices, Templates**
- [x] One shared list page and detail page (`views/simple`), set up per section in `views/simple/sections.ts`
- [x] Add, rename and delete; search; Record section
- [x] Old placeholder pages and the old `views/template` starter removed; Templates added under Setup

**Finish**
- [x] Deploy `firestore.rules` (adds the five new collections; removes `jobs`)
- [x] Automated checks with the test accounts: 16/16 pass
- [x] Settings: new Page and tabs (General, Users, Data); `?tab=` kept in the address
  - General: Background animation on/off (saved per device, starts off)
  - Users: "User activity" placeholder (not functional yet)
- [x] Dashboard design with sample data (marked "Sample data"): greeting, headline "work orders in progress" with stages, 4 KPI tiles with sparklines, quick links, items processed chart, due soon, top clients, service mix, recent activity
  - Charts: one colour (accent-600) + grey, validated on the brand-950 chart surface; hover/tap values; table view on each chart
  - Overdue shown with icon + word, never colour alone
- [ ] Connect each dashboard widget to real data as its section is finished (sample data lives in `views/dashboard/sampleData.ts`)
- [ ] Later: real user activity log (who changed what, when)

## Finish the initial rework
- [x] README (project root) with setup, structure, how sections are built, data model, security and deploying
- [x] Clean-up of leftovers: `components/styles/theme.ts` (unused), `App.css`, `assets/react.svg`, `public/vite.svg`,
      empty `public/data/items.json`, unused `ProfileInitial` helper
- [x] Bubble background uses colour classes directly (animation on/off is in Settings)
- [x] `views/orders` removed, with `ui/Theme.tsx`, `ContentPlaceholder`, `job_service.ts` and `job_interface.ts` (old theme system gone)
- [x] Review of the whole rework (findings below)
- [ ] Deploy the latest hosting build and check on phone and desktop (James)
- [x] Push `rework` to GitHub
- [ ] Merge `rework` into `dev`, then `main` (James)

### Review findings (2026-11-12)
- [x] Delete protection: `services/relationships.ts` lists what uses each record; clients and client jobs can't be deleted while work orders use them, services while items or work orders do (checked in the service layer)
- [x] Work order numbers (WO-0001…) from a counter, set in the same transaction as the order; the reference stays as a label
- [x] Login page rebuilt: labels, show/hide password, plain-word errors, signed-in users go straight to the app (forgot password: Later)
- [x] A login without a user record only sees "Your account isn't set up" (users are only created/deleted with both by the Cloud Functions)
- [x] Rules deployed (adds `counters`), existing work order numbered WO-0001, `serviceIds` filled in on all 11 items, checks pass
- [ ] Delete/edit buttons show for every role, and the rules let any staff change any record: next stage (roles and permissions)
- [ ] Speed: moved to Later
- [x] PWA: dark blue launch screen and theme colour, 192px + 512px icons, Apple home-screen icon, no white flash while loading, Bubble3D font cached for offline
- [x] Two permission tables to keep in step (app and Cloud Functions): noted, consider one source later

## Later
- [ ] Speed: load each section only when it's opened (lazy routes), so the first load on phones is faster (the app is one 730 KB+ file now)
- [ ] Roles and permissions: who can see, edit and delete what, in the screens and in the security rules
- [ ] Forgot password (needs email sending set up)
- [ ] Batches, Invoices, Quotes and Templates: real fields and workflows (now basic named records)
- [ ] Safe test setup so Claude can sign in and test without touching live data
  - Option A: Firebase Emulator Suite (Auth, Firestore, Functions) on this computer – needs Java
  - Option B: a separate free "dev" Firebase project in the cloud, if the emulators are too heavy for this machine
  - Test accounts for each role; password kept in a git-ignored file (e.g. `app/.env.test.local`)
  - Optional: Playwright for testing the screens with screenshots

---

## Notes
- **Users:** public sign-up is turned off. Users are added, edited and deleted only through the Cloud Functions in `functions/src/index.ts`, which check permissions first. The role/permission table is copied in `functions/src/permissions.ts` – keep it in step with `src/functions/user_functions.ts`.
- **Admin/normal tokens:** each login token carries a `role` custom claim. The app and the Firestore rules can check it straight from the token, without reading the `users` collection.
- **Deploying functions:** if it fails with "User code failed to load… Timeout after 10000", give it longer. PowerShell: `$env:FUNCTIONS_DISCOVERY_TIMEOUT=60; firebase deploy --only functions`
- **Cloud Functions** need the Firebase Blaze (pay-as-you-go) plan. Usage at this size should stay within the free allowance.
