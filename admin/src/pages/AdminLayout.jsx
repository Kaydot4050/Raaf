import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  Package,
  ShoppingCart,
  BookOpen,
  Mail,
  Users,
  LogOut,
  ExternalLink,
  MenuIcon,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button.jsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet.jsx';
import AdminLogo from '../components/AdminLogo.jsx';
import { ThemeToggle } from '../components/ThemeToggle.jsx';
import { adminSidebarIconTones } from '../lib/adminColors.js';
import { useAuth } from '../context/AuthContext.jsx';
import { SITE_URL } from '../lib/api.js';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/', end: true, label: 'Dashboard', icon: LayoutDashboard, tone: 'wheat' },
  { to: '/content', label: 'Website content', icon: Globe, tone: 'sage' },
  { to: '/products', label: 'Products', icon: Package, tone: 'earth' },
  { to: '/orders', label: 'Orders', icon: ShoppingCart, tone: 'gold' },
  { to: '/blog', label: 'Blog', icon: BookOpen, tone: 'cream' },
  { to: '/inquiries', label: 'Inquiries', icon: Mail, tone: 'forest' },
  { to: '/users', label: 'Users', icon: Users, tone: 'earth' },
];

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/content': 'Website content',
  '/products': 'Products',
  '/orders': 'Orders',
  '/blog': 'Blog',
  '/inquiries': 'Inquiries',
  '/users': 'Users',
};

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-0.5 px-3 py-2">
      {nav.map(({ to, end, label, icon: Icon, tone }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-sidebar-accent text-sidebar-primary shadow-[inset_3px_0_0_0_var(--sidebar-primary)]'
                : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground',
            )
          }
        >
          <span
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-lg',
              adminSidebarIconTones[tone],
            )}
          >
            <Icon className="size-4" />
          </span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarBrand() {
  return (
    <div className="border-b border-sidebar-border px-5 py-5">
      <AdminLogo subtitle="Store management" />
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const initial = user?.email?.[0]?.toUpperCase() || 'A';
  const pageTitle = PAGE_TITLES[location.pathname] || 'Admin';

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <SidebarBrand />
        <div className="flex-1 overflow-y-auto">
          <p className="px-6 pb-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/45">
            Menu
          </p>
          <NavItems />
        </div>
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
            <Avatar className="size-9 ring-2 ring-sidebar-primary/40">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-primary">{initial}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{user?.email}</p>
              <p className="text-xs text-sidebar-foreground/55">Administrator</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={logout}
              aria-label="Sign out"
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <LogOut />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md lg:px-8">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <MenuIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
              <SheetHeader className="border-b border-sidebar-border px-4 py-4 text-left">
                <AdminLogo subtitle="Store management" />
              </SheetHeader>
              <NavItems onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-muted-foreground">
            <span>Home</span>
            <ChevronRight className="size-3.5 shrink-0 opacity-50" />
            <span className="truncate font-medium text-foreground">{pageTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex rounded-full">
              <a href={SITE_URL} rel="noreferrer">
                <ExternalLink data-icon="inline-start" />
                View site
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="lg:hidden rounded-full">
              <LogOut data-icon="inline-start" />
              Sign out
            </Button>
          </div>
        </header>

        <main className="relative flex-1 overflow-y-auto bg-background p-4 lg:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            aria-hidden
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 0% 0%, rgb(45 74 50 / 8%), transparent), radial-gradient(ellipse 50% 40% at 100% 100%, rgb(196 165 116 / 12%), transparent)',
            }}
          />
          <div className="relative mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
