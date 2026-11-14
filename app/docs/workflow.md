# Laundry Workflow

How the laundry works day to day, and how the app should model it. Written from our workflow discussions; it covers
**intake, sorting, counting, inspection, washing, drying, ironing, packaging and labels, subcontracting, pricing,
quotes, collection/delivery, invoicing and payment**. Open points are listed in
[Still to discuss](#still-to-discuss).

Status: **proposed model**, nothing built yet. Items marked *(proposal)* were suggested but not yet confirmed.

---

## 1. How it works today

A typical example: a property management client brings in **3–4 villas a week**.

- Each villa has **2–4 bags**: usually 3–5 bedrooms of linen and maybe a bag of mixed-size towels.
- The client drops off and picks up themselves. Turnaround is usually **3–5 days** (sometimes quicker in summer).
- On arrival the job goes into a spreadsheet and each bag gets a handwritten label, e.g. **Villa Sol 1/3**.
- The due date isn't recorded: we ask the client and keep a mental note.

**Sorting into batches.** Some villas send one room per bag, some mix rooms, some have a towel bag.

- If the client wants bags kept separate, each bag becomes a batch.
- Mixed laundry may be split by colour, or linen from towels.
- Batch size follows the machines: **single load, 3-load and 5-load**.

**Inspection** depends on the client:

- Yachts want a detailed inspection with every stain removed.
- Some property clients only want really bad stains treated.
- Damage or bad stains are photographed and reported to the client.

**Counting.** Items are counted per batch into the spreadsheet, grouped by room:

```
Master Bedroom            Twin Bedroom              Bathroom
Superking Duvet Cover 2   Single Duvet Cover 4      Bath Towels 6
Superking Fitted Sheet 2  Single Fitted Sheet 4     Hand Towels 6
Pillow Case 8             Pillow Case 4             Face Towel 4
                                                    Bath Mat 2
```

**Services** aren't recorded; staff just know them. Bed linen is wash, dry and roller iron. Towels are wash, dry and
fold. Wet-weather clothing is washed, then waterproofed.

**Washing.** Staff pick a machine that suits the batch size, choose the products and set the machine. Small batches
can share a machine, each in its own **netted bag**.

**Drying.** The dryers hold 3–4 loads, but drying works better in smaller loads, so they aren't filled. Some items
can't be tumble dried and are **hang dried**, which can take **1–2 days**.

**Subcontracting.** Some services are done by other companies, e.g. carpet cleaning. The vendor collects, or we
deliver. They invoice each job when it's complete and we pay straight away.

**Returning.** Laundry goes back in the same bags where possible, but it's packed in the way the client prefers:

- Bedding is usually kept in **full bed sets**, or sometimes packed by type (duvet covers together, sheets and pillow
  cases together).
- Towels are usually **packed by size**. How many go in a package depends on the towel and bag sizes: 9 bath towels
  might be 5 + 4 or 3 + 3 + 3. There's no set rule.
- Each package gets a small printed label with the **job name and batch name**.

### The problem

The work always gets done on time, but much of what's needed lives only in people's heads:

- when a job is due
- how the client wants bags handled
- how carefully to inspect
- which services, products and machine settings each item needs

**The main goal of this part of the app is to record that knowledge once, so it comes up automatically every time.**

---

## 2. Model overview

```
Client                     e.g. the property management company
 └─ Client Job             Villa Sol: address, zone, standing instructions
     └─ Work Order         one drop-off or pickup: due date, logistics, bags, charges, payment
         ├─ Bags           what arrived: "Villa Sol 1/3", 2/3, 3/3
         ├─ Batches        how it's processed: "Master Bedroom", "Towels", "Whites"
         │   ├─ Sub-batches   items split off: stain treatment, hang drying, outsourcing (one level only)
         │   ├─ Item lines    Superking Duvet Cover × 2, grouped by room (optional)
         │   ├─ Services      Wash → Dry → Roller iron (from the items' defaults)
         │   └─ Issues        note + photos, reported to the client
         ├─ Packages       what goes back: "Superking Set × 2", "Towels × 3"
         └─ Charge lines   what's billed: service, unit, quantity, price, where the price came from

Runs                       one machine + one program + one or more batches (wash or tumble dry)
Outsourcing                a batch or sub-batch sent to a vendor, with the vendor's cost and invoice
```

**Bags and batches are separate.** Bags are how laundry *arrives*; batches are how we decide to *process* it.
Sometimes they match one to one, sometimes they're regrouped. Bags are recorded at intake (a count and labels).
Batches are made later, at sorting.

**Packages are a third, separate stage.** They're how the laundry *goes back*, and they don't need to match the bags
or the batches.

**Runs and batches are many-to-many.** One run can hold several batches (in netted bags), and one batch can need
several runs (e.g. 3 loads in single-load machines, or drying in smaller loads than it was washed in).

---

## 3. Client Job: standing instructions

Each Client Job (villa, yacht, club…) holds what staff currently remember:

| Setting | Example |
|---|---|
| Usual turnaround | 4 days: fills in the work order's due date |
| Inspection level | **Basic** (very bad stains only) · **Standard** · **Detailed** (all stains, yacht-style) |
| Keep bags separate | Yes / No |
| Wash program overrides | "Always use the fragrance-free detergent" |
| Packing style | "Bed sets, towels by size" (a hint for staff, not enforced) |
| Delivery zone | Zone 1: fills in collection and delivery charges |
| Notes | "Fold towels in threes" |

These show at the top of every batch for that job, so every member of staff works to the same standard.

---

## 4. Starting a work order

There is one **New Work Order** wizard with four starting points:

```
Where from?   Drop-off now │ Arrange pickup │ From a quote │ Copy a previous work order
   ↓
Client        Pick existing — or — Quick add (name + phone only)
   ↓
Client Job    Pick (Villa Sol) — or — "General" for walk-ins
   ↓
Dates         Due date (pre-filled from usual turnaround) · collection / delivery dates
   ↓
Logistics     None │ Collection │ Delivery │ Both
   ↓
Estimate      Optional: service + unit + loads / kg / items (mainly for walk-ins)
   ↓
Bags          Number of bags (now, or when picked up)
```

- **Due date** is required. It's filled in from the Client Job's usual turnaround and changed when the client gives a
  date. The Dashboard can then show *due today / tomorrow / overdue*.
- **Walk-ins** (e.g. tourists): quick-add a client with just a name and phone (type *individual*). They get an
  automatic **General** Client Job, so nobody has to create a villa or yacht first. Full details can be added later.
  *(The code currently requires `clientJobId` on a work order. The automatic General job keeps that working.)*
- **Pickup:** the work order exists before any laundry does. It starts as `scheduled`.
- **From a quote:** copies in the client, the Client Job, the expected items and services, and the quote's prices.
  The work order keeps a link to the quote.
- **Copy:** copies a previous work order's batches and item lines as a starting point. Staff then confirm or edit the
  quantities. Useful because villas often, but not always, send similar contents.
- **Timing warnings:** if the work order has hang-dry or outsourced items and the due date is close, the app warns at
  intake.

### Expected vs counted

A quote or a copy gives what we **expect** to receive; counting gives what **actually** arrived. The app shows the
difference (e.g. "Expected 8 pillow cases, counted 7") to catch missing items and to explain invoice changes against
a quote.

---

## 5. Batches

- A batch belongs to a work order and may list the bags it came from.
- Records: name, type (bedding, towels, clothing…), colour, **loads** and/or **weight** (only the one used for
  pricing is needed), **net/tag number** when it shares a machine, status.
- **Item lines:** catalogue item + size + quantity, with an optional **group label** (e.g. "Master Bedroom"). A batch
  such as "Whites" may have no groups.
- **Services:** filled in from the default services of the batch's items. Staff only change the exceptions (e.g. add
  Waterproofing).

