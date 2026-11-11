import { Info, Ruler, Tag } from 'lucide-react';
import type { CatalogItem } from '../../types/item_interface';
import type { Service } from '../../types/service_interface';
import { Card as BaseCard, CardAction, CardActions, CardSection, DetailRow } from '../../components/ui/Card';
import { Avatar, Badge } from '../../components/ui/Badge';
import { itemCategoryLabel, itemSizeLabel, pricingUnitLabel } from '../../functions/catalog_functions';

interface CardProps {
  item: CatalogItem;
  services: Map<string, Service>;
  expanded: boolean;
  onToggle: () => void;
}

export default function Card({ item, services, expanded, onToggle }: CardProps) {
  const sizes = item.sizes ?? [];
  const prices = item.prices ?? [];

  return (
    <BaseCard
      title={item.name}
      subtitle={itemCategoryLabel(item.category)}
      avatar={<Avatar name={item.name} />}
      badge={item.status === 'inactive' ? <Badge tone="muted">Inactive</Badge> : undefined}
      expanded={expanded}
      onToggle={onToggle}
    >
      <CardSection>
        <DetailRow icon={Ruler}>{sizes.length ? sizes.map(itemSizeLabel).join(', ') : 'No sizes'}</DetailRow>
      </CardSection>
      <CardSection title="Services">
        {prices.length === 0 && <p className="text-muted-300">No prices yet.</p>}
        {prices.map((entry) => (
          <DetailRow key={`${entry.serviceId}-${entry.unit}`} icon={Tag}>
            {services.get(entry.serviceId)?.name ?? 'Deleted service'} · {pricingUnitLabel(entry.unit).toLowerCase()}
          </DetailRow>
        ))}
      </CardSection>
      <CardActions>
        <CardAction icon={Info} label={`Open ${item.name}`} to={`/items/${item.id}`} />
      </CardActions>
    </BaseCard>
  );
}
