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
- [ ] Check the shell on phone and desktop in the browser
- [ ] Loading and error states (replace `alert()` / `confirm()` with in-app messages and a confirm dialog)

## Phase 3 – Shared building blocks
- [x] `Page` – header + scrollable content area (built early; used by Dashboard, Batches, Invoices, Quotes)
- [ ] `Card` – header (initial/icon, title, tag), content sections, actions
- [ ] `List` – search, filters, empty state, renders cards
- [ ] Form parts – `Field`, `Input`, `Select`, `FormActions` (save/cancel)
- [ ] Shared Firestore helpers (get all, get one, add, update, delete) so each service only adds what's special to it
- [ ] Set up React Query for loading and refreshing data (replaces `refreshTrigger`)

## Phase 4 – Users (first section on the new setup)
- [ ] Rename "Staff" to "Users" consistently (route, folder, nav)
- [ ] List, card and page views using the shared components
- [ ] Create/edit user form
- [ ] Fix user creation with a Cloud Function: create, update and delete logins (see notes)
- [ ] Admin vs normal user access using custom claims on the login token (set by the Cloud Function)
- [ ] Deploy the stricter `firestore.rules` (staff only; only owners/managers can change users)
- [ ] Use roles/permissions to show or hide actions
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

---

## Notes
- **User creation:** public sign-up is now turned off, so `createUserWithEmailAndPassword` in the app is blocked. Users will be created, changed and deleted by a Cloud Function using the Firebase Admin SDK, which is allowed to do this. It will check the caller is an admin first.
- **Admin/normal tokens:** the same Cloud Function can add a custom claim (e.g. `role: 'owner'`) to each user's login token. The app and the Firestore rules can then check the role straight from the token, without reading the `users` collection.
- **Cloud Functions** need the Firebase Blaze (pay-as-you-go) plan. Usage at this size should stay within the free allowance.
