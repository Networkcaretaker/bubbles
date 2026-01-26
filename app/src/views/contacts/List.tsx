import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { contactService } from '../../services/contact_service';
import type { Contact } from '../../types/contact_interface';
import Card from './Card';
import Form from './Form';
import { Theme } from '../../components/ui/Theme';

export default function List() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  const handleAddContact = async (contactData: Omit<Contact, 'id'>) => {
    try {
      setError(null);
      await contactService.addContact(contactData);
      await loadContacts();
      setShowAddForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add contact';
      setError(message);
    }
  };

  const handleUpdateContact = async (id: string, contactData: Partial<Omit<Contact, 'id'>>) => {
    try {
      setError(null);
      const updateData = {
        ...contactData,
        timestamp: {
          updatedAt: new Date().toISOString(),
        }
      };
      await contactService.updateContact(id, updateData);
      await loadContacts();
      setEditingContact(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update contact';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className={`${Theme.system.notice}`}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className={`${Theme.system.error}`}>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {!showAddForm &&
        <div className="flex mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`${Theme.button.outline}`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Contact</span> 
          </button>
        </div>
      }

      {showAddForm && (
        <div className="mb-6 p-4 rounded-lg border border-cyan-500 bg-gradient-to-r from-blue-900/80 to-blue-500/90">
          <div className="flex gap-2 items-center mb-4">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-cyan-200 text-cyan-600">
              <span className="font-light text-2xl">
                N
              </span>
            </div>
            <div>
              <h3 className="text-xl font-medium text-cyan-500">New Contact</h3>
            </div>
          </div>
          <Form
            onSubmit={handleAddContact}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {contacts.length === 0 ? (
        <p className={`${Theme.system.notice}`}>No contacts found. Add your first contact to get started.</p>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <Card
              key={contact.id}
              contact={contact}
              isViewing={viewingContact?.id === contact.id}
              onView={() => setViewingContact(contact)}
              onCancelView={() => setViewingContact(null)}
              isEditing={editingContact?.id === contact.id}
              onEdit={() => setEditingContact(contact)}
              onUpdate={(contactData) => handleUpdateContact(contact.id, contactData)}
              onCancelEdit={() => setEditingContact(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}