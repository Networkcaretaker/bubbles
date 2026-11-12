import { FileStack, FileText, Layers, Receipt } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { orderBy } from 'firebase/firestore';
import { createCrudService } from '../../services/firebase/crud';
import { createCrudHooks } from '../../hooks/createCrudHooks';
import type { SimpleDoc } from '../../types/simple_interface';

export interface SimpleSectionConfig {
  title: string; // "Batches"
  singular: string; // "batch"
  path: string; // "/batches" – list at /batches, pages at /batches/:id
  icon: LucideIcon;
  hooks: ReturnType<typeof createCrudHooks<SimpleDoc>>;
}

// One line per section: collection name, labels, route and icon
function simpleSection(collection: string, title: string, singular: string, icon: LucideIcon): SimpleSectionConfig {
  const service = createCrudService<SimpleDoc>(collection, { label: singular, labelPlural: title.toLowerCase(), sort: [orderBy('name')] });
  return { title, singular, path: `/${collection}`, icon, hooks: createCrudHooks(collection, service) };
}

export const batchesSection = simpleSection('batches', 'Batches', 'batch', Layers);
export const quotesSection = simpleSection('quotes', 'Quotes', 'quote', FileText);
export const invoicesSection = simpleSection('invoices', 'Invoices', 'invoice', Receipt);
export const templatesSection = simpleSection('templates', 'Templates', 'template', FileStack);
