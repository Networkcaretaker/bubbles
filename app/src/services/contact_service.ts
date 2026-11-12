import { orderBy } from 'firebase/firestore';
import { createCrudService, listWhere } from './firebase/crud';
import type { Contact } from '../types/contact_interface';

const base = createCrudService<Contact>('contacts', { label: 'contact', sort: [orderBy('name')] });

export const contactService = {
  ...base,

  // Contacts linked to one client, sorted by name
  getForClient: (clientId: string) => listWhere<Contact>('contacts', 'clientId', clientId, "load the client's contacts"),
};
