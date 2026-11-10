import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarClock, Mail, Pencil, Phone, ShieldCheck, Trash2, UserCog, X } from 'lucide-react';
import { Page as BasePage } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { CardAction, CardActions, CardSection, DetailRow, Panel } from '../../components/ui/Card';
import { Avatar, Badge } from '../../components/ui/Badge';
import { ErrorState, LoadingState } from '../../components/ui/States';
import { WhatsApp } from '../../components/ui/IconSets';
import { ROLE_TONES, permissionsFor, roleLabel } from '../../functions/user_functions';
import { formatDate } from '../../functions/shared_functions';
import { useCurrentUser, userHooks } from '../../hooks/userHooks';
import { toast } from '../../stores/toastStore';
import { confirmDialog } from '../../stores/confirmStore';
import Form from './Form';
import type { UserFormValues } from './Form';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userQuery = userHooks.useOne(id);
  const { data: me } = useCurrentUser();
  const updateUser = userHooks.useUpdate();
  const removeUser = userHooks.useRemove();
  const [editing, setEditing] = useState(false);

  const user = userQuery.data;
  const isMe = Boolean(me && user && me.id === user.id);
  const permissions = me ? permissionsFor(me) : null;
  const canSeeAllUsers = permissions?.canViewUsers ?? false;
  const canEdit = isMe || (permissions?.canEditUsers ?? false);
  const canDelete = !isMe && (permissions?.canDeleteUsers ?? false);

  const backButton = canSeeAllUsers && (
    <IconButton icon={ArrowLeft} label="Back to users" onClick={() => navigate('/users')} />
  );

  // Loading, missing, or someone else's page without permission to see users
  if (userQuery.isLoading || (!me && !userQuery.error)) {
    return (
      <BasePage title="User" icon={UserCog}>
        <LoadingState />
      </BasePage>
    );
  }
  if (userQuery.error || !user) {
    return (
      <BasePage title="User" icon={UserCog} actions={backButton}>
        <ErrorState message={userQuery.error?.message ?? 'User not found.'} onRetry={() => userQuery.refetch()} />
      </BasePage>
    );
  }
  if (!isMe && !canSeeAllUsers) {
    return (
      <BasePage title="User" icon={UserCog}>
        <ErrorState message="You don't have permission to see other users." />
      </BasePage>
    );
  }

  const handleSave = async ({ name, email, phone, role }: UserFormValues) => {
    try {
      await updateUser.mutateAsync({ id: user.id, changes: { name, email, phone, role } });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(isMe ? 'Your profile has been saved' : `${name} saved`);
    setEditing(false);
  };

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: `Delete ${user.name}?`,
      message: 'Their login will be removed and they won’t be able to sign in. This can’t be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await removeUser.mutateAsync(user.id);
    } catch {
      return;
    }
    toast.success(`${user.name} deleted`);
    navigate('/users');
  };

  const whatsappNumber = user.phone?.replace(/\D/g, '');

  return (
    <BasePage
      title={isMe ? 'My Profile' : user.name}
      icon={UserCog}
      actions={
        <>
          {canEdit && (
            <IconButton
              icon={editing ? X : Pencil}
              label={editing ? 'Stop editing' : 'Edit'}
              active={editing}
              onClick={() => setEditing(!editing)}
            />
          )}
          {canDelete && (
            <IconButton icon={Trash2} label="Delete user" onClick={handleDelete} disabled={removeUser.isPending} />
          )}
          {backButton}
        </>
      }
    >
      {/* Profile */}
      <Panel>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Avatar name={user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-white">{user.name}</p>
              <p className="truncate text-xs font-medium text-accent-300">{user.email}</p>
            </div>
            <Badge tone={ROLE_TONES[user.role]}>{roleLabel(user.role)}</Badge>
          </div>
          {!isMe && (
            <CardActions>
              {user.phone && <CardAction icon={Phone} label={`Call ${user.name}`} href={`tel:${user.phone}`} />}
              <CardAction icon={Mail} label={`Email ${user.name}`} href={`mailto:${user.email}`} />
              {whatsappNumber && (
                <CardAction icon={WhatsApp} label={`WhatsApp ${user.name}`} href={`https://wa.me/${whatsappNumber}`} />
              )}
            </CardActions>
          )}
        </div>
      </Panel>

      {editing ? (
        <Panel>
          <Form
            mode="edit"
            initial={user}
            onSubmit={handleSave}
            onCancel={() => setEditing(false)}
            submitting={updateUser.isPending}
            roleLocked={isMe}
            emailLocked={isMe && !permissions?.canEditUsers}
          />
        </Panel>
      ) : (
        <>
          <Panel>
            <CardSection title="Details">
              <DetailRow icon={Mail}>{user.email}</DetailRow>
              <DetailRow icon={Phone}>{user.phone || 'No phone number'}</DetailRow>
              <DetailRow icon={ShieldCheck}>{roleLabel(user.role)}</DetailRow>
            </CardSection>
          </Panel>

          <Panel>
            <CardSection title="Account">
              <DetailRow icon={CalendarClock}>Added {formatDate(user.timestamp?.createdAt)}</DetailRow>
              <DetailRow icon={CalendarClock}>Last updated {formatDate(user.timestamp?.updatedAt)}</DetailRow>
            </CardSection>
          </Panel>
        </>
      )}
    </BasePage>
  );
}
