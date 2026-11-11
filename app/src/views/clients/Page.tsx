import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, MapPin, Pencil, Phone, Trash2, X } from 'lucide-react';
import { Page as BasePage } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { CardAction, CardActions, DetailRow, Panel, Section } from '../../components/ui/Card';
import { Avatar, Badge } from '../../components/ui/Badge';
import { ErrorState, LoadingState } from '../../components/ui/States';
import { RecordSection } from '../../components/ui/RecordSection';
import { WhatsApp } from '../../components/ui/IconSets';
import type { Client } from '../../types/client_interface';
import { CLIENT_STATUS_TONES, clientStatusLabel, clientTypeLabel, whatsappNumber } from '../../functions/client_functions';
import { formatAddress } from '../../functions/shared_functions';
import { clientHooks, clientJobHooks, contactHooks } from '../../hooks/clientHooks';
import { toast } from '../../stores/toastStore';
import { confirmDialog } from '../../stores/confirmStore';
import { ContactInfoForm, DetailsForm } from './Form';
import ContactsSection from './ContactsSection';
import ClientJobsSection from './ClientJobsSection';

type EditingSection = 'details' | 'contactInfo' | null;

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clientQuery = clientHooks.useOne(id);
  const client = clientQuery.data;
  const { data: linkedContacts = [] } = contactHooks.useForClient(id);
  const { data: linkedJobs = [] } = clientJobHooks.useForClient(id);
  const updateClient = clientHooks.useUpdate();
  const removeClient = clientHooks.useRemove();
  const [editing, setEditing] = useState<EditingSection>(null);

  const backButton = <IconButton icon={ArrowLeft} label="Back to clients" onClick={() => navigate('/clients')} />;

  if (clientQuery.isLoading) {
    return (
      <BasePage title="Client" icon={Building2} actions={backButton}>
        <LoadingState />
      </BasePage>
    );
  }
  if (clientQuery.error || !client) {
    return (
      <BasePage title="Client" icon={Building2} actions={backButton}>
        <ErrorState message={clientQuery.error?.message ?? 'Client not found.'} onRetry={() => clientQuery.refetch()} />
      </BasePage>
    );
  }

  // Saves one section's changes and closes its form
  const save = async (changes: Partial<Omit<Client, 'id' | 'timestamp'>>, message: string) => {
    try {
      await updateClient.mutateAsync({ id: client.id, changes });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(message);
    setEditing(null);
  };

  const handleDelete = async () => {
    const contactCount = linkedContacts.length;
    const jobCount = linkedJobs.length;
    const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
    const confirmed = await confirmDialog({
      title: `Delete ${client.name}?`,
      message:
        (jobCount > 0 ? `Its ${plural(jobCount, 'client job')} will be deleted too. ` : '') +
        (contactCount > 0 ? `Its ${plural(contactCount, 'contact')} will be kept but unlinked. ` : '') +
        'This can’t be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await removeClient.mutateAsync(client.id);
    } catch {
      return;
    }
    toast.success(`${client.name} deleted`);
    navigate('/clients');
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

  const whatsapp = whatsappNumber(client.phone);

  return (
    <BasePage
      title={client.name}
      icon={Building2}
      actions={
        <>
          <IconButton icon={Trash2} label="Delete client" onClick={handleDelete} disabled={removeClient.isPending} />
          {backButton}
        </>
      }
    >
      {/* Summary */}
      <Panel>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Avatar name={client.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-white">{client.name}</p>
              <p className="truncate text-xs font-medium text-accent-300">{clientTypeLabel(client.clientType)}</p>
            </div>
            <Badge tone={CLIENT_STATUS_TONES[client.status]}>{clientStatusLabel(client.status)}</Badge>
          </div>
          {(client.phone || client.email) && (
            <CardActions>
              {client.phone && <CardAction icon={Phone} label={`Call ${client.name}`} href={`tel:${client.phone}`} />}
              {client.email && <CardAction icon={Mail} label={`Email ${client.name}`} href={`mailto:${client.email}`} />}
              {whatsapp && <CardAction icon={WhatsApp} label={`WhatsApp ${client.name}`} href={`https://wa.me/${whatsapp}`} />}
            </CardActions>
          )}
        </div>
      </Panel>

      {/* Details */}
      <Section title="Details" actions={editButton('details', 'Edit details')}>
        {editing === 'details' ? (
          <DetailsForm
            initial={{ name: client.name, clientType: client.clientType, status: client.status }}
            onSubmit={(values) => save(values, 'Details saved')}
            onCancel={() => setEditing(null)}
            submitting={updateClient.isPending}
          />
        ) : (
          <>
            <p>
              <span className="text-muted-300">Type:</span> {clientTypeLabel(client.clientType)}
            </p>
            <p>
              <span className="text-muted-300">Status:</span> {clientStatusLabel(client.status)}
            </p>
          </>
        )}
      </Section>

      {/* Contact info */}
      <Section title="Contact info" actions={editButton('contactInfo', 'Edit contact info')}>
        {editing === 'contactInfo' ? (
          <ContactInfoForm
            initial={{ phone: client.phone ?? '', email: client.email ?? '', address: client.address ?? {} }}
            onSubmit={(values) => save(values, 'Contact info saved')}
            onCancel={() => setEditing(null)}
            submitting={updateClient.isPending}
          />
        ) : (
          <>
            <DetailRow icon={Phone}>{client.phone || 'No phone number'}</DetailRow>
            <DetailRow icon={Mail}>{client.email || 'No email'}</DetailRow>
            <DetailRow icon={MapPin}>{formatAddress(client.address)}</DetailRow>
          </>
        )}
      </Section>

      {/* Contacts */}
      <ContactsSection client={client} />

      {/* Client Jobs */}
      <ClientJobsSection client={client} />

      {/* Record */}
      <RecordSection timestamp={client.timestamp} createdBy={client.createdBy} />
    </BasePage>
  );
}
