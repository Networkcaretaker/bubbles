import { Info, Mail, MapPin, Phone } from 'lucide-react';
import type { Client } from '../../types/client_interface';
import { Card as BaseCard, CardAction, CardActions, CardSection, DetailRow } from '../../components/ui/Card';
import { Avatar, Badge } from '../../components/ui/Badge';
import { WhatsApp } from '../../components/ui/IconSets';
import { CLIENT_STATUS_TONES, clientStatusLabel, clientTypeLabel, whatsappNumber } from '../../functions/client_functions';
import { formatAddress } from '../../functions/shared_functions';

interface CardProps {
  client: Client;
  expanded: boolean;
  onToggle: () => void;
}

export default function Card({ client, expanded, onToggle }: CardProps) {
  const whatsapp = whatsappNumber(client.phone);

  return (
    <BaseCard
      title={client.name}
      subtitle={clientTypeLabel(client.clientType)}
      avatar={<Avatar name={client.name} />}
      badge={<Badge tone={CLIENT_STATUS_TONES[client.status]}>{clientStatusLabel(client.status)}</Badge>}
      expanded={expanded}
      onToggle={onToggle}
    >
      <CardSection>
        <DetailRow icon={Phone}>{client.phone || 'No phone number'}</DetailRow>
        <DetailRow icon={Mail}>{client.email || 'No email'}</DetailRow>
        <DetailRow icon={MapPin}>{formatAddress(client.address)}</DetailRow>
      </CardSection>

      <CardActions>
        {client.phone && <CardAction icon={Phone} label={`Call ${client.name}`} href={`tel:${client.phone}`} />}
        {client.email && <CardAction icon={Mail} label={`Email ${client.name}`} href={`mailto:${client.email}`} />}
        {whatsapp && <CardAction icon={WhatsApp} label={`WhatsApp ${client.name}`} href={`https://wa.me/${whatsapp}`} />}
        <CardAction icon={Info} label={`Open ${client.name}`} to={`/clients/${client.id}`} />
      </CardActions>
    </BaseCard>
  );
}
