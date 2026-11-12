// FAKE DATA for the dashboard design. Each block will be replaced with real data
// as its section is finished (see docs/Tasks.md → Dashboard).

export const sample = {
  inProgress: {
    total: 18,
    byStage: [
      { label: 'Received', value: 5 },
      { label: 'Inspecting', value: 3 },
      { label: 'In progress', value: 7 },
      { label: 'Quality check', value: 3 },
    ],
  },

  kpis: [
    { label: 'Received today', value: '12', delta: { text: '+3', up: true, period: 'yesterday' }, trend: [6, 9, 7, 11, 8, 10, 9, 12, 7, 9, 9, 12] },
    { label: 'Due today', value: '7', delta: { text: '+2', up: true, upIsGood: false, period: 'yesterday' }, trend: [4, 6, 5, 3, 6, 5, 7, 4, 5, 6, 5, 7] },
    { label: 'Completed this week', value: '46', delta: { text: '+8%', up: true, period: 'last week' }, trend: [31, 35, 38, 33, 40, 37, 42, 39, 41, 44, 43, 46] },
    { label: 'Revenue this month', value: '€12,940', delta: { text: '−4%', up: false, period: 'last month' }, trend: [10.2, 11.8, 12.1, 13.6, 12.4, 13.9, 14.2, 13.1, 12.8, 13.5, 13.48, 12.94] },
  ],

  // Items processed per day, last 14 days
  throughput: [
    { label: 'Thu 29', value: 212 },
    { label: 'Fri 30', value: 248 },
    { label: 'Sat 31', value: 165 },
    { label: 'Sun 1', value: 92 },
    { label: 'Mon 2', value: 231 },
    { label: 'Tue 3', value: 276 },
    { label: 'Wed 4', value: 259 },
    { label: 'Thu 5', value: 284 },
    { label: 'Fri 6', value: 301 },
    { label: 'Sat 7', value: 188 },
    { label: 'Sun 8', value: 104 },
    { label: 'Mon 9', value: 243 },
    { label: 'Tue 10', value: 297 },
    { label: 'Wed 11', value: 268 },
  ],

  dueSoon: [
    { reference: 'my-serenity-261110', job: '🚤 MY Serenity', client: 'Blue Harbour Yachting', due: 'Yesterday 17:00', state: 'overdue' as const },
    { reference: 'villa-sol-261111', job: '🏠 Villa Sol', client: 'Blue Harbour Yachting', due: 'Today 12:00', state: 'today' as const },
    { reference: 'hotel-marina-261111', job: '🏨 Hotel Marina', client: 'Marina Group', due: 'Today 18:00', state: 'today' as const },
    { reference: 'sy-aurora-261112', job: '⛵️ SY Aurora', client: 'Aurora Charters', due: 'Tomorrow 10:00', state: 'soon' as const },
    { reference: 'club-nautic-261112', job: '⛳️ Club Náutic', client: 'Club Náutic', due: 'Tomorrow 16:00', state: 'soon' as const },
  ],

  topClients: [
    { label: 'Blue Harbour Yachting', value: 3240, display: '€3,240' },
    { label: 'Marina Group', value: 2780, display: '€2,780' },
    { label: 'Aurora Charters', value: 1960, display: '€1,960' },
    { label: 'Club Náutic', value: 1420, display: '€1,420' },
    { label: 'Villa Rentals Mallorca', value: 980, display: '€980' },
  ],

  serviceMix: [
    { label: 'Wash & Dry', share: 0.41, detail: '1,128 kg' },
    { label: 'Wash, Dry & Fold', share: 0.24, detail: '660 kg' },
    { label: 'Hand Ironing', share: 0.15, detail: '412 items' },
    { label: 'Dry Cleaning', share: 0.11, detail: '96 items' },
    { label: 'Other services', share: 0.09, detail: '' },
  ],

  activity: [
    { who: 'Celeste', what: 'marked my-serenity-261112 as Received', when: '10 min ago' },
    { who: 'Robin', what: 'collected 6 bags from Villa Sol', when: '35 min ago' },
    { who: 'James', what: 'added client Aurora Charters', when: '1 hour ago' },
    { who: 'Janet', what: 'completed hotel-marina-261110', when: '2 hours ago' },
  ],
};
