import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { SITE_URL } from '../lib/api.js';

const inputCls =
  'mt-1.5 w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/30';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  if (!loading && isAuthenticated && isAdmin) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-charcoal">Raafort Admin</h1>
        <p className="text-sm text-text-muted mt-1 mb-6">Sign in with your admin account.</p>
        {error && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-semibold uppercase text-charcoal">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </label>
          <label className="block text-xs font-semibold uppercase text-charcoal">
            Password
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full bg-forest text-white text-sm font-semibold hover:bg-forest-light disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-text-muted">
          <a href={SITE_URL} className="text-forest font-semibold hover:underline">
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
