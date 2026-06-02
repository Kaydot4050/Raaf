import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function isGoogleAuthEnabled() {
  return !!clientId;
}

export default function GoogleAuthProvider({ children }) {
  if (!clientId) return children;
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
