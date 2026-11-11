import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Building2, MapPin, Pencil, Trash2, X } from 'lucide-react';
import { Page as BasePage } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { DetailRow, Panel, Section } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ErrorState, LoadingState } from '../../components/ui/States';
import { RecordSection } from '../../components/ui/RecordSection';
import type { ClientJob } from '../../types/client_job_interface';
import { jobTypeName } from '../../functions/client_functions';
import { formatAddress } from '../../functions/shared_functions';
import { clientHooks, clientJobHooks } from '../../hooks/clientHooks';
import { toast } from '../../stores/toastStore';
import { confirmDialog } from '../../stores/confirmStore';
import { JobIcon } from './Card';
import { JobDetailsForm, JobLocationForm, JobNotesForm } from './Form';

type EditingSection = 'details' | 'location' | 'notes' | null;

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const jobQuery = clientJobHooks.useOne(id);
  const job = jobQuery.data;
  const { data: client } = clientHooks.useOne(job?.clientId ?? undefined);
  const updateJob = clientJobHooks.useUpdate();
  const removeJob = clientJobHooks.useRemove();
  const [editing, setEditing] = useState<EditingSection>(null);

  const backButton = <IconButton icon={ArrowLeft} label="Back to client jobs" onClick={() => navigate('/client-jobs')} />;

  if (jobQuery.isLoading) {
    return (
      <BasePage title="Client Job" icon={Briefcase} actions={backButton}>
        <LoadingState />
      </BasePage>
    );
  }
  if (jobQuery.error || !job) {
    return (
      <BasePage title="Client Job" icon={Briefcase} actions={backButton}>
        <ErrorState message={jobQuery.error?.message ?? 'Client job not found.'} onRetry={() => jobQuery.refetch()} />
      </BasePage>
    );
  }

  // Saves one section's changes and closes its form
  const save = async (changes: Partial<Omit<ClientJob, 'id' | 'timestamp' | 'createdBy' | 'clientId'>>, message: string) => {
    try {
      await updateJob.mutateAsync({ id: job.id, changes });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(message);
    setEditing(null);
  };

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: `Delete ${job.name}?`,
      message: 'This can’t be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await removeJob.mutateAsync(job.id);
    } catch {
      return;
    }
    toast.success(`${job.name} deleted`);
    navigate('/client-jobs');
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

  const active = job.status === 'active';

  return (
    <BasePage
      title={job.name}
      icon={Briefcase}
      actions={
        <>
          <IconButton icon={Trash2} label="Delete client job" onClick={handleDelete} disabled={removeJob.isPending} />
          {backButton}
        </>
      }
    >
      {/* Summary */}
      <Panel>
        <div className="flex items-center gap-2">
          <JobIcon job={job} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold text-white">{job.name}</p>
            <p className="truncate text-xs font-medium text-accent-300">{client?.name ?? 'No client'}</p>
          </div>
          <Badge tone={active ? 'success' : 'muted'}>{active ? 'Active' : 'Inactive'}</Badge>
        </div>
      </Panel>

      {/* Client (fixed once the job is created, so no edit button) */}
      <Section title="Client">
        {client ? (
          <Link to={`/clients/${client.id}`} className="flex items-center gap-2 font-bold hover:text-accent-300">
            <Building2 className="h-3 w-3 shrink-0" />
            {client.name}
          </Link>
        ) : (
          <p className="text-muted-300">Not linked to a client.</p>
        )}
      </Section>

      {/* Details */}
      <Section title="Details" actions={editButton('details', 'Edit details')}>
        {editing === 'details' ? (
          <JobDetailsForm
            initial={{ name: job.name, jobType: job.jobType, status: job.status }}
            onSubmit={(values) => save(values, 'Details saved')}
            onCancel={() => setEditing(null)}
            submitting={updateJob.isPending}
          />
        ) : (
          <>
            <p>
              <span className="text-muted-300">Type:</span> {jobTypeName(job.jobType)}
            </p>
            <p>
              <span className="text-muted-300">Status:</span> {active ? 'Active' : 'Inactive'}
            </p>
          </>
        )}
      </Section>

      {/* Location */}
      <Section title="Location" actions={editButton('location', 'Edit location')}>
        {editing === 'location' ? (
          <JobLocationForm
            initial={job.address ?? {}}
            onSubmit={(address) => save({ address }, 'Location saved')}
            onCancel={() => setEditing(null)}
            submitting={updateJob.isPending}
          />
        ) : (
          <DetailRow icon={MapPin}>{formatAddress(job.address)}</DetailRow>
        )}
      </Section>

      {/* Notes */}
      <Section title="Notes" actions={editButton('notes', 'Edit notes')}>
        {editing === 'notes' ? (
          <JobNotesForm
            initial={job.notes ?? ''}
            onSubmit={(notes) => save({ notes }, 'Notes saved')}
            onCancel={() => setEditing(null)}
            submitting={updateJob.isPending}
          />
        ) : job.notes ? (
          <p className="whitespace-pre-wrap">{job.notes}</p>
        ) : (
          <p className="text-muted-300">No notes.</p>
        )}
      </Section>

      <RecordSection timestamp={job.timestamp} createdBy={job.createdBy} />
    </BasePage>
  );
}
