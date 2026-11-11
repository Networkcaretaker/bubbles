import { Link } from 'react-router-dom';
import { CalendarClock, UserRound } from 'lucide-react';
import type { CreatedBy, Timestamp } from '../../types/shared_interface';
import { formatDate } from '../../functions/shared_functions';
import { DetailRow, Section } from './Card';

interface RecordSectionProps {
  timestamp?: Timestamp;
  createdBy?: CreatedBy;
}

// "Record" panel at the bottom of a page: who created it, when, and when it last changed
export function RecordSection({ timestamp, createdBy }: RecordSectionProps) {
  return (
    <Section title="Record">
      <DetailRow icon={UserRound}>
        Created by{' '}
        {createdBy ? (
          <Link to={`/users/${createdBy.uid}`} className="font-bold hover:text-accent-300">
            {createdBy.name}
          </Link>
        ) : (
          <span className="text-muted-300">Unknown</span>
        )}
      </DetailRow>
      <DetailRow icon={CalendarClock}>Added {formatDate(timestamp?.createdAt)}</DetailRow>
      <DetailRow icon={CalendarClock}>Last updated {formatDate(timestamp?.updatedAt)}</DetailRow>
    </Section>
  );
}
