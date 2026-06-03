import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/ui/Button.jsx';
import GoogleSignIn from '../components/auth/GoogleSignIn.jsx';
import { useGoogleAuth } from '../components/auth/GoogleAuthProvider.jsx';
import AuthPageShell, { authInputCls, authLabelCls } from '../components/auth/AuthPageShell.jsx';
import AuthPasswordField from '../components/auth/AuthPasswordField.jsx';

export default function Login() {
  const { enabled: hasGoogle } = useGoogleAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
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
      <div className="min-h-screen flex items-center justify-center bg-[#0f1412]">
        <div className="w-10 h-10 rounded-full border-2 border-forest/30 border-t-forest animate-spin" />
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
      subtitle="Sign in to your Raafortagro farm account."
      heroTitle="Track every order. Farm with confidence."
      heroSubtitle="Premium poultry, livestock, and feed — with your watchlist, orders, and farm details in one place."
      footer={
        <p className="mt-8 text-sm text-center text-white/50">
          New here?{' '}
          <Link to="/register" className="text-beige font-semibold hover:text-white transition-colors">
            Create an account
          </Link>
        </p>
      }
    >
      {error && (
        <p className="mb-4 text-sm text-red-200 bg-red-500/15 border border-red-400/30 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <label className="block">
          <span className={authLabelCls}>Email address</span>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputCls}
          />
        </label>
        <AuthPasswordField
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="cream" className="w-full justify-center mt-2 !rounded-xl" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      {hasGoogle && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-[#0f1412] px-3 text-white/40">or</span>
            </div>
          </div>
          <GoogleSignIn disabled={loading} onSuccess={onAuthSuccess} onError={(msg) => msg && setError(msg)} />
        </>
      )}
    </AuthPageShell>
  );
}
