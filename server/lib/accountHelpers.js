const DEFAULT_SETTINGS = {
  orderUpdates: true,
  promotions: true,
  farmTips: false,
  smsAlerts: false,
  showWeather: true,
};

export function splitName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
}

export function joinName(firstName, lastName) {
  const full = [firstName, lastName].filter(Boolean).join(' ').trim();
  return full || 'User';
}

export function parseNotificationSettings(raw) {
  const base = { ...DEFAULT_SETTINGS };
  if (!raw || typeof raw !== 'object') return base;
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (typeof raw[key] === 'boolean') base[key] = raw[key];
  }
  return base;
}

export function rowToAddress(row) {
  return {
    id: String(row.id),
    label: row.label || 'Farm',
    name: row.contact_name,
    phone: row.phone,
    region: row.region,
    address: row.address,
    isDefault: !!row.is_default,
  };
}

export async function fetchUserAccountRow(userId, query) {
  const result = await query(
    `SELECT id, email, name, phone, farm_name, role, created_at, password_hash,
            farm_type, farm_region, flock_size, farm_notes, notification_settings
     FROM users WHERE id = $1`,
    [userId],
  );
  return result.rows[0] || null;
}

export async function buildAccountPayload(userId, query) {
  const row = await fetchUserAccountRow(userId, query);
  if (!row) return null;

  const [addressesResult, wishlistResult] = await Promise.all([
    query(
      `SELECT id, label, contact_name, phone, region, address, is_default
       FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC, id ASC`,
      [userId],
    ),
    query('SELECT product_id FROM user_wishlist WHERE user_id = $1 ORDER BY created_at DESC', [userId]),
  ]);

  const { firstName, lastName } = splitName(row.name);

  return {
    profile: {
      firstName,
      lastName,
      email: row.email,
      phone: row.phone || '',
      farmName: row.farm_name || '',
    },
    farm: {
      farmType: row.farm_type || '',
      region: row.farm_region || '',
      flockSize: row.flock_size || '',
      notes: row.farm_notes || '',
    },
    addresses: addressesResult.rows.map(rowToAddress),
    wishlist: wishlistResult.rows.map((r) => r.product_id),
    settings: parseNotificationSettings(row.notification_settings),
    hasPassword: Boolean(row.password_hash),
  };
}