### Sub-batches

- Used to split items off a batch, e.g. 2 pillow cases that need stain treatment. This also makes individual items
  easier to track.
- **Rule: an item is only ever in one place.** Moving items into a sub-batch takes them off the parent, so the
  counts always add up.
- A sub-batch has its own status and extra services (e.g. stain treatment, charged per item). It usually rejoins
  the parent before packaging. If a stain can't be removed, its items may be packed separately instead (see
  [Ironing and folding](#9-ironing-and-folding)).
- **One level only:** a batch can have sub-batches, but sub-batches can't have their own.
- Common reasons for a sub-batch: **stain treatment**, **hang drying**, **outsourcing** (e.g. one suit for dry
  cleaning inside a linen job).

### Inspection and issues

- The inspection level comes from the Client Job.
- Inspection happens **at counting and again at ironing**.
- An **issue** is a note plus photos, linked to a batch (optionally to an item line). It records **where it was
  found**: at intake, after washing, or during ironing.
- Issue status: *found → reported to client → in treatment →* **removed** or **cannot be removed**.
- Raising an issue can offer to move the affected items into a sub-batch.
- Recording where issues are found shows over time whether stains are being missed at intake.
- Issues give us a record if a client later disputes damage.

### Catalogue item defaults

Each catalogue item gets a **default process** and **drying method**:

| Item | Default services | Drying |
|---|---|---|
| Duvet Cover, Fitted Sheet, Pillow Case | Wash, Dry, Roller Ironing | Tumble |
| Bath Towel, Hand Towel, Bath Mat | Wash, Dry & Fold | Tumble |
| Wet-weather jacket | Wash, Waterproof Apparel | Hang |

This replaces the "we just know" knowledge. It builds on the catalogue's existing item → service prices.

---

## 6. Equipment

Nothing about the machines is hard-coded. An **Equipment** section in the app is where machines and their settings
are added and edited. Each machine has:

- a name or number
- a type: washer, dryer, roller iron, hand iron… (the list of types can grow)
- a capacity in loads, plus an optional **recommended load** where it's lower (e.g. the dryers)
- its available settings / programs
- a status: **available · in use · out of service**

Later this section can also hold maintenance records.

What we have today, for reference (all entered through the app, not in code):

| Type | We have |
|---|---|
| Washer | 2 × single-load, 1 × 3-load, 1 × 5-load |
| Dryer | 2 (hold 3–4 loads, but loaded less) |
| Roller iron | 2 small, 1 large |
| Hand iron | 1 professional, 1 spare |

**The operator chooses the machine.** The app can suggest a free machine of a suitable size, but the operator picks
and logs the machine they actually use. The app doesn't need rules about which items go on which machine (e.g. which
items need the large roller iron).

