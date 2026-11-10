import { useState } from 'react';
import { Search, UserCog, UserPlus } from 'lucide-react';
import { Page } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { Panel } from '../../components/ui/Card';
import { DataList } from '../../components/ui/DataList';
import { EmptyState } from '../../components/ui/States';
import { Field, FieldRow, Input, Select } from '../../components/ui/Form';
import { matchesSearch } from '../../lib/search';
import { ROLE_OPTIONS, permissionsFor } from '../../functions/user_functions';
import { useCurrentUser, userHooks } from '../../hooks/userHooks';
import { toast } from '../../stores/toastStore';
import Card from './Card';
import Form from './Form';
import type { UserFormValues } from './Form';

export default function Main() {
  const users = userHooks.useList();
  const addUser = userHooks.useAddUser();
  const { data: me } = useCurrentUser();
  const permissions = me ? permissionsFor(me) : null;

  const [adding, setAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFilter = () => {
    // Closing the filter also clears it, so nothing stays hidden by accident
    if (showFilter) {
      setSearch('');
      setRole('');
    }
    setShowFilter(!showFilter);
  };

  const toggleCard = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleAdd = async (values: UserFormValues) => {
    try {
      await addUser.mutateAsync(values);
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(`${values.name} added. They can now sign in with their email and password.`);
    setAdding(false);
  };

  return (
    <Page
      title="Users"
      icon={UserCog}
      actions={
        <>
          {permissions?.canCreateUsers && (
            <IconButton icon={UserPlus} label="Add user" active={adding} onClick={() => setAdding(!adding)} />
          )}
          <IconButton icon={Search} label="Search and filter" active={showFilter} onClick={toggleFilter} />
        </>
      }
    >
      {adding && (
        <Panel>
          <div className="space-y-3">
            <p className="text-lg font-bold text-white">New user</p>
            <Form mode="create" onSubmit={handleAdd} onCancel={() => setAdding(false)} submitting={addUser.isPending} />
          </div>
        </Panel>
      )}

      {showFilter && (
        <Panel>
          <FieldRow>
            <Field label="Search">
              <Input
                type="search"
                placeholder="Name, email or phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </Field>
            <Field label="Role">
              <Select placeholder="All roles" options={ROLE_OPTIONS} value={role} onChange={(e) => setRole(e.target.value)} />
            </Field>
          </FieldRow>
        </Panel>
      )}

      <DataList
        query={users}
        getKey={(user) => user.id}
        filter={(user) => matchesSearch(search, user.name, user.email, user.phone) && (!role || user.role === role)}
        empty={<EmptyState icon={UserCog} title="No users yet" />}
        noMatchMessage="No users match your search."
        renderItem={(user) => (
          <Card
            user={user}
            isMe={user.id === me?.id}
            expanded={expandedId === user.id}
            onToggle={() => toggleCard(user.id)}
          />
        )}
      />
    </Page>
  );
}
