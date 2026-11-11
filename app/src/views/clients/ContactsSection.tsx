import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link2, Pencil, Phone, Unlink, UserPlus, X } from 'lucide-react';
import type { Client } from '../../types/client_interface';
import type { ContactRole } from '../../types/contact_interface';
import { Section } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { Field, FieldRow, Select } from '../../components/ui/Form';
import { ErrorState, Spinner } from '../../components/ui/States';
import { CONTACT_ROLE_OPTIONS, contactRoleLabel } from '../../functions/client_functions';
import { contactHooks } from '../../hooks/clientHooks';
import { toast } from '../../stores/toastStore';
import { confirmDialog } from '../../stores/confirmStore';
import ContactForm from '../contacts/Form';
import type { ContactFormValues } from '../contacts/Form';

type Mode = 'view' | 'manage' | 'link' | 'new';

// The client's contacts. The link is stored on each contact (clientId + role).
export default function ContactsSection({ client }: { client: Client }) {
  const linked = contactHooks.useForClient(client.id);
  const { data: allContacts = [] } = contactHooks.useList();
  const updateContact = contactHooks.useUpdate();
  const createContact = contactHooks.useCreate();

  const [mode, setMode] = useState<Mode>('view');
  const [pickId, setPickId] = useState('');
  const [pickRole, setPickRole] = useState<ContactRole>('primary');

  const unlinked = allContacts.filter((contact) => !contact.clientId);
  const contacts = linked.data ?? [];

  const changeRole = async (id: string, role: ContactRole) => {
    try {
      await updateContact.mutateAsync({ id, changes: { role } });
    } catch {
      return;
    }
    toast.success('Role updated');
  };

  const unlink = async (id: string, name: string) => {
    const confirmed = await confirmDialog({
      title: `Unlink ${name}?`,
      message: `${name} will be kept in Contacts, just no longer linked to ${client.name}.`,
      confirmLabel: 'Unlink',
    });
    if (!confirmed) return;
    try {
      await updateContact.mutateAsync({ id, changes: { clientId: null, role: null } });
    } catch {
      return;
    }
    toast.success(`${name} unlinked`);
  };

  const linkExisting = async () => {
    const contact = unlinked.find((c) => c.id === pickId);
    if (!contact) return;
    try {
      await updateContact.mutateAsync({ id: contact.id, changes: { clientId: client.id, role: pickRole } });
    } catch {
      return;
    }
    toast.success(`${contact.name} linked to ${client.name}`);
    setPickId('');
    setMode('manage');
  };

  const addNew = async (values: ContactFormValues) => {
    try {
      await createContact.mutateAsync({ ...values, clientId: client.id });
    } catch {
      return;
    }
    toast.success(`${values.name} added to ${client.name}`);
    setMode('manage');
  };

  const editing = mode !== 'view';

  return (
    <Section
      title={`Contacts${contacts.length ? ` (${contacts.length})` : ''}`}
      actions={
        <IconButton
          icon={editing ? X : Pencil}
          label={editing ? 'Done' : 'Manage contacts'}
          active={editing}
          onClick={() => setMode(editing ? 'view' : 'manage')}
        />
      }
    >
      {linked.isLoading && <Spinner className="h-5 w-5" />}
      {linked.error && <ErrorState message={linked.error.message} onRetry={() => linked.refetch()} />}
      {!linked.isLoading && contacts.length === 0 && mode === 'view' && (
        <p className="text-muted-300">No contacts yet. Use the pencil to add one.</p>
      )}

      {/* Linked contacts */}
      {contacts.map((contact) => (
        <div key={contact.id} className="flex items-center justify-between gap-2 border-l-2 border-accent-400 pl-3">
          <div className="min-w-0 flex-1">
            <Link to={`/contacts/${contact.id}`} className="block truncate font-bold hover:text-accent-300">
              {contact.name}
            </Link>
            {contact.phone && (
              <span className="flex items-center gap-1 text-muted-300">
                <Phone className="h-3 w-3" /> {contact.phone}
              </span>
            )}
          </div>
          {mode === 'manage' ? (
            <div className="flex shrink-0 items-center gap-1">
              <Select
                aria-label={`Role of ${contact.name}`}
                options={CONTACT_ROLE_OPTIONS}
                value={contact.role ?? 'other'}
                onChange={(e) => changeRole(contact.id, e.target.value as ContactRole)}
                className="!w-36 !py-1 text-xs"
              />
              <IconButton icon={Unlink} label={`Unlink ${contact.name}`} onClick={() => unlink(contact.id, contact.name)} />
            </div>
          ) : (
            contact.role && <Badge>{contactRoleLabel(contact.role)}</Badge>
          )}
        </div>
      ))}

      {/* Add buttons */}
      {mode === 'manage' && (
        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <Button variant="secondary" icon={Link2} onClick={() => setMode('link')} disabled={unlinked.length === 0}>
            Link existing contact
          </Button>
          <Button variant="secondary" icon={UserPlus} onClick={() => setMode('new')}>
            New contact
          </Button>
        </div>
      )}
      {mode === 'manage' && unlinked.length === 0 && (
        <p className="text-muted-300">Every contact is already linked to a client, so only "New contact" is available.</p>
      )}

      {/* Link an existing, unlinked contact */}
      {mode === 'link' && (
        <div className="space-y-3 rounded-lg border border-accent-500/30 bg-brand-900/30 p-3">
          <FieldRow>
            <Field label="Contact">
              <Select
                placeholder="Choose…"
                options={unlinked.map((contact) => ({ value: contact.id, label: contact.name }))}
                value={pickId}
                onChange={(e) => setPickId(e.target.value)}
              />
            </Field>
            <Field label="Role">
              <Select options={CONTACT_ROLE_OPTIONS} value={pickRole} onChange={(e) => setPickRole(e.target.value as ContactRole)} />
            </Field>
          </FieldRow>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setMode('manage')}>
              Cancel
            </Button>
            <Button icon={Link2} onClick={linkExisting} disabled={!pickId} loading={updateContact.isPending}>
              Link
            </Button>
          </div>
        </div>
      )}

      {/* Create a new contact for this client */}
      {mode === 'new' && (
        <div className="rounded-lg border border-accent-500/30 bg-brand-900/30 p-3">
          <ContactForm
            fixedClientId={client.id}
            initial={{ role: 'primary' }}
            onSubmit={addNew}
            onCancel={() => setMode('manage')}
            submitLabel="Add contact"
            submitting={createContact.isPending}
          />
        </div>
      )}
    </Section>
  );
}
