import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import type { Client } from '../../types/client_interface';
import { Section } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { IconButton } from '../../components/ui/IconButton';
import { ErrorState, Spinner } from '../../components/ui/States';
import { jobTypeName } from '../../functions/client_functions';
import { formatIcon } from '../../functions/shared_functions';
import { clientJobHooks } from '../../hooks/clientHooks';
import { toast } from '../../stores/toastStore';
import ClientJobForm from '../client-jobs/Form';
import type { ClientJobFormValues } from '../client-jobs/Form';

// The client's Client Jobs. A job belongs to one client for good, so jobs can be
// added here but not moved to another client. Edit or delete a job on its own page.
export default function ClientJobsSection({ client }: { client: Client }) {
  const linked = clientJobHooks.useForClient(client.id);
  const createJob = clientJobHooks.useCreate();
  const [adding, setAdding] = useState(false);

  const jobs = linked.data ?? [];

  const addNew = async (values: ClientJobFormValues) => {
    try {
      await createJob.mutateAsync({ ...values, clientId: client.id });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(`${values.name} added to ${client.name}`);
    setAdding(false);
  };

  return (
    <Section
      title={`Client Jobs${jobs.length ? ` (${jobs.length})` : ''}`}
      actions={
        <IconButton
          icon={adding ? X : Plus}
          label={adding ? 'Cancel' : 'Add client job'}
          active={adding}
          onClick={() => setAdding(!adding)}
        />
      }
    >
      {adding && (
        <div className="rounded-lg border border-accent-500/30 bg-brand-900/30 p-3">
          <ClientJobForm
            fixedClientId={client.id}
            onSubmit={addNew}
            onCancel={() => setAdding(false)}
            submitLabel="Add client job"
            submitting={createJob.isPending}
          />
        </div>
      )}

      {linked.isLoading && <Spinner className="h-5 w-5" />}
      {linked.error && <ErrorState message={linked.error.message} onRetry={() => linked.refetch()} />}
      {!linked.isLoading && jobs.length === 0 && !adding && (
        <p className="text-muted-300">No jobs yet. Use + to add a yacht, property or other job.</p>
      )}

      {jobs.map((job) => (
        <div
          key={job.id}
          className={`flex items-center justify-between gap-2 border-l-2 border-accent-400 pl-3 ${job.status === 'inactive' ? 'opacity-60' : ''}`}
        >
          <Link to={`/client-jobs/${job.id}`} className="min-w-0 flex-1 truncate font-bold hover:text-accent-300">
            {formatIcon(job.jobType)} {job.name}
          </Link>
          <span className="flex shrink-0 items-center gap-2 text-accent-400">
            {jobTypeName(job.jobType)}
            {job.status === 'inactive' && <Badge tone="muted">Inactive</Badge>}
          </span>
        </div>
      ))}
    </Section>
  );
}
