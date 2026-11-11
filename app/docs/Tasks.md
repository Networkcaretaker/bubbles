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

## Phase 5 – Clients
- [ ] Rebuild with shared components
- [ ] Split the large client form into smaller forms (details, contact info, jobs, contacts)
- [ ] Clean up old `ClientType` values (`'Yacht Maintainence'`, `'yacht-cleaning'`) in the database
- [ ] Keep search and filter

## Phase 6 – Contacts
- [ ] Rebuild with shared components
- [ ] Check the contact ↔ client link still updates both sides

## Later
- [ ] Services, Items, Jobs
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
