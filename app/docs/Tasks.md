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
- [ ] Label colours (job statuses, user roles) still use green/yellow/purple – move into a shared `Badge` in Phase 3
- [ ] Layout styling lives inside the shared components, not in a theme file (Phases 2–3)
- [ ] Remove `components/ui/Theme.tsx` and `components/styles/theme.ts` once nothing uses them (after all sections are rebuilt)

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
- [ ] Try the pieces out for real in the Users section (Phase 4) and adjust
- [ ] Rebuild `views/template/` from the finished Users section as the starter for new sections

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
- [ ] Review what we learned and adjust the shared components before moving on

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
- [ ] Check the Jobs section still loads with the new clients
- [ ] Remove old client/contact views and the `theme.ts` styles they used

## Phase 6 – Services and Items
Decisions (2026-11-11): item prices link to a specific service by id (like Jobs already do);
convert the 19 existing services in place; delete and re-add the 2 items (Pillow, Pillow Case).

**Data**
- [x] Service: `name, category, status (active/inactive), description?, prices[{unit, price}]` – prices always saved as numbers
- [x] Item: `name, category, status, sizes[], prices[{serviceId, unit, price? | sizePrices[{size, price}]}]`
- [x] Item price falls back to the service's default price when the item has none
- [x] One-off conversion of the 19 services: text prices → numbers, `default_prices` → `prices`, status active
- [x] Delete the 2 old items (they're in the export)
- [ ] Re-add Pillow Case (and check the "Pillow (test)" example) in the new screens
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
- [ ] Remove old service/item views and unused theme styles

## Later
- [ ] Review everything built so far (after Phase 6)
- [ ] Rename the current Jobs section and `jobs` collection to Work Orders (`work-orders`), booked against a Client Job
- [ ] Batches, Invoices, Quotes (currently placeholders)
- [ ] Dashboard
- [ ] Remove `views/template/` once all sections are rebuilt
- [ ] Write a proper README
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
