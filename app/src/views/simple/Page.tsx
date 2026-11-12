import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, X } from 'lucide-react';
import { Page as BasePage } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { Panel, Section } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Badge';
import { ErrorState, LoadingState } from '../../components/ui/States';
import { RecordSection } from '../../components/ui/RecordSection';
import { toast } from '../../stores/toastStore';
import { confirmDialog } from '../../stores/confirmStore';
import type { SimpleSectionConfig } from './sections';
import { NameForm } from './Form';

// Detail page for a basic named collection (Batches, Quotes, Invoices, Templates)
export default function Page({ config }: { config: SimpleSectionConfig }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const docQuery = config.hooks.useOne(id);
  const doc = docQuery.data;
  const updateDoc = config.hooks.useUpdate();
  const removeDoc = config.hooks.useRemove();
  const [editing, setEditing] = useState(false);

  const Icon = config.icon;
  const title = config.singular.charAt(0).toUpperCase() + config.singular.slice(1);
  const backButton = <IconButton icon={ArrowLeft} label={`Back to ${config.title.toLowerCase()}`} onClick={() => navigate(config.path)} />;

  if (docQuery.isLoading) {
    return (
      <BasePage title={title} icon={Icon} actions={backButton}>
        <LoadingState />
      </BasePage>
    );
  }
  if (docQuery.error || !doc) {
    return (
      <BasePage title={title} icon={Icon} actions={backButton}>
        <ErrorState message={docQuery.error?.message ?? `${title} not found.`} onRetry={() => docQuery.refetch()} />
      </BasePage>
    );
  }

  const handleRename = async (name: string) => {
    try {
      await updateDoc.mutateAsync({ id: doc.id, changes: { name } });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(`${name} saved`);
    setEditing(false);
  };

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: `Delete ${doc.name}?`,
      message: 'This can’t be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await removeDoc.mutateAsync(doc.id);
    } catch {
      return;
    }
    toast.success(`${doc.name} deleted`);
    navigate(config.path);
  };

  return (
    <BasePage
      title={doc.name}
      icon={Icon}
      actions={
        <>
          <IconButton icon={Trash2} label={`Delete ${config.singular}`} onClick={handleDelete} disabled={removeDoc.isPending} />
          {backButton}
        </>
      }
    >
      <Panel>
        <div className="flex items-center gap-2">
          <Avatar name={doc.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold text-white">{doc.name}</p>
            <p className="truncate text-xs font-medium text-accent-300">{title}</p>
          </div>
        </div>
      </Panel>

      <Section
        title="Details"
        actions={
          <IconButton
            icon={editing ? X : Pencil}
            label={editing ? 'Cancel' : 'Edit name'}
            active={editing}
            onClick={() => setEditing(!editing)}
          />
        }
      >
        {editing ? (
          <NameForm initial={doc.name} onSubmit={handleRename} onCancel={() => setEditing(false)} submitting={updateDoc.isPending} />
        ) : (
          <p>
            <span className="text-muted-300">Name:</span> {doc.name}
          </p>
        )}
      </Section>

      <RecordSection timestamp={doc.timestamp} createdBy={doc.createdBy} />
    </BasePage>
  );
}
