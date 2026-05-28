import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../ui/Button.jsx';

const inputCls =
  'mt-1.5 w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/30';
const labelCls = 'block text-xs font-semibold text-charcoal uppercase tracking-wide';

export default function PhoneLogin({ onSuccess, onError }) {
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [needsName, setNeedsName] = useState(false);
  const [devCode, setDevCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDevCode('');
    const result = await sendPhoneOtp(phone);
    setLoading(false);
    if (!result.ok) {
      onError?.(result.error);
      return;
    }
    if (result.devCode) setDevCode(result.devCode);
    setStep('code');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await verifyPhoneOtp({
      phone,
      code,
      name: needsName ? name : undefined,
    });
    setLoading(false);
    if (!result.ok) {
      if (result.needsName) {
        setNeedsName(true);
        onError?.(null);
        return;
      }
      onError?.(result.error);
      return;
    }
    onSuccess?.();
  };

  if (step === 'phone') {
    return (
      <form onSubmit={handleSend} className="space-y-4">
        <label className="block">
          <span className={labelCls}>Phone number</span>
          <input
            type="tel"
            required
            autoComplete="tel"
            placeholder="024 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls}
          />
          <span className="mt-1 block text-xs text-text-muted">Ghana numbers — we&apos;ll text you a 6-digit code.</span>
        </label>
        <Button type="submit" variant="forest" className="w-full justify-center" disabled={loading}>
          {loading ? 'Sending…' : 'Send code'}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      {devCode && (
        <p className="text-sm bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-2">
          Dev code: <strong className="font-mono">{devCode}</strong>
        </p>
      )}
      <p className="text-sm text-text-muted">
        Code sent to <span className="font-medium text-charcoal">{phone}</span>
        {' · '}
        <button type="button" className="text-forest font-semibold hover:underline" onClick={() => setStep('phone')}>
          Change
        </button>
      </p>
      {needsName && (
        <label className="block">
          <span className={labelCls}>Your name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            placeholder="Full name"
          />
        </label>
      )}
      <label className="block">
        <span className={labelCls}>Verification code</span>
        <input
          type="text"
          inputMode="numeric"
          required
          maxLength={6}
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className={inputCls}
          placeholder="123456"
        />
      </label>
      <Button type="submit" variant="forest" className="w-full justify-center" disabled={loading}>
        {loading ? 'Verifying…' : 'Verify & sign in'}
      </Button>
    </form>
  );
}
