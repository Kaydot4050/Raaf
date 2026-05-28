import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/ui/Button.jsx';
import AuthPageShell from '../components/auth/AuthPageShell.jsx';

const inputCls =
  'mt-1.5 w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/30';
const labelCls = 'block text-xs font-semibold text-charcoal uppercase tracking-wide';

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-cream">
        <div className="w-10 h-10 rounded-full border-2 border-forest/20 border-t-forest animate-spin" />
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
      subtitle="Register your farm for faster orders and order history."
      footer={
        <p className="mt-6 text-sm text-center text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-forest font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className={labelCls}>Full name</span>
          <input type="text" required value={form.name} onChange={set('name')} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Email</span>
          <input type="email" required value={form.email} onChange={set('email')} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Password</span>
          <input type="password" required minLength={6} value={form.password} onChange={set('password')} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Confirm password</span>
          <input type="password" required value={form.confirm} onChange={set('confirm')} className={inputCls} />
        </label>
        <Button type="submit" variant="forest" className="w-full justify-center" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthPageShell>
  );
}
