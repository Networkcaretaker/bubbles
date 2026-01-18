import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // AuthProvider will detect the change and update state
      // We just need to navigate to the dashboard
      navigate('/');
    } catch (err: unknown) {
      console.error(err);
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gradient-to-t from-blue-900/80 to-blue-500/90 rounded-xl shadow-lg p-6 space-y-6">
        
        {/* Header / Logo */}
        <div className="text-center py-6 space-y-2">
          <div className="mx-auto h-20 w-20 flex items-center">
            <img src="/logo.png" />
          </div>
          <h2 className="text-6xl text-cyan-400 font-bubble">BUBBLES</h2>
          <p className="text-sm text-cyan-200">
            Laundry Information Management System
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="pb-6 space-y-6">
          <div>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm placeholder-cyan-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-cyan-300 rounded-md shadow-sm placeholder-cyan-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 bg-cyan-500 border border-transparent text-white font-medium py-3 px-4 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningIn ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="h-5 w-5" />
              )}
              Sign in
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-cyan-400 mt-6">
          &copy; {new Date().getFullYear()} Bubbles LIMS
        </div>
      </div>
    </div>
  );
}