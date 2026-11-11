import { collection, doc, getDocs, orderBy, query, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase/config';
import { createCrudService, friendlyError } from './firebase/crud';
import type { Client } from '../types/client_interface';

const base = createCrudService<Client>('clients', { label: 'client', sort: [orderBy('name')] });

export const clientService = {
  ...base,

  // Deletes the client and its Client Jobs, and unlinks its contacts (contacts are kept). All in one go.
  async remove(id: string): Promise<void> {
    try {
      const [contacts, clientJobs] = await Promise.all([
        getDocs(query(collection(db, 'contacts'), where('clientId', '==', id))),
        getDocs(query(collection(db, 'client-jobs'), where('clientId', '==', id))),
      ]);
      const batch = writeBatch(db);
      contacts.docs.forEach((contact) => batch.update(contact.ref, { clientId: null, role: null }));
      clientJobs.docs.forEach((job) => batch.delete(job.ref));
      batch.delete(doc(db, 'clients', id));
      await batch.commit();
    } catch (error) {
      throw friendlyError('delete client', error);
    }
  },

  // Older names, still used by the Jobs section until it's rebuilt
  getAllClients: base.getAll,
  getClient: base.getOne,
};
