import { query } from '../db.js';

export function rowToCoupon(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    code: row.code,
    description: row.description || '',
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    minOrderAmount: Number(row.min_order_amount || 0),
    maxUses: row.max_uses != null ? Number(row.max_uses) : null,
    usedCount: Number(row.used_count || 0),
    active: !!row.active,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

export function couponFromBody(body) {
  const code = String(body.code || '').trim().toUpperCase();
  const discountType = body.discountType === 'fixed' ? 'fixed' : 'percent';
  const discountValue = Number(body.discountValue);
  return {
    code,
    description: body.description?.trim() || null,
    discount_type: discountType,
    discount_value: discountValue,
    min_order_amount: body.minOrderAmount != null ? Number(body.minOrderAmount) : 0,
    max_uses: body.maxUses != null && body.maxUses !== '' ? Number(body.maxUses) : null,
    active: body.active !== false,
    expires_at: body.expiresAt || null,
  };
}

export function computeDiscountAmount(coupon, orderSubtotal) {
  const total = Number(orderSubtotal) || 0;
  if (total <= 0) return 0;
  let amount =
    coupon.discount_type === 'percent'
      ? (total * Math.min(100, Math.max(0, Number(coupon.discount_value)))) / 100
      : Math.min(total, Math.max(0, Number(coupon.discount_value)));
  return Math.round(amount * 100) / 100;
}

export async function findCouponByCode(code) {
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) return null;
  const result = await query('SELECT * FROM coupons WHERE UPPER(code) = $1', [normalized]);
  return result.rows[0] || null;
}

export function validateCouponRow(coupon, orderSubtotal) {
  if (!coupon) return { ok: false, error: 'Invalid coupon code.' };
  if (!coupon.active) return { ok: false, error: 'This coupon is no longer active.' };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { ok: false, error: 'This coupon has expired.' };
  }
  if (coupon.max_uses != null && Number(coupon.used_count) >= Number(coupon.max_uses)) {
    return { ok: false, error: 'This coupon has reached its usage limit.' };
  }
  const min = Number(coupon.min_order_amount || 0);
  if (orderSubtotal < min) {
    return { ok: false, error: `Minimum order is GH₵ ${min.toLocaleString()} for this coupon.` };
  }
  const discountAmount = computeDiscountAmount(coupon, orderSubtotal);
  if (discountAmount <= 0) {
    return { ok: false, error: 'This coupon does not apply to your order.' };
  }
  return {
    ok: true,
    coupon: rowToCoupon(coupon),
    discountAmount,
    total: Math.round((orderSubtotal - discountAmount) * 100) / 100,
  };
}

export async function validateCouponCode(code, orderSubtotal) {
  const row = await findCouponByCode(code);
  return validateCouponRow(row, orderSubtotal);
}

export async function incrementCouponUse(code, client = null) {
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) return;
  const run = client ? client.query.bind(client) : query;
  await run('UPDATE coupons SET used_count = used_count + 1 WHERE UPPER(code) = $1', [normalized]);
}
