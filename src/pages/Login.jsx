import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/ui/Button.jsx';
import GoogleSignIn from '../components/auth/GoogleSignIn.jsx';
import { useGoogleAuth } from '../components/auth/GoogleAuthProvider.jsx';
import AuthPageShell, {
  authInputCls,
  authLabelCls,
  authErrorCls,
  authFooterTextCls,
  authFooterLinkCls,
  authDividerLineCls,
  authDividerOrCls,
} from '../components/auth/AuthPageShell.jsx';
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

  const onAuthSuccess = () => {
    showToast('Welcome back!');
    navigate('/', { replace: true });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-16 bg-cream lg:min-h-screen lg:bg-[#0f1412]">
        <div className="w-10 h-10 rounded-full border-2 border-forest/30 border-t-forest animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
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
      subtitle="Sign in to your Raafortagro account."
      heroTitle="Orders, tracking, and farm details in one account."
      heroSubtitle="Check deliveries, reorder stock, and update your farm profile."
      footer={
        <p className={authFooterTextCls}>
          New here?{' '}
          <Link to="/register" className={authFooterLinkCls}>
            Create an account
          </Link>
        </p>
      }
    >
      {error && (
        <p className={authErrorCls}>{error}</p>
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
        <Button
          type="submit"
          variant="forest"
          className="w-full justify-center mt-2 !rounded-xl lg:!bg-cream lg:!text-charcoal lg:hover:!bg-cream-dark lg:!border-beige-dark/50 lg:border lg:shadow-md"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      {hasGoogle && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={authDividerLineCls} />
            </div>
            <div className="relative flex justify-center">
              <span className={authDividerOrCls}>or</span>
            </div>
          </div>
          <GoogleSignIn disabled={loading} onSuccess={onAuthSuccess} onError={(msg) => msg && setError(msg)} />
        </>
      )}
    </AuthPageShell>
  );
}
