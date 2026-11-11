import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Shirt } from 'lucide-react';
import { Page } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { Panel } from '../../components/ui/Card';
import { DataList } from '../../components/ui/DataList';
import { EmptyState } from '../../components/ui/States';
import { Field, FieldRow, Input, Select } from '../../components/ui/Form';
import { matchesSearch } from '../../lib/search';
import { ITEM_CATEGORY_OPTIONS, STATUS_OPTIONS, itemCategoryLabel } from '../../functions/catalog_functions';
import { itemHooks, serviceHooks } from '../../hooks/catalogHooks';
import { toast } from '../../stores/toastStore';
import Card from './Card';
import { ItemDetailsForm } from './Form';
import type { ItemDetailsValues } from './Form';

export default function Main() {
  const navigate = useNavigate();
  const items = itemHooks.useList();
  const { data: services = [] } = serviceHooks.useList();
  const createItem = itemHooks.useCreate();

  const [adding, setAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const serviceById = useMemo(() => new Map(services.map((service) => [service.id, service])), [services]);

  const toggleFilter = () => {
    // Closing the filter also clears it, so nothing stays hidden by accident
    if (showFilter) {
      setSearch('');
      setCategory('');
      setStatus('');
    }
    setShowFilter(!showFilter);
  };

  // New items start with the basics; sizes and prices are added on their page
  const handleAdd = async (details: ItemDetailsValues) => {
    let created;
    try {
      created = await createItem.mutateAsync({ ...details, sizes: [], prices: [] });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(`${details.name} added. Add its sizes and prices below.`);
    navigate(`/items/${created.id}`);
  };

  return (
    <Page
      title="Items"
      icon={Shirt}
      actions={
        <>
          <IconButton icon={Plus} label="Add item" active={adding} onClick={() => setAdding(!adding)} />
          {!adding && <IconButton icon={Search} label="Search and filter" active={showFilter} onClick={toggleFilter} />}
        </>
      }
    >
      {adding && (
        <Panel>
          <div className="space-y-3">
            <p className="text-lg font-bold text-white">New item</p>
            <ItemDetailsForm
              initial={{ name: '', category: 'bed-linen', status: 'active' }}
              onSubmit={handleAdd}
              onCancel={() => setAdding(false)}
              submitLabel="Add item"
              submitting={createItem.isPending}
            />
          </div>
        </Panel>
      )}

      {/* While adding, only the form is shown */}
      {!adding && showFilter && (
        <Panel>
          <div className="space-y-3">
            <Field label="Search">
              <Input type="search" placeholder="Item name…" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
            </Field>
            <FieldRow>
              <Field label="Category">
                <Select placeholder="All" options={ITEM_CATEGORY_OPTIONS} value={category} onChange={(e) => setCategory(e.target.value)} />
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
          query={items}
          getKey={(item) => item.id}
          filter={(item) =>
            matchesSearch(search, item.name, itemCategoryLabel(item.category)) &&
            (!category || item.category === category) &&
            (!status || item.status === status)
          }
          empty={<EmptyState icon={Shirt} title="No items yet" message="Add an item with the + button at the top." />}
          noMatchMessage="No items match your search or filters."
          renderItem={(item) => (
            <Card
              item={item}
              services={serviceById}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
            />
          )}
        />
      )}
    </Page>
  );
}
