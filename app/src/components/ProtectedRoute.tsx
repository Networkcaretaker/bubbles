import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { LogOut, UserX } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCurrentUser } from '../hooks/userHooks';
import { authService } from '../services/auth_service';
import { errorCode } from '../services/firebase/crud';
import { Button } from './ui/Button';
import { ErrorState, Spinner } from './ui/States';

function FullScreen({ children }: { children: ReactNode }) {
  return <div className="flex h-dvh items-center justify-center p-4">{children}</div>;
}

// Signed in, but there's no user record for this login (e.g. made in the Firebase console)
function AccountNotSetUp({ email }: { email?: string | null }) {
  return (
    <FullScreen>
      <div className="w-full max-w-md space-y-4 rounded-xl border border-accent-500 bg-gradient-to-t from-brand-900/80 to-brand-500/90 p-6 text-center">
        <UserX className="mx-auto h-10 w-10 text-accent-300" />
        <h1 className="text-xl font-bold text-white">Your account isn’t set up</h1>
        <p className="text-sm text-accent-100">
          {email ? (
            <>
              You signed in as <span className="font-bold">{email}</span>, but there’s no Bubbles user for this login.
            </>
          ) : (
            'There’s no Bubbles user for this login.'
          )}{' '}
          Ask an owner or manager to add you under Setup → Users.
        </p>
        <Button icon={LogOut} onClick={authService.signOut} className="w-full">
          Sign out
        </Button>
      </div>
    </FullScreen>
  );
}

// Only lets people in who are signed in AND have a user record
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthStore();
  const record = useCurrentUser();

  if (loading || (user && record.isLoading)) {
    return (
      <FullScreen>
        <Spinner className="h-12 w-12" />
      </FullScreen>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (record.error || !record.data) {
    const code = errorCode(record.error);
    // No record: reading it is refused by the rules, or it's simply not there
    if (!record.error || code === 'permission-denied' || code === 'not-found') {
      return <AccountNotSetUp email={user.email} />;
    }
    // Anything else (e.g. offline): let them try again
    return (
      <FullScreen>
        <div className="w-full max-w-md space-y-2">
          <ErrorState message={record.error.message} onRetry={() => record.refetch()} />
          <Button variant="secondary" icon={LogOut} onClick={authService.signOut} className="w-full">
            Sign out
          </Button>
        </div>
      </FullScreen>
    );
  }

  return <>{children}</>;
}
