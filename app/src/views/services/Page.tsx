import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Pencil, Shirt, Tag, Trash2, WashingMachine, X } from 'lucide-react';
import { Page as BasePage } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { DetailRow, Panel, Section } from '../../components/ui/Card';
import { Avatar, Badge } from '../../components/ui/Badge';
import { ErrorState, LoadingState } from '../../components/ui/States';
import { RecordSection } from '../../components/ui/RecordSection';
import type { Service } from '../../types/service_interface';
import { formatPrice, itemsUsingService, serviceCategoryLabel } from '../../functions/catalog_functions';
import { itemHooks, serviceHooks } from '../../hooks/catalogHooks';
import { toast } from '../../stores/toastStore';
import { confirmDialog } from '../../stores/confirmStore';
import { ServiceDetailsForm, ServicePricesForm } from './Form';
import type { ServiceDetailsValues } from './Form';

type EditingSection = 'details' | 'prices' | null;

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const serviceQuery = serviceHooks.useOne(id);
  const service = serviceQuery.data;
  const { data: items = [] } = itemHooks.useList();
  const updateService = serviceHooks.useUpdate();
  const removeService = serviceHooks.useRemove();
  const createService = serviceHooks.useCreate();
  const [editing, setEditing] = useState<EditingSection>(null);
  const [copying, setCopying] = useState(false);

  const backButton = <IconButton icon={ArrowLeft} label="Back to services" onClick={() => navigate('/services')} />;

  if (serviceQuery.isLoading) {
    return (
      <BasePage title="Service" icon={WashingMachine} actions={backButton}>
        <LoadingState />
      </BasePage>
    );
  }
  if (serviceQuery.error || !service) {
    return (
      <BasePage title="Service" icon={WashingMachine} actions={backButton}>
        <ErrorState message={serviceQuery.error?.message ?? 'Service not found.'} onRetry={() => serviceQuery.refetch()} />
      </BasePage>
    );
  }

  const usedBy = itemsUsingService(items, service.id);

  // Saves one section's changes and closes its form
  const save = async (changes: Partial<Omit<Service, 'id' | 'timestamp' | 'createdBy'>>, message: string) => {
    try {
      await updateService.mutateAsync({ id: service.id, changes });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(message);
    setEditing(null);
  };

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: `Delete ${service.name}?`,
      message: 'This can’t be undone. To stop offering it but keep its history, set it to Inactive instead.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await removeService.mutateAsync(service.id);
    } catch {
      return;
    }
    toast.success(`${service.name} deleted`);
    navigate('/services');
  };

  // Pencil / close button for a section's header
  const editButton = (section: Exclude<EditingSection, null>, label: string) => (
    <IconButton
      icon={editing === section ? X : Pencil}
      label={editing === section ? 'Cancel' : label}
      active={editing === section}
      onClick={() => setEditing(editing === section ? null : section)}
    />
  );

  // Copy: a new service with these details (editable) plus the same default prices
  const handleCopy = async (details: ServiceDetailsValues) => {
    let created;
    try {
      created = await createService.mutateAsync({ ...details, prices: service.prices });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(`${details.name} created from ${service.name}`);
    setCopying(false);
    setEditing(null);
    navigate(`/services/${created.id}`);
  };

  if (copying) {
    return (
      <BasePage
        title={`Copy of ${service.name}`}
        icon={WashingMachine}
        actions={<IconButton icon={X} label="Cancel copy" active onClick={() => setCopying(false)} />}
      >
        <Panel>
          <div className="space-y-3">
            <p className="text-lg font-bold text-white">New service</p>
            <p className="text-xs text-accent-200">
              Copies the {service.prices.length} default price{service.prices.length === 1 ? '' : 's'} from {service.name}. Item prices aren't copied, as items point at the original service.
            </p>
            <ServiceDetailsForm
              initial={{ name: `${service.name} (copy)`, category: service.category, status: service.status, description: service.description ?? '' }}
              onSubmit={handleCopy}
              onCancel={() => setCopying(false)}
              submitLabel="Create copy"
              submitting={createService.isPending}
            />
          </div>
        </Panel>
      </BasePage>
    );
  }

  const active = service.status === 'active';

  return (
    <BasePage
      title={service.name}
      icon={WashingMachine}
      actions={
        <>
          <IconButton icon={Copy} label="Copy service" onClick={() => setCopying(true)} />
          <IconButton icon={Trash2} label="Delete service" onClick={handleDelete} disabled={removeService.isPending} />
          {backButton}
        </>
      }
    >
      {/* Summary */}
      <Panel>
        <div className="flex items-center gap-2">
          <Avatar name={service.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold text-white">{service.name}</p>
            <p className="truncate text-xs font-medium text-accent-300">{serviceCategoryLabel(service.category)}</p>
          </div>
          <Badge tone={active ? 'success' : 'muted'}>{active ? 'Active' : 'Inactive'}</Badge>
        </div>
      </Panel>

      {/* Details */}
      <Section title="Details" actions={editButton('details', 'Edit details')}>
        {editing === 'details' ? (
          <ServiceDetailsForm
            initial={{ name: service.name, category: service.category, status: service.status, description: service.description ?? '' }}
            onSubmit={(values) => save(values, 'Details saved')}
            onCancel={() => setEditing(null)}
            submitting={updateService.isPending}
          />
        ) : (
          <>
            <p>
              <span className="text-muted-300">Category:</span> {serviceCategoryLabel(service.category)}
            </p>
            <p>
              <span className="text-muted-300">Status:</span> {active ? 'Active' : 'Inactive'}
            </p>
            {service.description && <p className="whitespace-pre-wrap">{service.description}</p>}
          </>
        )}
      </Section>

      {/* Default prices */}
      <Section title="Default prices" actions={editButton('prices', 'Edit prices')}>
        {editing === 'prices' ? (
          <ServicePricesForm
            initial={service.prices}
            onSubmit={(prices) => save({ prices }, 'Prices saved')}
            onCancel={() => setEditing(null)}
            submitting={updateService.isPending}
          />
        ) : service.prices.length === 0 ? (
          <p className="text-muted-300">No prices yet. Use the pencil to add one.</p>
        ) : (
          service.prices.map((entry) => (
            <DetailRow key={entry.unit} icon={Tag}>
              {formatPrice(entry.price, entry.unit)}
            </DetailRow>
          ))
        )}
        <p className="pt-1 text-muted-300">Items can set their own price for this service. These are used when they don't.</p>
      </Section>

      {/* Items priced for this service */}
      <Section title={`Items${usedBy.length ? ` (${usedBy.length})` : ''}`}>
        {usedBy.length === 0 ? (
          <p className="text-muted-300">No items have a price for this service yet. Add one from an item's page.</p>
        ) : (
          usedBy.map((item) => (
            <Link key={item.id} to={`/items/${item.id}`} className="flex items-center gap-2 font-bold hover:text-accent-300">
              <Shirt className="h-3 w-3 shrink-0" />
              {item.name}
            </Link>
          ))
        )}
      </Section>

      <RecordSection timestamp={service.timestamp} createdBy={service.createdBy} />
    </BasePage>
  );
}
