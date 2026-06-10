import { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import { couponsApi } from '../lib/api.js';
import { clearStoredCoupon, getStoredCoupon, setStoredCoupon } from '../lib/couponStorage.js';
import { formatPrice } from '../data/products.js';

export default function CouponField({ subtotal, onChange }) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const applyResult = (result) => {
    setApplied(result);
    setStoredCoupon(result);
    onChange?.(result);
  };

  const clearResult = (message = '') => {
    setApplied(null);
    clearStoredCoupon();
    onChange?.(null);
    if (message) setError(message);
  };

  useEffect(() => {
    const stored = getStoredCoupon();
    if (!stored?.code) return;
    setCode(stored.code);
    setLoading(true);
    couponsApi
      .validate(stored.code, subtotal)
      .then((result) => applyResult({ ...result, code: result.code || stored.code }))
      .catch((err) => clearResult(err.message || 'Coupon no longer valid.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!applied?.code) return;
    let cancelled = false;
    couponsApi
      .validate(applied.code, subtotal)
      .then((result) => {
        if (!cancelled) applyResult({ ...result, code: result.code || applied.code });
      })
      .catch((err) => {
        if (!cancelled) clearResult(err.message || 'Coupon no longer valid for this order.');
      });
    return () => {
      cancelled = true;
    };
  }, [subtotal]);

  const apply = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    try {
      const result = await couponsApi.validate(trimmed, subtotal);
      applyResult({ ...result, code: result.code || trimmed.toUpperCase() });
    } catch (err) {
      clearResult(err.message || 'Could not apply coupon.');
    } finally {
      setLoading(false);
    }
  };

  const remove = () => {
    setCode('');
    setError('');
    clearResult();
  };

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-forest" />
        <p className="text-sm font-semibold text-charcoal">Coupon code</p>
      </div>
      {applied ? (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-forest/5 border border-forest/15 px-3 py-2">
          <div>
            <p className="text-sm font-semibold text-charcoal">{applied.code}</p>
            <p className="text-xs text-forest">−{formatPrice(applied.discountAmount)} applied</p>
          </div>
          <button type="button" onClick={remove} className="text-xs font-semibold text-text-muted hover:text-charcoal">
            Remove
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="flex-1 px-3 py-2.5 rounded-xl border border-border text-sm uppercase focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
          <button
            type="button"
            onClick={apply}
            disabled={loading || !code.trim()}
            className="px-4 py-2.5 rounded-xl bg-charcoal text-white text-sm font-semibold disabled:opacity-50"
          >
            {loading ? '…' : 'Apply'}
          </button>
        </div>
      )}
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
