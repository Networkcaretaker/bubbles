import { useState, useEffect } from 'react';
import { contactService } from '../../services/contact_service';
import type { Contact } from '../../types/contact_interface';
import Card from './Card';
import { Theme } from '../../components/ui/Theme';

export default function List() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedContacts = await contactService.getAllContacts();
      setContacts(fetchedContacts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load contacts';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${Theme.content.layout}`}>
        <p className={`${Theme.system.notice}`}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${Theme.content.layout}`}>
        <p className={`${Theme.system.error}`}>{error}</p>
      </div>
    );
  }

  return (
    <div className={`${Theme.content.layout}`}>
      {contacts.length === 0 ? (
        <p className={`${Theme.system.notice}`}>No contacts found. Add your first contact to get started.</p>
      ) : (
        <div className={`${Theme.content.list}`}>
          {contacts.map((contact) => (
            <Card
              key={contact.id}
              contact={contact}
              isViewing={viewingContact?.id === contact.id}
              onView={() => setViewingContact(contact)}
              onCancelView={() => setViewingContact(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}