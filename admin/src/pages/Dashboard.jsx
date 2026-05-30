import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  Globe,
  BookOpen,
  Mail,
  PenLine,
  Plus,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/shadcn-button.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import AdminPage from '../components/AdminPage.jsx';
import AdminSection from '../components/AdminSection.jsx';
import { adminApi } from '../lib/api.js';
import {
  adminIconTones,
  adminRowSurface,
  adminRowTones,
  adminStatTones,
} from '../lib/adminColors.js';
import { cn } from '@/lib/utils';

const quickActions = [
  {
    label: 'Edit homepage',
    description: 'Slider, banners, and text',
    to: '/content',
    icon: Globe,
    tone: 'sage',
  },
  {
    label: 'Add a product',
    description: 'New item for the shop',
    to: '/products',
    icon: Plus,
    tone: 'earth',
  },
  {
    label: 'Write a blog post',
    description: 'News and farm updates',
    to: '/blog',
    icon: PenLine,
    tone: 'wheat',
  },
  {
    label: 'Check messages',
    description: 'Customer inquiries',
    to: '/inquiries',
    icon: Mail,
    tone: 'gold',
  },
];

const manageLinks = [
  { label: 'Website content', to: '/content', icon: Globe, tone: 'sage' },
  { label: 'Products', to: '/products', icon: Package, tone: 'earth' },
  { label: 'Orders', to: '/orders', icon: ShoppingCart, tone: 'forest' },
  { label: 'Blog', to: '/blog', icon: BookOpen, tone: 'wheat' },
];

function statusBadge(status) {
  if (status === 'pending') return 'secondary';
  if (status === 'completed') return 'default';
  return 'outline';
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.orders()])
      .then(([s, o]) => {
        setStats(s);
        setOrders(o.orders?.slice(0, 5) || []);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Total orders',
      value: stats?.totalOrders ?? '—',
      icon: ShoppingCart,
      hint: 'All time',
      tone: adminStatTones.orders,
      border: 'border-t-forest',
      surface: 'bg-forest/[0.05]',
    },
    {
      label: 'Revenue',
      value: stats ? `GH₵ ${Number(stats.revenue).toLocaleString()}` : '—',
      icon: TrendingUp,
      hint: 'Completed orders',
      tone: adminStatTones.gold,
      border: 'border-t-star',
      surface: 'bg-star/[0.07]',
    },
    {
      label: 'New customers',
      value: stats?.newCustomers ?? '—',
      icon: Users,
      hint: 'Last 30 days',
      tone: adminStatTones.customers,
      border: 'border-t-forest-light',
      surface: 'bg-forest-light/[0.09]',
    },
    {
      label: 'Pending orders',
      value: stats?.pendingOrders ?? '—',
      icon: Package,
      hint: 'Needs attention',
      tone: stats?.pendingOrders > 0 ? adminStatTones.pending : adminIconTones.beige,
      border: stats?.pendingOrders > 0 ? 'border-t-accent' : 'border-t-beige-dark',
      surface: stats?.pendingOrders > 0 ? 'bg-wheat/12' : 'bg-beige-soft/80',
    },
  ];

  return (
    <AdminPage
      title="Dashboard"
      description="Overview of your store, website, and recent activity."
    >
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1, duration: 0.4 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statCards.map(({ label, value, icon: Icon, hint, tone, border, surface }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              size="sm"
              className={cn(
                'border-t-2 ring-foreground/[0.06] transition-all duration-300 hover:ring-primary/20 hover:-translate-y-1',
                border,
                surface,
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-1">
                <div className="space-y-1">
                  <CardDescription>{label}</CardDescription>
                  {loading ? (
                    <Skeleton className="mt-2 h-8 w-28" />
                  ) : (
                    <p className="text-2xl font-semibold tracking-tight">{value}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{hint}</p>
                </div>
                <div className={cn('admin-stat-icon', tone)}>
                  <Icon className="size-5" />
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-5">
        <AdminSection
          className="lg:col-span-2"
          tone="wheat"
          title="Quick actions"
          description="Common tasks to manage your site and store"
        >
          <div className="flex flex-col gap-2.5">
            {quickActions.map(({ label, description, to, icon: Icon, tone }) => (
              <Link
                key={to + label}
                to={to}
                className="group admin-row-interactive"
              >
                <div className={cn('admin-row-icon transition-colors', adminRowTones[tone])}>
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </AdminSection>

        <AdminSection
          className="lg:col-span-3"
          tone="sage"
          title="Recent orders"
          description="Latest customer purchases"
          actions={
            <Button variant="outline" size="sm" asChild>
              <Link to="/orders">
                View all
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          }
        >
          {loading ? (
            <div className="flex flex-col gap-2.5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[4.5rem] w-full rounded-xl" />
              ))}
            </div>
          ) : orders.length ? (
            <div className="flex flex-col gap-2.5">
              {orders.map((o, i) => (
                  <div
                    key={o.id}
                    className={cn('admin-row flex-wrap sm:flex-nowrap', adminRowSurface(i))}
                  >
                    <div className="admin-row-icon rounded-full text-xs font-semibold">
                      #{o.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {o.customer?.name || 'Guest customer'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {o.created_at
                          ? new Date(o.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums">
                      GH₵ {Number(o.subtotal || 0).toLocaleString()}
                    </p>
                    <Badge variant={statusBadge(o.status)} className="capitalize">
                      {o.status || 'unknown'}
                    </Badge>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
              <ShoppingCart className="mb-2 size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No orders yet.</p>
              <Button variant="link" size="sm" asChild className="mt-1">
                <Link to="/products">Add products to get started</Link>
              </Button>
            </div>
          )}
        </AdminSection>
      </div>

      <AdminSection tone="gold" title="Manage" description="Jump to a section">
        <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-4">
          {manageLinks.map(({ label, to, icon: Icon, tone }) => (
            <Link
              key={to}
              to={to}
              className="group admin-row-interactive bg-card/70 hover:bg-beige-soft"
            >
              <div className={cn('admin-row-icon transition-colors', adminRowTones[tone])}>
                <Icon className="size-5" />
              </div>
              <p className="min-w-0 flex-1 font-medium">{label}</p>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </AdminSection>
    </AdminPage>
  );
}
