import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/ui/Button.jsx';
import GoogleSignIn from '../components/auth/GoogleSignIn.jsx';
import PhoneLogin from '../components/auth/PhoneLogin.jsx';
import AuthPageShell from '../components/auth/AuthPageShell.jsx';

const inputCls =
  'mt-1.5 w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/30';
const labelCls = 'block text-xs font-semibold text-charcoal uppercase tracking-wide';

const hasGoogle = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/account';

  const onAuthSuccess = () => {
    showToast('Welcome back!');
    navigate(from, { replace: true });
  };

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-cream">
        <div className="w-10 h-10 rounded-full border-2 border-forest/20 border-t-forest animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onAuthSuccess();
  };

  return (
    <AuthPageShell
      title="Welcome back"
      subtitle="Sign in to your farm account."
      footer={
        <p className="mt-6 text-sm text-center text-text-muted">
          New here?{' '}
          <Link to="/register" className="text-forest font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      {hasGoogle && (
        <>
          <GoogleSignIn disabled={loading} onSuccess={onAuthSuccess} onError={(msg) => msg && setError(msg)} />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-[#f8fafc] px-3 text-text-muted">or</span>
            </div>
          </div>
        </>
      )}

      <div className="flex gap-1 p-1 rounded-full bg-beige-soft border border-border mb-6">
        {[
          { id: 'email', label: 'Email' },
          { id: 'phone', label: 'Phone' },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setMode(id);
              setError('');
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-colors ${
              mode === id ? 'bg-white text-charcoal shadow-sm' : 'text-text-muted hover:text-charcoal'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
      )}

      {mode === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <label className="block">
            <span className={labelCls}>Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </label>
          <Button type="submit" variant="forest" className="w-full justify-center" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      ) : (
        <PhoneLogin onSuccess={onAuthSuccess} onError={(msg) => setError(msg || '')} />
      )}
    </AuthPageShell>
  );
}
