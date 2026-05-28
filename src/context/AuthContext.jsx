import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { authApi } from '../lib/api.js';

const STORAGE_KEY = 'raafort-user';

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    authApi
      .me()
      .then(({ user: u }) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { user: u } = await authApi.login({ email, password });
      setUser(u);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, []);

  const register = useCallback(async ({ name, email, password, phone, farmName }) => {
    try {
      const { user: u } = await authApi.register({ name, email, password, phone, farmName });
      setUser(u);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    try {
      const { user: u } = await authApi.google(credential);
      setUser(u);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, []);

  const sendPhoneOtp = useCallback(async (phone) => {
    try {
      const data = await authApi.phoneSend(phone);
      return { ok: true, devCode: data.devCode, message: data.message };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, []);

  const verifyPhoneOtp = useCallback(async ({ phone, code, name }) => {
    try {
      const { user: u } = await authApi.phoneVerify({ phone, code, name });
      setUser(u);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message, needsName: e.data?.needsName };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      loading,
      login,
      register,
      loginWithGoogle,
      sendPhoneOtp,
      verifyPhoneOtp,
      logout,
    }),
    [user, loading, login, register, loginWithGoogle, sendPhoneOtp, verifyPhoneOtp, logout, user?.role],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
