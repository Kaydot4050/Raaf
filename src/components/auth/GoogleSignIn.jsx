import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext.jsx';

export default function GoogleSignIn({ onSuccess, onError, disabled }) {
  const { loginWithGoogle } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) return null;

  return (
    <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
      <GoogleLogin
        onSuccess={async (response) => {
          const credential = response.credential;
          if (!credential) {
            onError?.('Google sign-in failed.');
            return;
          }
          const result = await loginWithGoogle(credential);
          if (result.ok) onSuccess?.();
          else onError?.(result.error);
        }}
        onError={() => onError?.('Google sign-in was cancelled or failed.')}
        theme="outline"
        size="large"
        shape="pill"
        text="continue_with"
        width="100%"
      />
    </div>
  );
}
