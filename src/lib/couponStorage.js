const KEY = 'raafort-coupon';

export function getStoredCoupon() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredCoupon(coupon) {
  if (!coupon) {
    sessionStorage.removeItem(KEY);
    return;
  }
  sessionStorage.setItem(KEY, JSON.stringify(coupon));
}

export function clearStoredCoupon() {
  sessionStorage.removeItem(KEY);
}
