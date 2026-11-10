import { IdCard, Mail, Phone } from 'lucide-react';
import type { AppUser } from '../../types/user_interface';
import { Card as BaseCard, CardAction, CardActions, CardSection, DetailRow } from '../../components/ui/Card';
import { Avatar, Badge } from '../../components/ui/Badge';
import { WhatsApp } from '../../components/ui/IconSets';
import { ROLE_TONES, roleLabel } from '../../functions/user_functions';

interface CardProps {
  user: AppUser;
  isMe: boolean;
  expanded: boolean;
  onToggle: () => void;
}

export default function Card({ user, isMe, expanded, onToggle }: CardProps) {
  const whatsappNumber = user.phone?.replace(/\D/g, '');

  return (
    <BaseCard
      title={isMe ? `${user.name} (you)` : user.name}
      subtitle={user.email}
      avatar={<Avatar name={user.name} />}
      badge={<Badge tone={ROLE_TONES[user.role]}>{roleLabel(user.role)}</Badge>}
      expanded={expanded}
      onToggle={onToggle}
    >
      <CardSection>
        <DetailRow icon={Phone}>{user.phone || 'No phone number'}</DetailRow>
        <DetailRow icon={Mail}>{user.email}</DetailRow>
      </CardSection>
      <CardActions>
        {user.phone && <CardAction icon={Phone} label={`Call ${user.name}`} href={`tel:${user.phone}`} />}
        <CardAction icon={Mail} label={`Email ${user.name}`} href={`mailto:${user.email}`} />
        {whatsappNumber && (
          <CardAction icon={WhatsApp} label={`WhatsApp ${user.name}`} href={`https://wa.me/${whatsappNumber}`} />
        )}
        <CardAction icon={IdCard} label={`View ${user.name}'s profile`} to={`/users/${user.id}`} />
      </CardActions>
    </BaseCard>
  );
}
