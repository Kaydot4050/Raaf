import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { accountApi } from '../lib/api.js';
import { useAuth } from './AuthContext.jsx';

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

function applyAccountToState(account) {
  if (!account) return defaultState;
  return {
    profile: { ...defaultState.profile, ...account.profile },
    farm: { ...defaultState.farm, ...account.farm },
    addresses: account.addresses || [],
    wishlist: account.wishlist || [],
    settings: { ...defaultState.settings, ...account.settings },
  };
}

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [state, setState] = useState(defaultState);
  const [hasPassword, setHasPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshAccount = useCallback(async () => {
    if (!isAuthenticated) {
      setState(defaultState);
      setHasPassword(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { account } = await accountApi.get();
      setState(applyAccountToState(account));
      setHasPassword(!!account?.hasPassword);
      setError(null);
    } catch (e) {
      setError(e.message || 'Could not load account.');
      setState(defaultState);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshAccount();
  }, [refreshAccount]);

  useEffect(() => {
    if (!user || loading) return;
    setState((s) => ({
      ...s,
      profile: {
        ...s.profile,
        email: s.profile.email || user.email || '',
        firstName: s.profile.firstName || user.name?.split(/\s+/)[0] || '',
        lastName: s.profile.lastName || user.name?.split(/\s+/).slice(1).join(' ') || '',
        phone: s.profile.phone || user.phone || '',
        farmName: s.profile.farmName || user.farmName || '',
      },
    }));
  }, [user, loading]);

  const setProfile = (patch) =>
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));

  const setFarm = (patch) => setState((s) => ({ ...s, farm: { ...s.farm, ...patch } }));

  const setSettings = (patch) =>
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));

  const saveProfile = useCallback(async () => {
    try {
      const { account } = await accountApi.updateProfile(state.profile);
      setState(applyAccountToState(account));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, [state.profile]);

  const saveFarm = useCallback(async () => {
    try {
      const { account } = await accountApi.updateFarm(state.farm);
      setState(applyAccountToState(account));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, [state.farm]);

  const saveSettings = useCallback(async (patch) => {
    const next = patch ? { ...state.settings, ...patch } : state.settings;
    try {
      const { account } = await accountApi.updateNotifications(next);
      setState(applyAccountToState(account));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, [state.settings]);

  const addAddress = useCallback(async (address) => {
    try {
      const { account } = await accountApi.addAddress(address);
      setState(applyAccountToState(account));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, []);

  const removeAddress = useCallback(async (id) => {
    try {
      const { account } = await accountApi.removeAddress(id);
      setState(applyAccountToState(account));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, []);

  const setDefaultAddress = useCallback(async (id) => {
    try {
      const { account } = await accountApi.setDefaultAddress(id);
      setState(applyAccountToState(account));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, []);

  const toggleWishlist = useCallback(async (productId) => {
    const prev = state.wishlist;
    const has = prev.includes(productId);
    setState((s) => ({
      ...s,
      wishlist: has ? s.wishlist.filter((id) => id !== productId) : [...s.wishlist, productId],
    }));
    try {
      const { wishlist } = await accountApi.toggleWishlist(productId);
      setState((s) => ({ ...s, wishlist }));
      return { ok: true, added: !has };
    } catch (e) {
      setState((s) => ({ ...s, wishlist: prev }));
      return { ok: false, error: e.message };
    }
  }, [state.wishlist]);

  const isInWishlist = useCallback(
    (productId) => state.wishlist.includes(productId),
    [state.wishlist],
  );

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    try {
      await accountApi.changePassword({ currentPassword, newPassword });
      setHasPassword(true);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      loading,
      error,
      hasPassword,
      refreshAccount,
      setProfile,
      setFarm,
      setSettings,
      saveProfile,
      saveFarm,
      saveSettings,
      addAddress,
      removeAddress,
      setDefaultAddress,
      toggleWishlist,
      isInWishlist,
      changePassword,
    }),
    [
      state,
      loading,
      error,
      hasPassword,
      refreshAccount,
      saveProfile,
      saveFarm,
      saveSettings,
      addAddress,
      removeAddress,
      setDefaultAddress,
      toggleWishlist,
      isInWishlist,
      changePassword,
    ],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}
