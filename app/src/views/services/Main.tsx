import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, WashingMachine } from 'lucide-react';
import { Page } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { Panel } from '../../components/ui/Card';
import { DataList } from '../../components/ui/DataList';
import { EmptyState } from '../../components/ui/States';
import { Field, FieldRow, Input, Select } from '../../components/ui/Form';
import { matchesSearch } from '../../lib/search';
import { SERVICE_CATEGORY_OPTIONS, STATUS_OPTIONS, serviceCategoryLabel } from '../../functions/catalog_functions';
import { serviceHooks } from '../../hooks/catalogHooks';
import { toast } from '../../stores/toastStore';
import Card from './Card';
import { ServiceDetailsForm } from './Form';
import type { ServiceDetailsValues } from './Form';

export default function Main() {
  const navigate = useNavigate();
  const services = serviceHooks.useList();
  const createService = serviceHooks.useCreate();

  const [adding, setAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFilter = () => {
    // Closing the filter also clears it, so nothing stays hidden by accident
    if (showFilter) {
      setSearch('');
      setCategory('');
      setStatus('');
    }
    setShowFilter(!showFilter);
  };

  // New services start with the basics; prices are added on their page
  const handleAdd = async (details: ServiceDetailsValues) => {
    let created;
    try {
      created = await createService.mutateAsync({ ...details, prices: [] });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(`${details.name} added. Add its prices below.`);
    navigate(`/services/${created.id}`);
  };

  return (
    <Page
      title="Services"
      icon={WashingMachine}
      actions={
        <>
          <IconButton icon={Plus} label="Add service" active={adding} onClick={() => setAdding(!adding)} />
          {!adding && <IconButton icon={Search} label="Search and filter" active={showFilter} onClick={toggleFilter} />}
        </>
      }
    >
      {adding && (
        <Panel>
          <div className="space-y-3">
            <p className="text-lg font-bold text-white">New service</p>
            <ServiceDetailsForm
              initial={{ name: '', category: 'machine-service', status: 'active', description: '' }}
              onSubmit={handleAdd}
              onCancel={() => setAdding(false)}
              submitLabel="Add service"
              submitting={createService.isPending}
            />
          </div>
        </Panel>
      )}

      {/* While adding, only the form is shown */}
      {!adding && showFilter && (
        <Panel>
          <div className="space-y-3">
            <Field label="Search">
              <Input
                type="search"
                placeholder="Service name or description…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </Field>
            <FieldRow>
              <Field label="Category">
                <Select placeholder="All" options={SERVICE_CATEGORY_OPTIONS} value={category} onChange={(e) => setCategory(e.target.value)} />
              </Field>
              <Field label="Status">
                <Select placeholder="All" options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} />
              </Field>
            </FieldRow>
          </div>
        </Panel>
      )}

      {!adding && (
        <DataList
          query={services}
          getKey={(service) => service.id}
          filter={(service) =>
            matchesSearch(search, service.name, service.description, serviceCategoryLabel(service.category)) &&
            (!category || service.category === category) &&
            (!status || service.status === status)
          }
          empty={<EmptyState icon={WashingMachine} title="No services yet" message="Add a service with the + button at the top." />}
          noMatchMessage="No services match your search or filters."
          renderItem={(service) => (
            <Card
              service={service}
              expanded={expandedId === service.id}
              onToggle={() => setExpandedId((current) => (current === service.id ? null : service.id))}
            />
          )}
        />
      )}
    </Page>
  );
}
