import { Building2, Info, MapPin, StickyNote } from 'lucide-react';
import type { ClientJob } from '../../types/client_job_interface';
import { Card as BaseCard, CardAction, CardActions, CardSection, DetailRow } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { jobTypeName } from '../../functions/client_functions';
import { formatAddress, formatIcon } from '../../functions/shared_functions';

interface CardProps {
  job: ClientJob;
  clientName?: string;
  expanded: boolean;
  onToggle: () => void;
}

// Emoji for the job type, in the same round space as other cards' initials
export function JobIcon({ job }: { job: Pick<ClientJob, 'jobType'> }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-600 text-2xl">
      {formatIcon(job.jobType)}
    </div>
  );
}

export default function Card({ job, clientName, expanded, onToggle }: CardProps) {
  return (
    <BaseCard
      title={job.name}
      subtitle={`${jobTypeName(job.jobType)} · ${clientName ?? 'No client'}`}
      avatar={<JobIcon job={job} />}
      badge={job.status === 'inactive' ? <Badge tone="muted">Inactive</Badge> : undefined}
      expanded={expanded}
      onToggle={onToggle}
    >
      <CardSection>
        <DetailRow icon={Building2}>{clientName ?? 'No client'}</DetailRow>
        <DetailRow icon={MapPin}>{formatAddress(job.address)}</DetailRow>
        {job.notes && <DetailRow icon={StickyNote}>{job.notes}</DetailRow>}
      </CardSection>
      <CardActions>
        <CardAction icon={Info} label={`Open ${job.name}`} to={`/client-jobs/${job.id}`} />
      </CardActions>
    </BaseCard>
  );
}
