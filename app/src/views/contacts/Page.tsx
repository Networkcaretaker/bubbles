import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Contact as ContactIcon, Mail, MapPin, Pencil, Phone, Trash2, X } from 'lucide-react';
import { Page as BasePage } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { CardAction, CardActions, DetailRow, Panel, Section } from '../../components/ui/Card';
import { Avatar, Badge } from '../../components/ui/Badge';
import { ErrorState, LoadingState } from '../../components/ui/States';
import { RecordSection } from '../../components/ui/RecordSection';
import { WhatsApp } from '../../components/ui/IconSets';
import type { Contact } from '../../types/contact_interface';
import { contactRoleLabel, whatsappNumber } from '../../functions/client_functions';
import { formatAddress } from '../../functions/shared_functions';
import { clientHooks, contactHooks } from '../../hooks/clientHooks';
import { toast } from '../../stores/toastStore';
import { confirmDialog } from '../../stores/confirmStore';
import { ContactDetailsForm, ContactLinkForm } from './Form';

type EditingSection = 'client' | 'details' | null;

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contactQuery = contactHooks.useOne(id);
  const contact = contactQuery.data;
  const { data: client } = clientHooks.useOne(contact?.clientId ?? undefined);
  const { data: clients = [] } = clientHooks.useList();
  const updateContact = contactHooks.useUpdate();
  const removeContact = contactHooks.useRemove();
  const [editing, setEditing] = useState<EditingSection>(null);

  const backButton = <IconButton icon={ArrowLeft} label="Back to contacts" onClick={() => navigate('/contacts')} />;

  if (contactQuery.isLoading) {
    return (
      <BasePage title="Contact" icon={ContactIcon} actions={backButton}>
        <LoadingState />
      </BasePage>
    );
  }
  if (contactQuery.error || !contact) {
    return (
      <BasePage title="Contact" icon={ContactIcon} actions={backButton}>
        <ErrorState message={contactQuery.error?.message ?? 'Contact not found.'} onRetry={() => contactQuery.refetch()} />
      </BasePage>
    );
  }

  // Saves one section's changes and closes its form
  const save = async (changes: Partial<Omit<Contact, 'id' | 'timestamp' | 'createdBy'>>, message: string) => {
    try {
      await updateContact.mutateAsync({ id: contact.id, changes });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(message);
    setEditing(null);
  };

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: `Delete ${contact.name}?`,
      message: 'This can’t be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await removeContact.mutateAsync(contact.id);
    } catch {
      return;
    }
    toast.success(`${contact.name} deleted`);
    navigate('/contacts');
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

  const whatsapp = whatsappNumber(contact.phone);

  return (
    <BasePage
      title={contact.name}
      icon={ContactIcon}
      actions={
        <>
          <IconButton icon={Trash2} label="Delete contact" onClick={handleDelete} disabled={removeContact.isPending} />
          {backButton}
        </>
      }
    >
      {/* Summary */}
      <Panel>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Avatar name={contact.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-white">{contact.name}</p>
              <p className="truncate text-xs font-medium text-accent-300">{client?.name ?? 'No client'}</p>
            </div>
            {contact.role && <Badge>{contactRoleLabel(contact.role)}</Badge>}
          </div>
          {(contact.phone || contact.email) && (
            <CardActions>
              {contact.phone && <CardAction icon={Phone} label={`Call ${contact.name}`} href={`tel:${contact.phone}`} />}
              {contact.email && <CardAction icon={Mail} label={`Email ${contact.name}`} href={`mailto:${contact.email}`} />}
              {whatsapp && <CardAction icon={WhatsApp} label={`WhatsApp ${contact.name}`} href={`https://wa.me/${whatsapp}`} />}
            </CardActions>
          )}
        </div>
      </Panel>

      {/* Client and role */}
      <Section title="Client" actions={editButton('client', 'Change client or role')}>
        {editing === 'client' ? (
          <ContactLinkForm
            initial={{ clientId: contact.clientId ?? null, role: contact.role ?? null }}
            clients={clients}
            onSubmit={(values) => save(values, 'Client and role saved')}
            onCancel={() => setEditing(null)}
            submitting={updateContact.isPending}
          />
        ) : client ? (
          <Link to={`/clients/${client.id}`} className="flex items-center gap-2 hover:text-accent-300">
            <Building2 className="h-3 w-3 shrink-0" />
            <span className="font-bold">{client.name}</span>
            {contact.role && <span className="text-muted-300">· {contactRoleLabel(contact.role)}</span>}
          </Link>
        ) : (
          <p className="text-muted-300">Not linked to a client. Use the pencil to choose one.</p>
        )}
      </Section>

      {/* Contact details */}
      <Section title="Details" actions={editButton('details', 'Edit details')}>
        {editing === 'details' ? (
          <ContactDetailsForm
            initial={{ name: contact.name, email: contact.email ?? '', phone: contact.phone ?? '', address: contact.address ?? {} }}
            onSubmit={(values) => save(values, `${values.name} saved`)}
            onCancel={() => setEditing(null)}
            submitting={updateContact.isPending}
          />
        ) : (
          <>
            <DetailRow icon={Phone}>{contact.phone || 'No phone number'}</DetailRow>
            <DetailRow icon={Mail}>{contact.email || 'No email'}</DetailRow>
            <DetailRow icon={MapPin}>{formatAddress(contact.address)}</DetailRow>
          </>
        )}
      </Section>

      <RecordSection timestamp={contact.timestamp} createdBy={contact.createdBy} />
    </BasePage>
  );
}
