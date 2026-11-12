import { Building2, CalendarClock, Info, Package } from 'lucide-react';
import type { WorkOrder } from '../../types/work_order_interface';
import type { ClientJob } from '../../types/client_job_interface';
import { Card as BaseCard, CardAction, CardActions, CardSection, DetailRow } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../functions/shared_functions';
import { WORK_ORDER_STATUS_TONES, workOrderNumber, workOrderStatusLabel } from '../../functions/work_order_functions';
import { JobIcon } from '../client-jobs/Card';

interface CardProps {
  order: WorkOrder;
  clientName?: string;
  clientJob?: ClientJob;
  expanded: boolean;
  onToggle: () => void;
}

export default function Card({ order, clientName, clientJob, expanded, onToggle }: CardProps) {
  const counts = [
    order.bagsCount != null ? `${order.bagsCount} bag${order.bagsCount === 1 ? '' : 's'}` : null,
    order.itemsCount != null ? `${order.itemsCount} item${order.itemsCount === 1 ? '' : 's'}` : null,
  ].filter(Boolean);

  return (
    <BaseCard
      title={clientJob?.name ?? 'Unknown client job'}
      subtitle={`${workOrderNumber(order)} · ${clientName ?? 'Unknown client'}`}
      avatar={<JobIcon job={{ jobType: clientJob?.jobType ?? 'residential' }} />}
      badge={<Badge tone={WORK_ORDER_STATUS_TONES[order.status]}>{workOrderStatusLabel(order.status)}</Badge>}
      expanded={expanded}
      onToggle={onToggle}
    >
      <CardSection>
        <DetailRow icon={Building2}>{clientName ?? 'Unknown client'}</DetailRow>
        <DetailRow icon={CalendarClock}>Required by {formatDate(order.dateRequired ?? undefined)}</DetailRow>
        {order.dateReceived && <DetailRow icon={CalendarClock}>Received {formatDate(order.dateReceived)}</DetailRow>}
        {counts.length > 0 && <DetailRow icon={Package}>{counts.join(' · ')}</DetailRow>}
      </CardSection>
      <CardActions>
        <CardAction icon={Info} label={`Open ${workOrderNumber(order)}`} to={`/work-orders/${order.id}`} />
      </CardActions>
    </BaseCard>
  );
}
