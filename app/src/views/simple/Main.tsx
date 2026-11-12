import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Info, Plus, Search } from 'lucide-react';
import { Page } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { Card, CardAction, CardActions, CardSection, Panel } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Badge';
import { DataList } from '../../components/ui/DataList';
import { EmptyState } from '../../components/ui/States';
import { Field, Input } from '../../components/ui/Form';
import { matchesSearch } from '../../lib/search';
import { formatDate } from '../../functions/shared_functions';
import { toast } from '../../stores/toastStore';
import type { SimpleSectionConfig } from './sections';
import { NameForm } from './Form';

// List page for a basic named collection (Batches, Quotes, Invoices, Templates)
export default function Main({ config }: { config: SimpleSectionConfig }) {
  const navigate = useNavigate();
  const docs = config.hooks.useList();
  const createDoc = config.hooks.useCreate();

  const [adding, setAdding] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = async (name: string) => {
    let created;
    try {
      created = await createDoc.mutateAsync({ name });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(`${name} added`);
    navigate(`${config.path}/${created.id}`);
  };

  const toggleSearch = () => {
    if (showSearch) setSearch('');
    setShowSearch(!showSearch);
  };

  const Icon = config.icon;

  return (
    <Page
      title={config.title}
      icon={Icon}
      actions={
        <>
          <IconButton icon={Plus} label={`Add ${config.singular}`} active={adding} onClick={() => setAdding(!adding)} />
          {!adding && <IconButton icon={Search} label="Search" active={showSearch} onClick={toggleSearch} />}
        </>
      }
    >
      {adding && (
        <Panel>
          <div className="space-y-3">
            <p className="text-lg font-bold text-white">New {config.singular}</p>
            <NameForm
              initial=""
              onSubmit={handleAdd}
              onCancel={() => setAdding(false)}
              submitLabel={`Add ${config.singular}`}
              submitting={createDoc.isPending}
            />
          </div>
        </Panel>
      )}

      {!adding && showSearch && (
        <Panel>
          <Field label="Search">
            <Input type="search" placeholder="Name…" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
          </Field>
        </Panel>
      )}

      {!adding && (
        <DataList
          query={docs}
          getKey={(doc) => doc.id}
          filter={(doc) => matchesSearch(search, doc.name)}
          empty={<EmptyState icon={Icon} title={`No ${config.title.toLowerCase()} yet`} message="Add one with the + button at the top." />}
          noMatchMessage={`No ${config.title.toLowerCase()} match your search.`}
          renderItem={(doc) => (
            <Card
              title={doc.name}
              subtitle={`Added ${formatDate(doc.timestamp?.createdAt)}`}
              avatar={<Avatar name={doc.name} />}
              expanded={expandedId === doc.id}
              onToggle={() => setExpandedId((current) => (current === doc.id ? null : doc.id))}
            >
              <CardSection>
                <p>
                  Created by{' '}
                  {doc.createdBy ? (
                    <Link to={`/users/${doc.createdBy.uid}`} className="font-bold hover:text-accent-300">
                      {doc.createdBy.name}
                    </Link>
                  ) : (
                    'Unknown'
                  )}
                </p>
              </CardSection>
              <CardActions>
                <CardAction icon={Info} label={`Open ${doc.name}`} to={`${config.path}/${doc.id}`} />
              </CardActions>
            </Card>
          )}
        />
      )}
    </Page>
  );
}