---

## 7. Washing

### Set up once (Setup)

- **Products:** detergent, softener, bleach, stain remover, waterproofing… Just a list for now. **Stock and
  reordering come later**, built on the same list.
- **Wash programs:** a named recipe of settings (temperature, cycle, spin), products and an approximate duration,
  e.g. *White linen 60°*, *Towels 40°, no softener*, *Coloureds 30°*.
  - Each **batch type or item category** has a default program, e.g. towels → *Towels 40°*.
  - A **Client Job** can override it.

### A wash run

When a batch is ready, the app suggests a free washer of a suitable size and the default program. The operator picks
the machine and program they actually use, and that's what gets logged.

A **run** records:

- the machine and program
- the batches in it (one or more; shared runs use netted bags, with each batch's net/tag number)
- the products actually used
- who started it, the start time, and the end time (worked out from the program's duration)

This gives:

- **Machine status at a glance:** which machines are free, and which finish in 10 minutes.
- **Traceability:** if a client complains, we know which machine, program and products were used.
- **Re-washes:** a second run (or a stain-treatment sub-batch) shows in the batch's history.

---

## 8. Drying

Two methods, set per item by default (see [Catalogue item defaults](#catalogue-item-defaults)):

- **Tumble dry:** a dry run works like a wash run: dryer, program, one or more batches, start and end time. Batches
  are dried in **smaller loads** than the dryer's full capacity, so a batch may need more than one dry run.
- **Hang dry:** hang-dry items are split into a **sub-batch** with the status *hang drying* and a start time. The rest
  of the batch carries on. Hang drying takes **1–2 days**, so it affects due dates (see the timing warning in
  [Starting a work order](#4-starting-a-work-order)).
- **Items that aren't ironed** (e.g. towels) are **folded at the end of drying**.

---

## 9. Ironing and folding

**Batches are ironed one at a time**, so there are no shared runs. Ironing is recorded on the batch itself:

- who ironed it
- which equipment was used: one or more pieces (e.g. a roller iron for sheets and a hand iron for pillow cases). The
  operator chooses and logs it.
- start and finish times *(optional; useful later for knowing how long jobs take and whether prices cover the work)*

**Folding** is part of ironing for ironed items, and the end of drying for items that aren't ironed. It isn't a
separate step, and nothing extra needs recording.

### Second inspection

Ironing is also an inspection. When the operator finds a stain:

1. They **raise an issue** with a photo, found *during ironing*.
2. The affected items **move to a sub-batch** for further treatment.
3. The sub-batch goes back through treatment, washing and drying, returns to ironing, and then **rejoins the parent**.

So a batch's progress is a **loop, not a straight line**:

```
counted → washing → drying → ironing → packing → ready
             ↑                   │
             └── treatment ←─────┘   (sub-batch: stained items only)
```

### While items are away for treatment

- The rest of the batch is usually **put on the shelf to wait** until the treated items come back.
- Items that already make a **complete set** can be packed straight after ironing; only the incomplete sets wait.
  So a batch can be **partly packed**.
- The app shows the batch as *waiting for treatment*, so it's clear why it's on the shelf.

### When a stain can't be removed

- After treatment, the issue is closed as **cannot be removed**, and the client is told.
- The item is **packed separately**, with a label saying the stain cannot be removed.

---

## 10. Subcontracting (outsourcing)

Some services are done by another company, e.g. carpet cleaning.

- **Vendors:** a list of the companies we use (carpet cleaner, dry cleaner, alterations…).
- **Each service says who does it:** *in-house* or *outsourced*, with a default vendor. Carpet Cleaning → outsourced
  to X, so the app flags it automatically.
- **What gets sent out is a batch or a sub-batch.** A whole carpet job is a batch. One suit that needs dry cleaning
  inside a linen job becomes a sub-batch.

### The outsourcing record

| Field | Example |
|---|---|
| Vendor | Carpet cleaner X |
| Going out | *Vendor collects* or *we deliver* · date sent |
| Coming back | *Vendor delivers* or *we collect* · expected and actual return dates |
| Vendor reference | Their job number |
| Status | to send → sent → returned → checked |
| Returned items | Counted against what was sent |
| Vendor invoice | Number, amount, paid date and method, optional photo of the invoice |

- Vendors **invoice each job when it's complete, and we pay straight away**, so the invoice and payment sit on the
  outsourcing record itself.
- **Cost vs price:** what the vendor charges us is stored next to what we charge the client (the charge line), so we
  can see the margin.
- An **Outsourcing** section lists everything that's currently out, and anything overdue back.

---

## 11. Packaging

After folding, items are packed into bags and each bag gets a printed label. Bedding is usually packed in bed sets
and towels in packets. Using the Villa Sol example:

```
Master Bedroom   2 × Superking Set
Twin Bedroom     4 × Single Set
Bathroom         3 × Towels
```

### Package lines

- A **package line** is: its batch, a **description**, and **how many** identical packages. "Superking Set × 2" is
  one line and prints 2 labels.
- Descriptions are typed by the operator, or picked from ones used before (e.g. *Superking Set*, *Single Set*,
  *Towels*).
- We don't define set contents in the app (no "Superking Set = 1 duvet cover + 1 fitted sheet + 4 pillow cases"),
  and we don't record which items are in each package.
- **Packing happens batch by batch** as each one is finished, while other batches of the same job may still be in
  process. A batch can also be **partly packed** (complete sets packed while other items are still in treatment).
- **No package numbers** (no "1 of 9"): on a large job the total isn't known until the whole job is complete. The
  app adds up the package lines, so the total is known at handover.
- The Client Job's packing style tells staff how to pack.
- Items with a stain that **cannot be removed** go in their own package, with a label saying so.

### Labels

Labels are made today in the label printer's own software. They will be printed from the app instead, using the
data already in the database:

```
Mallorca Properties: Villa Sol      ← client : client job
Master Bedroom                      ← batch
Superking Set                       ← package description
```

- Printed from the batch when its package lines are added, one label per package.
- Label size is roughly **8 cm × 5 cm** (exact size and printer model to be confirmed).
- The likely approach: a print page sized exactly to the label, sent through the printer's normal driver. Whether
  printing works from a phone or tablet depends on the printer.
- Possible later uses of the same feature *(proposal)*: printed **intake bag labels** instead of handwritten ones
  ("Villa Sol 1/3"), and a **QR code** on labels for scanning at collection or delivery.

---

## 12. Pricing

### Two levels of charge

| Level | What's charged | Example |
|---|---|---|
| Batch | Per load (or per kg) for washing and drying | Master Bedroom: 2 loads × €25 |
| Item line | Per item for item services (ironing, stain treatment, dry cleaning, waterproofing…) | 2 duvet covers × iron price |

So Master Bedroom = 2 loads + ironing for each item. A Bathroom batch of 3 loads of towels = 3 × €25 = **€75** (wash,
dry and fold only).

### The unit is chosen per job, not per service

A service can offer several units; Wash & Dry has per load, per kg and per item. Staff pick the unit that fits when
pricing:

| Walk-in | Decided at the counter | Charge |
|---|---|---|
| Small carry bag, one colour | "That's one load" | 1 × per load |
| Suitcase of mixed clothing | Weigh it: 6.2 kg | 6.2 × per kg |
| Suit jacket + trousers | Dry cleaning | 2 × per item |

Existing units (`PricingUnit`): `per_item`, `per_kg`, `per_load`, `per_sqm`, `per_batch`, `per_quote`, `per_km`,
`fixed`, `free`.

### Charge lines

Each work order keeps a list of **charge lines**, and the invoice is built from them:

```
Service              Unit       Qty    Price    Source
Wash, Dry & Fold     per load   2      €25      catalogue        ← Master Bedroom batch
Roller Ironing       per item   2      €x       item price       ← Superking Duvet Cover
Roller Ironing       per item   8      €y       item price       ← Pillow Case
Wash, Dry & Fold     per load   3      €25      catalogue        ← Bathroom batch
Delivery (Zone 2)    fixed      1      €40      delivery zone    ← the work order
```

- Batches and item lines **suggest** charge lines automatically. Staff can change or add lines.
- Each line **stores its own price**, so later catalogue changes don't affect old work orders or invoices.
- For walk-ins, the **estimate** from the wizard is kept until the real charges replace it.
- Outsourced lines also show the **vendor's cost** next to our price.

### Where a price comes from

The price is looked up **for each charge line**, most specific first:

1. A quote on this **work order** (e.g. a one-off quote for curtains)
2. A quote on the **Client Job** (e.g. Villa Sol)
3. A quote on the **client** (e.g. the property company's standard agreement)
4. The client's **fixed prices**, if they have any
5. The **catalogue**: item price for the size, else the item's price, else the service default

So in one Villa Sol work order, the curtains can use a one-off quote while the bed linen and towels still use the
company's agreement. Each charge line shows its source.

---

## 13. Quotes

Quotes come in several forms:

| Kind | How it applies |
|---|---|
| Item prices / discount, **repeatable** | Attached to a client or a Client Job with an expiry date. Replaces catalogue prices, or applies a discount %. |
| **Fixed price**, one-off | Linked to one work order. One line ("As quoted: €X") replaces the calculated lines. Items are still counted for checking in and out. |
| Item prices, **one-off** | Like the repeatable kind, but linked to one work order. |

- A quote can be attached to a **client**, a **Client Job** or a **work order**.
- Typical case: a property company has one quote for all its jobs. A separate one-off quote covers anything outside
  it, such as curtains.
- A work order can be started from a quote (see [Starting a work order](#4-starting-a-work-order)).

---

## 14. Collection and delivery

- Each work order has a logistics choice: **None** (drop-off and collect) · **Collection** · **Delivery** · **Both**.
- Each trip has its own date and address. The address defaults to the Client Job's, and can be changed (e.g. a yacht
  on a different berth).
- Each trip adds its own charge line, so *Both* gives two lines.
- Delivery is usually **free** to the ports and towns we visit regularly. Further away there's a **fixed** or
  **per km** charge.

### Delivery timing

| Kind | Example | Shows up |
|---|---|---|
| **Fixed slot** | "Tuesday 10:00–12:00, Port Adriano" | On that date, with a warning if the work order isn't ready in time |
| **When ready** | "Whenever it's done" | In the delivery list as soon as the work order is ready |

- A fixed slot is effectively the due date, so the intake wizard uses it.
- **Every delivery takes an invoice.** It's generated before the driver leaves and printed to go with the packages
  (see [Invoicing and payment](#15-invoicing-and-payment)).

### Delivery list (driver's view)

- The day's deliveries and pickups, each with the address, client contact, **number of packages** (from the package
  lines), the invoice, and the amount to collect if the client pays on delivery.
- The driver marks each stop as **delivered** (or collected), and records any **payment taken** (cash or card; the
  driver has a card machine).
- **No proof of delivery for now:** the driver knows most clients. Recording who received it, a photo or a signature
  is a possible later addition.
- Later: putting the list in route order.

### Delivery zones *(proposal)*

The current services have overlapping versions: *Collection & Delivery* (Free, Zone 1, 2, 3, Standard), plus
*Collection* and *Delivery* with free / per km. Suggested instead:

- A **Delivery Zones** list under Setup, each zone with a price and the ports and towns it covers:
  - Free: regular ports and towns
  - Zone 1: €30
  - Zone 2: €40
  - Zone 3: €60
  - Distance: €2/km
- Each Client Job has its usual zone, so the charge fills in by itself. A one-off address gets a zone picked, or km
  entered.
- The "Standard" combination (€5 fixed + €2/km + €5/kg) can be supported if a zone can combine price parts.

---

## 15. Invoicing and payment

### When the invoice is made

When all of a work order's batches are packed, it becomes **ready**. That's when the invoice is decided:

| Handover | Invoice |
|---|---|
| **Delivery** | **Always.** Generated before the driver leaves and printed to go with the packages. |
| Walk-in collection | Receipt by default; an **invoice on request** |
| Account client collection | Usually **not handed over**. The invoice is **emailed** instead. |

Invoices are **one per work order**.

Making an invoice:

1. Review the charge lines: expected vs counted, quote prices, the delivery charge.
2. Issue it. It gets a **sequential number**, and its lines and prices are **locked**, so later changes to the work
   order don't alter an issued invoice.

### Payment

- **Walk-ins pay on collection**, at the counter.
- **On delivery the driver can take payment**, cash or card.
- **Account clients** pay in one of two ways, set per client as their **payment terms**:
  - **On receipt:** they pay each invoice when they get it.
  - **Fixed date:** they pay all outstanding invoices on a set date (e.g. monthly).
- A payment records: amount, method (cash, card, transfer), date, and who took it. One payment can cover **several
  invoices** (the fixed-date clients).
- An **unpaid invoices** list per client shows what's outstanding. It's the basis for chasing and for statements.
- **Vendors** are paid per job, recorded on the outsourcing record (see [Subcontracting](#10-subcontracting-outsourcing)).

### Spanish invoicing rules *(to check with the gestor)*

Because the app will issue invoices in Spain, these need checking before invoicing is designed in detail:

- consecutive numbering and required content (client NIF, IVA)
- a walk-in "receipt" is legally a *factura simplificada* (simplified invoice)
- **VeriFactu**, Spain's rules for invoicing software, which affect how invoices are recorded and whether they can be
  changed afterwards

The laundry currently uses an invoicing program (possibly "easyinvoice"; to be confirmed). It may turn out simpler for
the app to prepare invoices and pass them to software that already complies, rather than becoming the official
invoicing system itself.

---

## 16. Statuses *(proposal)*

**Work order:**

```
scheduled → received → processing → ready → (out for delivery) → collected / delivered
```

- `scheduled` is for pickups booked before any laundry arrives.
- The work order's status mostly follows from its batches.
- **Invoice and payment are tracked separately**, not as steps in this line, because their timing varies: a delivery
  is invoiced before it leaves, an account client's invoice may be emailed after collection, and payment can come at
  the counter, on delivery, or on a fixed date. A work order is **finished** when it's handed over, invoiced and paid.

**Invoice:** *draft → issued → sent → paid* (or *part paid*).

**Batch:**

```
sorting → counted → washing → drying / hang drying → ironing → packing → ready
             ↑                                         │
             └──────────── treatment (sub-batch) ←─────┘
                     (outsourced: to send → sent → returned → checked)
```

- Folding has no status of its own: it's part of ironing, or the end of drying for items that aren't ironed.
- *Waiting for treatment* shows when the rest of a batch is on the shelf while a sub-batch is being treated.
- *Partly packed* shows when complete sets are packed but other items are still away.

---

## 17. Apps

- **Admin app** (this project, being built now): mobile responsive, full forms, setup and management.
- **Operator app** (future): mobile only, with wizards and big buttons instead of large forms, so operators can work
  with minimum effort. This will be the main UX/UI task later. Recording runs, moving batches between steps and
  counting are its main jobs.
- **Driver app** (future, built alongside the operator app): a collection-and-delivery version for drivers. It shows
  the delivery list, marks stops as delivered or collected, and records payments taken. **User roles** decide what
  each person can see and do, so drivers don't get the admin features.

---

## 18. Changes to existing code

- **`Batch` type** ([batch_interface.ts](../src/types/batch_interface.ts)) was an early sketch. It will be replaced
  completely to match this model, linked to the work order instead of the old `jobId`.
- **`Vendor` type** ([vendor_interface.ts](../src/types/vendor_interface.ts)) is also an early sketch and should be
  slimmed down.
- **`WorkOrder`:** make `dateRequired` required; add logistics, a payment record, charge lines, a quote link, bags
  and the new statuses.
- **`ClientJob`:** add usual turnaround, inspection level, keep bags separate, wash program overrides, packing style
  and delivery zone.
- **`CatalogItem`:** add default services and drying method.
- **`Service`:** add *in-house / outsourced* and a default vendor.
- **`Quote`** ([quote_interface.ts](../src/types/quote_interface.ts)): attach to a client, Client Job or work order,
  with repeatable/one-off, fixed total or line prices / discount, and an expiry date.
- **`Client`:** add payment terms (on receipt / fixed date) and an invoice email address.
- **New collections:** equipment, products, wash programs, runs, outsourcing, package lines (or kept on the batch),
  payments, delivery zones *(proposal)*.
- **Roles:** add a **driver** role with access only to deliveries, collections and payments.

---

## Still to discuss

- **Invoicing software and gestor** (James to check on Monday): the name of the current invoicing program, what the
  gestor handles, and VeriFactu. This decides whether the app issues invoices itself or passes them on.
- **Label printer:** make, model and exact label size (James to check on Monday), and whether printing must work
  from a phone or tablet.
- How a client's **fixed prices** are stored (their own price list, or always as a repeatable quote).
- Delivery zones: confirm the proposal and whether zones combine price parts.
- Proof of delivery (who received it, photo, signature): not needed now, maybe later.
