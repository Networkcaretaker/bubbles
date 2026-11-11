import { Info, Tag } from 'lucide-react';
import type { Service } from '../../types/service_interface';
import { Card as BaseCard, CardAction, CardActions, CardSection, DetailRow } from '../../components/ui/Card';
import { Avatar, Badge } from '../../components/ui/Badge';
import { formatPrice, serviceCategoryLabel } from '../../functions/catalog_functions';

interface CardProps {
  service: Service;
  expanded: boolean;
  onToggle: () => void;
}

export default function Card({ service, expanded, onToggle }: CardProps) {
  return (
    <BaseCard
      title={service.name}
      subtitle={serviceCategoryLabel(service.category)}
      avatar={<Avatar name={service.name} />}
      badge={service.status === 'inactive' ? <Badge tone="muted">Inactive</Badge> : undefined}
      expanded={expanded}
      onToggle={onToggle}
    >
      <CardSection title="Default prices">
        {service.prices.length === 0 && <p className="text-muted-300">No prices yet.</p>}
        {service.prices.map((entry) => (
          <DetailRow key={entry.unit} icon={Tag}>
            {formatPrice(entry.price, entry.unit)}
          </DetailRow>
        ))}
      </CardSection>
      {service.description && <CardSection>{service.description}</CardSection>}
      <CardActions>
        <CardAction icon={Info} label={`Open ${service.name}`} to={`/services/${service.id}`} />
      </CardActions>
    </BaseCard>
  );
}
