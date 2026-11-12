import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  ClipboardList,
  Clock,
  FlaskConical,
  LayoutDashboard,
  Receipt,
  Shirt,
  UserRound,
} from 'lucide-react';
import { Page } from '../components/ui/Page';
import { Badge } from '../components/ui/Badge';
import { ChartCard } from '../components/dashboard/ChartCard';
import { StatTile } from '../components/dashboard/StatTile';
import { ColumnChart } from '../components/dashboard/ColumnChart';
import { BarList } from '../components/dashboard/BarList';
import { MeterList } from '../components/dashboard/MeterList';
import { useCurrentUser } from '../hooks/userHooks';
import { sample } from './dashboard/sampleData';

const panelClass = 'rounded-xl border border-accent-500 bg-gradient-to-r from-brand-900/80 to-brand-500/90 p-3';

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
};

const quickLinks = [
  { label: 'Work orders', to: '/work-orders', icon: ClipboardList },
  { label: 'Clients', to: '/clients', icon: Building2 },
  { label: 'Items', to: '/items', icon: Shirt },
  { label: 'Invoices', to: '/invoices', icon: Receipt },
];

// Due-soon status: icon + word, never colour alone
function DueBadge({ state }: { state: 'overdue' | 'today' | 'soon' }) {
  if (state === 'overdue') {
    return (
      <Badge tone="danger">
        <span className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Overdue
        </span>
      </Badge>
    );
  }
  if (state === 'today') {
    return (
      <Badge>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden="true" /> Due today
        </span>
      </Badge>
    );
  }
  return <Badge tone="muted">Upcoming</Badge>;
}

// Dashboard DESIGN with sample data. Each widget will be connected to real data as its section is finished.
export default function Dashboard() {
  const { data: me } = useCurrentUser();
  const firstName = me?.name?.split(' ')[0];

  return (
    <Page
      title="Dashboard"
      icon={LayoutDashboard}
      actions={
        <Badge tone="warning">
          <span className="flex items-center gap-1">
            <FlaskConical className="h-3 w-3" aria-hidden="true" /> Sample data
          </span>
        </Badge>
      }
    >
      {/* Greeting */}
      <div className="px-1 pb-1">
        <p className="text-lg font-bold text-white">
          {greeting()}
          {firstName ? `, ${firstName}` : ''}
        </p>
        <p className="text-xs text-accent-100">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} · the numbers below are examples
          until each section is connected
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        {/* Hero: the one number the day starts with */}
        <section className={`${panelClass} lg:col-span-1`}>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-sm font-medium text-accent-300">Work orders in progress</h2>
            <Link to="/work-orders" className="flex items-center gap-1 text-xs text-accent-200 hover:text-white">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <p className="py-2 text-5xl font-semibold text-white">{sample.inProgress.total}</p>
          <div className="rounded-lg bg-brand-950 p-3">
            <p className="mb-2 text-xs text-muted-300">By stage</p>
            <BarList rows={sample.inProgress.byStage} />
          </div>
        </section>

        {/* KPI tiles */}
        <div className="grid grid-cols-2 gap-2 lg:col-span-2">
          {sample.kpis.map((kpi) => (
            <StatTile key={kpi.label} {...kpi} />
          ))}
        </div>
      </div>

      {/* Quick links */}
      <nav aria-label="Quick links" className="grid grid-cols-4 gap-2">
        {quickLinks.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-1 rounded-xl border border-accent-500/60 bg-brand-900/60 py-3 text-xs font-medium text-accent-200 transition-colors hover:border-accent-300 hover:text-white"
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        {/* Throughput */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Items processed"
            subtitle="Per day, last 14 days"
            table={{ columns: ['Day', 'Items'], rows: sample.throughput.map((d) => [d.label, d.value]) }}
          >
            <ColumnChart data={sample.throughput} unit="items" />
          </ChartCard>
        </div>

        {/* Due soon */}
        <ChartCard title="Due soon" subtitle="Next 48 hours">
          <ul className="divide-y divide-brand-800 text-xs">
            {sample.dueSoon.map((order) => (
              <li key={order.reference} className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate font-bold text-accent-50">{order.job}</p>
                  <p className="truncate text-muted-300">
                    {order.client} · {order.due}
                  </p>
                </div>
                <DueBadge state={order.state} />
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {/* Top clients */}
        <ChartCard
          title="Top clients"
          subtitle="Revenue this month"
          table={{ columns: ['Client', 'Revenue'], rows: sample.topClients.map((c) => [c.label, c.display]) }}
        >
          <BarList rows={sample.topClients} ranked />
        </ChartCard>

        {/* Service mix */}
        <ChartCard
          title="Service mix"
          subtitle="Share of work this month"
          table={{
            columns: ['Service', 'Amount', 'Share'],
            rows: sample.serviceMix.map((s) => [s.label, s.detail || '—', `${Math.round(s.share * 100)}%`]),
          }}
        >
          <MeterList rows={sample.serviceMix} />
        </ChartCard>

        {/* Recent activity */}
        <ChartCard title="Recent activity" subtitle="Across the team">
          <ul className="space-y-2 text-xs">
            {sample.activity.map((entry) => (
              <li key={entry.what} className="flex gap-2">
                <UserRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-400" aria-hidden="true" />
                <p className="min-w-0 text-accent-50">
                  <span className="font-bold">{entry.who}</span> {entry.what}
                  <span className="block text-muted-300">{entry.when}</span>
                </p>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>
    </Page>
  );
}
