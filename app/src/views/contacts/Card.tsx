import { Building2, IdCard, Mail, MapPin, Phone } from 'lucide-react';
import type { Contact } from '../../types/contact_interface';
import { Card as BaseCard, CardAction, CardActions, CardSection, DetailRow } from '../../components/ui/Card';
import { Avatar, Badge } from '../../components/ui/Badge';
import { WhatsApp } from '../../components/ui/IconSets';
import { contactRoleLabel, whatsappNumber } from '../../functions/client_functions';
import { formatAddress } from '../../functions/shared_functions';

interface CardProps {
  contact: Contact;
  clientName?: string;
  expanded: boolean;
  onToggle: () => void;
}

export default function Card({ contact, clientName, expanded, onToggle }: CardProps) {
  const whatsapp = whatsappNumber(contact.phone);

  return (
    <BaseCard
      title={contact.name}
      subtitle={clientName ?? 'No client'}
      avatar={<Avatar name={contact.name} />}
      badge={contact.role ? <Badge>{contactRoleLabel(contact.role)}</Badge> : undefined}
      expanded={expanded}
      onToggle={onToggle}
    >
      <CardSection>
        {clientName && <DetailRow icon={Building2}>{clientName}</DetailRow>}
        <DetailRow icon={Phone}>{contact.phone || 'No phone number'}</DetailRow>
        <DetailRow icon={Mail}>{contact.email || 'No email'}</DetailRow>
        <DetailRow icon={MapPin}>{formatAddress(contact.address ?? {})}</DetailRow>
      </CardSection>
      <CardActions>
        {contact.phone && <CardAction icon={Phone} label={`Call ${contact.name}`} href={`tel:${contact.phone}`} />}
        {contact.email && <CardAction icon={Mail} label={`Email ${contact.name}`} href={`mailto:${contact.email}`} />}
        {whatsapp && <CardAction icon={WhatsApp} label={`WhatsApp ${contact.name}`} href={`https://wa.me/${whatsapp}`} />}
        <CardAction icon={IdCard} label={`Open ${contact.name}`} to={`/contacts/${contact.id}`} />
      </CardActions>
    </BaseCard>
  );
}
