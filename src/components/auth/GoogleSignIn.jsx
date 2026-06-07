import { useEffect, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGoogleAuth } from './GoogleAuthProvider.jsx';

/** Google Identity button max width (API limit). */
const GOOGLE_BTN_WIDTH = 400;

function GoogleGIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function GoogleSignIn({ onSuccess, onError, disabled, label = 'continue_with' }) {
  const { loginWithGoogle } = useAuth();
  const { enabled, loading } = useGoogleAuth();
  const containerRef = useRef(null);
  const [scaleX, setScaleX] = useState(1);

  const labelText = label === 'signup_with' ? 'Sign up with Google' : 'Continue with Google';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const update = () => {
      const w = el.offsetWidth;
      setScaleX(w / GOOGLE_BTN_WIDTH);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleGoogleSuccess = async (response) => {
    const credential = response.credential;
    if (!credential) {
      onError?.('Google sign-in failed.');
      return;
    }
    const result = await loginWithGoogle(credential);
    if (result.ok) onSuccess?.();
    else onError?.(result.error);
  };

  if (loading || !enabled) return null;

  return (
    <div
      ref={containerRef}
      className={`relative h-[46px] w-full min-w-0 ${disabled ? 'pointer-events-none opacity-60' : ''}`}
    >
      {/* Visible full-width button */}
      <div
        className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center gap-2.5 rounded-xl border text-sm font-semibold shadow-sm lg:shadow-sm bg-forest border-forest/20 text-white shadow-md shadow-forest/20 lg:bg-white lg:border-white/20 lg:text-charcoal lg:shadow-sm"
        aria-hidden
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/95 shrink-0">
          <GoogleGIcon />
        </span>
        <span>{labelText}</span>
      </div>

      {/* Invisible Google button stretched to full width */}
      <div className="absolute inset-0 z-20 overflow-hidden rounded-xl">
        <div
          className="h-full origin-left"
          style={{
            width: GOOGLE_BTN_WIDTH,
            transform: `scaleX(${scaleX})`,
          }}
        >
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => onError?.('Google sign-in was cancelled or failed.')}
            theme="outline"
            size="large"
            shape="rectangular"
            text={label}
            width={GOOGLE_BTN_WIDTH}
          />
        </div>
      </div>
    </div>
  );
}
