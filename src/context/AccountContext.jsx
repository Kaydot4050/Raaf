import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const STORAGE_KEY = 'raafort-account';

const defaultState = {
  profile: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    farmName: '',
  },
  farm: {
    farmType: '',
    region: '',
    flockSize: '',
    notes: '',
  },
  addresses: [],
  wishlist: [],
  settings: {
    orderUpdates: true,
    promotions: true,
    farmTips: false,
    smsAlerts: false,
  },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setProfile = (patch) =>
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));

  const setFarm = (patch) =>
    setState((s) => ({ ...s, farm: { ...s.farm, ...patch } }));

  const setSettings = (patch) =>
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));

  const addAddress = (address) => {
    const id = `addr-${Date.now()}`;
    setState((s) => {
      const isFirst = s.addresses.length === 0;
      return {
        ...s,
        addresses: [
          ...s.addresses,
          { ...address, id, isDefault: isFirst || Boolean(address.isDefault) },
        ].map((a) =>
          address.isDefault && a.id !== id ? { ...a, isDefault: false } : a,
        ),
      };
    });
  };

  const updateAddress = (id, patch) => {
    setState((s) => ({
      ...s,
      addresses: s.addresses.map((a) => {
        if (a.id !== id) {
          return patch.isDefault ? { ...a, isDefault: false } : a;
        }
        return { ...a, ...patch };
      }),
    }));
  };

  const removeAddress = (id) => {
    setState((s) => {
      const next = s.addresses.filter((a) => a.id !== id);
      if (next.length && !next.some((a) => a.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return { ...s, addresses: next };
    });
  };

  const setDefaultAddress = (id) => {
    setState((s) => ({
      ...s,
      addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
    }));
  };

  const toggleWishlist = useCallback((productId) => {
    setState((s) => {
      const has = s.wishlist.includes(productId);
      return {
        ...s,
        wishlist: has
          ? s.wishlist.filter((id) => id !== productId)
          : [...s.wishlist, productId],
      };
    });
  }, []);

  const isInWishlist = useCallback(
    (productId) => state.wishlist.includes(productId),
    [state.wishlist],
  );

  const value = useMemo(
    () => ({
      ...state,
      setProfile,
      setFarm,
      setSettings,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      toggleWishlist,
      isInWishlist,
    }),
    [state, toggleWishlist, isInWishlist],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}
