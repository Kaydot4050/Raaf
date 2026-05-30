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
  Search,
  Bell,
  Settings,
  ChevronLeft,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button.jsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet.jsx';
import { Input } from '@/components/ui/input.jsx';
import AdminLogo from '../components/AdminLogo.jsx';
import { ThemeToggle } from '../components/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { SITE_URL } from '../lib/api.js';
import { cn } from '@/lib/utils';

const mainNav = [
  { to: '/', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/content', label: 'Website Content', icon: Globe },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/blog', label: 'Blog', icon: BookOpen },
  { to: '/inquiries', label: 'Inquiries', icon: Mail },
  { to: '/users', label: 'User Management', icon: Users },
];

const bottomNav = [
  { to: '/content', label: 'Settings', icon: Settings },
  { to: '/inquiries', label: 'Help & Support', icon: HelpCircle },
];

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/content': 'Website Content',
  '/products': 'Products',
  '/orders': 'Orders',
  '/blog': 'Blog',
  '/inquiries': 'Inquiries',
  '/users': 'User Management',
};

function NavItems({ onNavigate, collapsed }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      <p className={cn(
        'mb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60',
        collapsed && 'sr-only'
      )}>
        Main Menu
      </p>
      {mainNav.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              collapsed && 'justify-center px-2'
            )
          }
        >
          <Icon className="size-[18px] shrink-0" />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
}

function BottomNav({ collapsed }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {bottomNav.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to + label}
          to={to}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              collapsed && 'justify-center px-2'
            )
          }
        >
          <Icon className="size-[18px] shrink-0" />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const initial = user?.email?.[0]?.toUpperCase() || 'A';
  const pageTitle = PAGE_TITLES[location.pathname] || 'Admin';

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:flex',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && <AdminLogo subtitle="Store management" />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className={cn('size-4 transition-transform', collapsed && 'rotate-180')} />
          </Button>
        </div>

        {/* Main Nav */}
        <div className="flex-1 overflow-y-auto py-4">
          <NavItems collapsed={collapsed} />
        </div>

        {/* Bottom Section */}
        <div className="border-t border-sidebar-border py-3">
          <BottomNav collapsed={collapsed} />
        </div>

        {/* User Card */}
        <div className="border-t border-sidebar-border p-3">
          <div className={cn(
            'flex items-center gap-3 rounded-xl bg-sidebar-accent p-3',
            collapsed && 'justify-center p-2'
          )}>
            <Avatar className="size-9 ring-2 ring-primary/30">
              <AvatarFallback className="bg-primary/20 text-sm font-semibold text-primary">
                {initial}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {user?.name || user?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            )}
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background px-4 lg:px-6">
          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <MenuIcon className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
              <SheetHeader className="border-b border-sidebar-border px-4 py-4 text-left">
                <AdminLogo subtitle="Store management" />
              </SheetHeader>
              <div className="py-4">
                <NavItems onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="border-t border-sidebar-border p-3">
                <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start gap-2 text-muted-foreground">
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Search */}
          <div className="relative hidden flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search something..."
              className="h-10 w-full max-w-sm rounded-full border-border bg-accent/50 pl-10 text-sm placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Page title on mobile */}
          <span className="text-sm font-semibold sm:hidden">{pageTitle}</span>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative size-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="size-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
              <Settings className="size-4" />
            </Button>
            <Button variant="outline" size="sm" asChild className="ml-2 hidden rounded-full sm:inline-flex">
              <a href={SITE_URL} rel="noreferrer">
                <ExternalLink className="mr-1.5 size-3.5" />
                View site
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="ml-1 lg:hidden">
              <LogOut className="mr-1 size-3.5" />
              Sign out
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
