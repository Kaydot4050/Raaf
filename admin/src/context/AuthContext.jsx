import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { authApi } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then(({ user: u }) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { user: profile } = await authApi.login({ email, password });
      if (!profile) {
        return {
          ok: false,
          error: 'Invalid server response. Stop the API and run: npm run dev:server',
        };
      }
      setUser(profile);
      return { ok: true };
    } catch (e) {
      if (e.status === 403) {
        return { ok: false, error: e.message };
      }
      return { ok: false, error: e.message };
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      loading,
      login,
      logout,
    }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
