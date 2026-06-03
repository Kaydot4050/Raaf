import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { authApi } from '../../lib/api.js';

const GoogleAuthContext = createContext({
  clientId: '',
  enabled: false,
  loading: true,
});

export function useGoogleAuth() {
  return useContext(GoogleAuthContext);
}

/** Build-time check only — prefer useGoogleAuth() in components. */
export function isGoogleAuthEnabled() {
  return !!import.meta.env.VITE_GOOGLE_CLIENT_ID;
}

export default function GoogleAuthProvider({ children }) {
  const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const [clientId, setClientId] = useState(envClientId);
  const [loading, setLoading] = useState(!envClientId);

  useEffect(() => {
    if (envClientId) return;

    let cancelled = false;
    authApi
      .googleConfig()
      .then((data) => {
        if (!cancelled && data?.clientId) setClientId(data.clientId);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [envClientId]);

  const value = useMemo(
    () => ({
      clientId,
      enabled: !!clientId,
      loading: envClientId ? false : loading,
    }),
    [clientId, envClientId, loading],
  );

  if (!value.enabled) {
    return <GoogleAuthContext.Provider value={value}>{children}</GoogleAuthContext.Provider>;
  }

  return (
    <GoogleAuthContext.Provider value={value}>
      <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
    </GoogleAuthContext.Provider>
  );
}
