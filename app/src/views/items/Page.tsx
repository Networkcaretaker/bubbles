import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Pencil, Shirt, Trash2, X } from 'lucide-react';
import { Page as BasePage } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { Panel, Section } from '../../components/ui/Card';
import { Avatar, Badge } from '../../components/ui/Badge';
import { ErrorState, LoadingState } from '../../components/ui/States';
import { RecordSection } from '../../components/ui/RecordSection';
import type { CatalogItem, ItemServicePrice, ItemSize } from '../../types/item_interface';
import type { Service } from '../../types/service_interface';
import {
  formatPrice,
  itemCategoryLabel,
  itemPrice,
  itemSizeLabel,
  pricingUnitLabel,
  unitHasNoPrice,
} from '../../functions/catalog_functions';
import { itemHooks, serviceHooks } from '../../hooks/catalogHooks';
import { toast } from '../../stores/toastStore';
import { confirmDialog } from '../../stores/confirmStore';
import { ItemDetailsForm, ItemPricesForm, ItemSizesForm } from './Form';
import type { ItemDetailsValues } from './Form';

type EditingSection = 'details' | 'sizes' | 'prices' | null;

// One line per size (or one line when there are no sizes). Prices taken from the service default are marked.
function PriceLines({ entry, service, sizes }: { entry: ItemServicePrice; service?: Service; sizes: ItemSize[] }) {
  if (unitHasNoPrice(entry.unit)) return <p>{formatPrice(null, entry.unit)}</p>;
  const lines = (sizes.length ? sizes : [undefined]).map((size) => {
    const { price, source } = itemPrice(entry, service, size);
    return (
      <p key={size ?? 'all'} className="flex justify-between gap-2">
        <span className="text-muted-300">{size ? itemSizeLabel(size) : 'Price'}</span>
        <span className={source === 'service' ? 'italic text-accent-300' : 'font-bold'}>
          {price === null ? 'No price' : formatPrice(price, 'fixed')}
          {source === 'service' && ' (default)'}
        </span>
      </p>
    );
  });
  return <div className="space-y-0.5">{lines}</div>;
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const itemQuery = itemHooks.useOne(id);
  const item = itemQuery.data;
  const { data: services = [] } = serviceHooks.useList();
  const updateItem = itemHooks.useUpdate();
  const removeItem = itemHooks.useRemove();
  const createItem = itemHooks.useCreate();
  const [editing, setEditing] = useState<EditingSection>(null);
  const [copying, setCopying] = useState(false);

  const serviceById = useMemo(() => new Map(services.map((service) => [service.id, service])), [services]);

  const backButton = <IconButton icon={ArrowLeft} label="Back to items" onClick={() => navigate('/items')} />;

  if (itemQuery.isLoading) {
    return (
      <BasePage title="Item" icon={Shirt} actions={backButton}>
        <LoadingState />
      </BasePage>
    );
  }
  if (itemQuery.error || !item) {
    return (
      <BasePage title="Item" icon={Shirt} actions={backButton}>
        <ErrorState message={itemQuery.error?.message ?? 'Item not found.'} onRetry={() => itemQuery.refetch()} />
      </BasePage>
    );
  }

  const sizes = item.sizes ?? [];
  const prices = item.prices ?? [];

  // Saves one section's changes and closes its form
  const save = async (changes: Partial<Omit<CatalogItem, 'id' | 'timestamp' | 'createdBy'>>, message: string) => {
    try {
      await updateItem.mutateAsync({ id: item.id, changes });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(message);
    setEditing(null);
  };

  // Changing sizes also drops prices for sizes that were removed
  const saveSizes = (newSizes: ItemSize[]) =>
    save(
      {
        sizes: newSizes,
        prices: prices.map((entry) => ({
          ...entry,
          sizePrices: (entry.sizePrices ?? []).filter((sp) => newSizes.includes(sp.size)),
        })),
      },
      'Sizes saved',
    );

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: `Delete ${item.name}?`,
      message: 'This can’t be undone. To stop offering it but keep its history, set it to Inactive instead.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await removeItem.mutateAsync(item.id);
    } catch {
      return;
    }
    toast.success(`${item.name} deleted`);
    navigate('/items');
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

  // Copy: a new item with these details (editable) plus the same sizes and prices
  const handleCopy = async (details: ItemDetailsValues) => {
    let created;
    try {
      created = await createItem.mutateAsync({ ...details, sizes, prices });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(`${details.name} created from ${item.name}`);
    setCopying(false);
    setEditing(null);
    navigate(`/items/${created.id}`);
  };

  if (copying) {
    return (
      <BasePage
        title={`Copy of ${item.name}`}
        icon={Shirt}
        actions={<IconButton icon={X} label="Cancel copy" active onClick={() => setCopying(false)} />}
      >
        <Panel>
          <div className="space-y-3">
            <p className="text-lg font-bold text-white">New item</p>
            <p className="text-xs text-accent-200">
              Copies the sizes and {prices.length} service price{prices.length === 1 ? '' : 's'} from {item.name}. You can change them on the new item afterwards.
            </p>
            <ItemDetailsForm
              initial={{ name: `${item.name} (copy)`, category: item.category, status: item.status }}
              onSubmit={handleCopy}
              onCancel={() => setCopying(false)}
              submitLabel="Create copy"
              submitting={createItem.isPending}
            />
          </div>
        </Panel>
      </BasePage>
    );
  }

  const active = item.status === 'active';

  return (
    <BasePage
      title={item.name}
      icon={Shirt}
      actions={
        <>
          <IconButton icon={Copy} label="Copy item" onClick={() => setCopying(true)} />
          <IconButton icon={Trash2} label="Delete item" onClick={handleDelete} disabled={removeItem.isPending} />
          {backButton}
        </>
      }
    >
      {/* Summary */}
      <Panel>
        <div className="flex items-center gap-2">
          <Avatar name={item.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold text-white">{item.name}</p>
            <p className="truncate text-xs font-medium text-accent-300">{itemCategoryLabel(item.category)}</p>
          </div>
          <Badge tone={active ? 'success' : 'muted'}>{active ? 'Active' : 'Inactive'}</Badge>
        </div>
      </Panel>

      {/* Details */}
      <Section title="Details" actions={editButton('details', 'Edit details')}>
        {editing === 'details' ? (
          <ItemDetailsForm
            initial={{ name: item.name, category: item.category, status: item.status }}
            onSubmit={(values) => save(values, 'Details saved')}
            onCancel={() => setEditing(null)}
            submitting={updateItem.isPending}
          />
        ) : (
          <>
            <p>
              <span className="text-muted-300">Category:</span> {itemCategoryLabel(item.category)}
            </p>
            <p>
              <span className="text-muted-300">Status:</span> {active ? 'Active' : 'Inactive'}
            </p>
          </>
        )}
      </Section>

      {/* Sizes */}
      <Section title="Sizes" actions={editButton('sizes', 'Edit sizes')}>
        {editing === 'sizes' ? (
          <ItemSizesForm initial={sizes} onSubmit={saveSizes} onCancel={() => setEditing(null)} submitting={updateItem.isPending} />
        ) : sizes.length === 0 ? (
          <p className="text-muted-300">No sizes. Use the pencil to add some if prices differ by size.</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {sizes.map((size) => (
              <Badge key={size}>{itemSizeLabel(size)}</Badge>
            ))}
          </div>
        )}
      </Section>

      {/* Prices per service */}
      <Section title={`Prices${prices.length ? ` (${prices.length})` : ''}`} actions={editButton('prices', 'Edit prices')}>
        {editing === 'prices' ? (
          <ItemPricesForm
            initial={prices}
            services={services}
            sizes={sizes}
            onSubmit={(newPrices) => save({ prices: newPrices }, 'Prices saved')}
            onCancel={() => setEditing(null)}
            submitting={updateItem.isPending}
          />
        ) : prices.length === 0 ? (
          <p className="text-muted-300">No prices yet. Use the pencil to add what each service costs for this item.</p>
        ) : (
          <div className="space-y-3">
            {prices.map((entry) => {
              const service = serviceById.get(entry.serviceId);
              return (
                <div key={`${entry.serviceId}-${entry.unit}`} className="space-y-1 border-l-2 border-accent-400 pl-3">
                  <p className="flex justify-between gap-2">
                    {service ? (
                      <Link to={`/services/${service.id}`} className="font-bold hover:text-accent-300">
                        {service.name}
                      </Link>
                    ) : (
                      <span className="font-bold text-danger-300">Deleted service</span>
                    )}
                    <span className="text-accent-400">{pricingUnitLabel(entry.unit)}</span>
                  </p>
                  <PriceLines entry={entry} service={service} sizes={sizes} />
                </div>
              );
            })}
            <p className="text-muted-300">
              <span className="italic text-accent-300">(default)</span> means the service's default price is used.
            </p>
          </div>
        )}
      </Section>

      <RecordSection timestamp={item.timestamp} createdBy={item.createdBy} />
    </BasePage>
  );
}
