import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/ui/Button.jsx';
import GoogleSignIn from '../components/auth/GoogleSignIn.jsx';
import { isGoogleAuthEnabled } from '../components/auth/GoogleAuthProvider.jsx';
import AuthPageShell, { authInputCls, authLabelCls } from '../components/auth/AuthPageShell.jsx';
import AuthPasswordField from '../components/auth/AuthPasswordField.jsx';

const hasGoogle = isGoogleAuthEnabled();

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onGoogleSuccess = () => {
    showToast('Account created with Google');
    navigate('/account', { replace: true });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1412]">
        <div className="w-10 h-10 rounded-full border-2 border-forest/30 border-t-forest animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await register({ name: form.name, email: form.email, password: form.password });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    showToast('Account created successfully');
    navigate('/account', { replace: true });
  };

  return (
    <AuthPageShell
      title="Create account"
      subtitle="Register your farm for faster checkout and order history."
      heroTitle="Join farms across Ghana."
      heroSubtitle="Create your account in minutes — shop feed, livestock, and supplies with delivery tracking built in."
      footer={
        <p className="mt-8 text-sm text-center text-white/50">
          Already have an account?{' '}
          <Link to="/login" className="text-beige font-semibold hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
      }
    >
      {error && (
        <p className="mb-4 text-sm text-red-200 bg-red-500/15 border border-red-400/30 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className={authLabelCls}>Full name</span>
          <input type="text" required value={form.name} onChange={set('name')} className={authInputCls} />
        </label>
        <label className="block">
          <span className={authLabelCls}>Email address</span>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={set('email')}
            className={authInputCls}
          />
        </label>
        <AuthPasswordField
          label="Password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          minLength={6}
          value={form.password}
          onChange={set('password')}
        />
        <AuthPasswordField
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={form.confirm}
          onChange={set('confirm')}
        />
        <Button type="submit" variant="cream" className="w-full justify-center mt-2 !rounded-xl" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
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
          <GoogleSignIn
            label="signup_with"
            disabled={loading}
            onSuccess={onGoogleSuccess}
            onError={(msg) => msg && setError(msg)}
          />
        </>
      )}
    </AuthPageShell>
  );
}
