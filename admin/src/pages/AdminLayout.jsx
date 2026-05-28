import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Package,
  ShoppingCart,
  MessageSquare,
  BookOpen,
  Users,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { SITE_URL } from '../lib/api.js';

const nav = [
  { to: '/', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/content', label: 'Page content', icon: FileText },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/blog', label: 'Blog', icon: BookOpen },
  { to: '/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/users', label: 'Users', icon: Users },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex">
      <aside className="w-64 shrink-0 bg-white border-r border-border flex flex-col hidden lg:flex">
        <div className="p-5 border-b border-border">
          <Link to="/" className="font-display font-bold text-charcoal text-lg">
            Raafort<span className="text-forest">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-forest text-white' : 'text-charcoal/70 hover:bg-beige-soft'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <a
            href={SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-charcoal/70 hover:bg-beige-soft"
          >
            <ExternalLink className="w-4 h-4" />
            View website
          </a>
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0">
          <p className="text-sm font-medium text-charcoal lg:hidden">Raafort Admin</p>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-text-muted hidden sm:inline">{user?.email}</span>
            <span className="text-xs font-semibold uppercase tracking-wide bg-forest/10 text-forest px-2 py-1 rounded-full">
              Admin
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
