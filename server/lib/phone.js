/** Normalize to E.164-ish digits with leading + (Ghana-focused defaults). */
export function normalizePhone(raw) {
  let digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return null;

  if (digits.startsWith('233')) {
    digits = digits.slice(3);
  }
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length === 9 && /^[235]\d{8}$/.test(digits)) {
    return `+233${digits}`;
  }
  if (digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }
  return null;
}

export function phonePlaceholderEmail(phone) {
  const slug = phone.replace(/\D/g, '');
  return `phone_${slug}@phone.raafortagro.local`;
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
