import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  Settings,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

function initials(name, email) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'R';
  }
  return email?.[0]?.toUpperCase() || 'R';
}

const MENU_ITEMS = [
  { to: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/account?tab=orders', label: 'Orders', icon: Package },
  { to: '/track-order', label: 'Track order', icon: Search },
  { to: '/account?tab=profile', label: 'Settings', icon: Settings },
];

export default function UserMenu({ compact = false }) {
  const { user, logout, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    showToast('Logged out successfully');
    navigate('/');
  };

  const firstName = user?.name?.split(/\s+/)[0] || 'Account';

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-full border border-border bg-white hover:border-forest/35 hover:shadow-md transition-all duration-200 ${
          compact ? 'p-1 pr-2' : 'pl-1 pr-3 py-1'
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-forest to-forest-light text-white font-display font-bold text-sm flex items-center justify-center ring-2 ring-white shadow-sm overflow-hidden">
          {user?.image ? (
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : (
            initials(user?.name, user?.email)
          )}
        </span>
        {!compact && (
          <>
            <span className="text-sm font-semibold text-charcoal max-w-[88px] truncate hidden sm:inline">
              {firstName}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl border border-border bg-white shadow-xl overflow-hidden z-[100]"
          >
            <div className="px-4 py-3 border-b border-border bg-beige-soft/50">
              <p className="font-semibold text-sm text-charcoal truncate">{user?.name}</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
            <ul className="py-1.5">
              {isAdmin && (
                <li>
                  <a
                    href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-forest font-semibold hover:bg-forest/5"
                  >
                    <Shield className="w-4 h-4" />
                    Admin panel
                  </a>
                </li>
              )}
              {MENU_ITEMS.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal hover:bg-forest/5 hover:text-forest transition-colors"
                  >
                    <Icon className="w-4 h-4 text-forest/80" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-border py-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
