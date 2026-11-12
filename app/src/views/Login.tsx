import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { auth } from '../services/firebase/config';
import { useAuthStore } from '../stores/authStore';
import { Field, Input } from '../components/ui/Form';
import { Button } from '../components/ui/Button';

// Sign-in problems in plain words
function signInMessage(error: unknown): string {
  const code = error instanceof FirebaseError ? error.code : '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-email':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'That email and password don’t match. Check them and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a few minutes, then try again.';
    case 'auth/user-disabled':
      return 'This account has been turned off. Ask a manager.';
    case 'auth/network-request-failed':
      return 'You seem to be offline. Check your connection and try again.';
    default:
      return 'Couldn’t sign in. Please try again.';
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  // Already signed in: nothing to do here
  if (!loading && user) return <Navigate to="/" replace />;

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setSigningIn(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Sign-in failed:', err);
      setError(signInMessage(err));
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <main className="w-full max-w-md space-y-6 rounded-xl border border-accent-500 bg-gradient-to-t from-brand-900/80 to-brand-500/90 p-6 shadow-lg">
        <header className="space-y-2 pt-4 text-center">
          <img src="/logo.png" alt="" className="mx-auto h-20 w-20" />
          <h1 className="font-bubble text-6xl text-accent-400">BUBBLES</h1>
          <p className="text-sm text-accent-200">Laundry Information Management System</p>
        </header>

        <form onSubmit={handleSignIn} noValidate className="space-y-4">
          <Field label="Email">
            <Input
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(error)}
              autoFocus
            />
          </Field>

          <Field label="Password">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-accent-300 hover:text-accent-100"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          {error && (
            <p role="alert" className="rounded-md border border-danger-500 bg-danger-500/20 px-3 py-2 text-sm text-danger-100">
              {error}
            </p>
          )}

          <Button type="submit" icon={LogIn} loading={signingIn} className="w-full py-3">
            Sign in
          </Button>

          <p className="text-center text-xs text-accent-200">Forgotten your password? Ask a manager to help you.</p>
        </form>

        <footer className="text-center text-xs text-accent-400">&copy; {new Date().getFullYear()} Bubbles LIMS</footer>
      </main>
    </div>
  );
}
