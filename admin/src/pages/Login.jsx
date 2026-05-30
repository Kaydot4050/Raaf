import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/shadcn-button.jsx';
import { Input } from '@/components/ui/input.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import AdminLogo from '../components/AdminLogo.jsx';
import { SITE_URL } from '../lib/api.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  if (!loading && isAuthenticated && isAdmin) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Glow effects */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% -5%, rgba(139,92,246,0.15), transparent), radial-gradient(ellipse 40% 30% at 80% 100%, rgba(139,92,246,0.08), transparent)',
        }}
      />
      <Card className="relative w-full max-w-md border-border bg-card/80 backdrop-blur-sm">
        <CardHeader className="items-center text-center">
          <AdminLogo className="mb-2 justify-center" imageClassName="size-14" showText={false} />
          <CardTitle className="font-display text-xl lowercase">raafortagro admin</CardTitle>
          <CardDescription>Sign in to manage your website and store.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
            </FieldGroup>
            <Button type="submit" className="mt-6 w-full" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <a href={SITE_URL} className="font-medium text-primary hover:underline">
              ← Back to website
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
