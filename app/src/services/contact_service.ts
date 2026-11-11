import { orderBy } from 'firebase/firestore';
import { createCrudService, listWhere } from './firebase/crud';
import type { Contact } from '../types/contact_interface';

const base = createCrudService<Contact>('contacts', { label: 'contact', sort: [orderBy('name')] });

export const contactService = {
  ...base,

  // Contacts linked to one client, sorted by name
  getForClient: (clientId: string) => listWhere<Contact>('contacts', 'clientId', clientId, "load the client's contacts"),

  // Older names, still used by the template section until it's rebuilt
  getAllContacts: base.getAll,
  getContact: base.getOne,
  addContact: base.create,
  updateContact: base.update,
  deleteContact: base.remove,
};
