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
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
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
import { adminApi } from '../lib/api.js';
import { cn } from '@/lib/utils';

/* ─── Mock chart data (will use real stats when available) ─── */
const revenueChartData = [
  { name: 'Jan', revenue: 4200, orders: 12 },
  { name: 'Feb', revenue: 5800, orders: 18 },
  { name: 'Mar', revenue: 3900, orders: 10 },
  { name: 'Apr', revenue: 7200, orders: 24 },
  { name: 'May', revenue: 6100, orders: 20 },
  { name: 'Jun', revenue: 8400, orders: 28 },
  { name: 'Jul', revenue: 9100, orders: 32 },
];

const CHART_COLORS = ['#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'];

const quickActions = [
  {
    label: 'Edit homepage',
    description: 'Slider, banners, and text',
    to: '/content',
    icon: Globe,
  },
  {
    label: 'Add a product',
    description: 'New item for the shop',
    to: '/products',
    icon: Plus,
  },
  {
    label: 'Write a blog post',
    description: 'News and farm updates',
    to: '/blog',
    icon: PenLine,
  },
  {
    label: 'Check messages',
    description: 'Customer inquiries',
    to: '/inquiries',
    icon: Mail,
  },
];

function statusBadge(status) {
  if (status === 'pending') return 'secondary';
  if (status === 'completed') return 'default';
  return 'outline';
}

function StatusDot({ status }) {
  const colors = {
    completed: 'bg-emerald-400',
    pending: 'bg-amber-400',
    processing: 'bg-primary',
    cancelled: 'bg-red-400',
  };
  return <span className={cn('inline-block size-2 rounded-full', colors[status] || 'bg-muted-foreground')} />;
}

/* ─── Custom Recharts Tooltip ─── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-xl">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-muted-foreground">
          <span className="inline-block size-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
          {entry.name}: {entry.name === 'revenue' ? `GH₵ ${entry.value.toLocaleString()}` : entry.value}
        </p>
      ))}
    </div>
  );
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

  const orderStatusData = [
    { name: 'Completed', value: stats?.totalOrders ? Math.max(1, (stats.totalOrders - (stats.pendingOrders || 0))) : 3 },
    { name: 'Pending', value: stats?.pendingOrders || 1 },
    { name: 'Processing', value: Math.ceil((stats?.totalOrders || 4) * 0.15) },
    { name: 'Cancelled', value: Math.ceil((stats?.totalOrders || 4) * 0.05) },
  ];

  const statCards = [
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? '—',
      icon: ShoppingCart,
      hint: '+2% from last quarter',
      trend: 'up',
      color: 'bg-primary/10 text-primary border-primary/20',
      iconBg: 'bg-primary/10 text-primary',
    },
    {
      label: 'Revenue',
      value: stats ? `GH₵ ${Number(stats.revenue).toLocaleString()}` : '—',
      icon: TrendingUp,
      hint: '+15% from last quarter',
      trend: 'up',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      label: 'New Customers',
      value: stats?.newCustomers ?? '—',
      icon: Users,
      hint: '+2% from last quarter',
      trend: 'up',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      iconBg: 'bg-blue-500/10 text-blue-400',
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders ?? '—',
      icon: Package,
      hint: stats?.pendingOrders > 0 ? 'Needs attention' : 'All clear',
      trend: stats?.pendingOrders > 0 ? 'down' : 'up',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      iconBg: 'bg-amber-500/10 text-amber-400',
    },
  ];

  return (
    <AdminPage
      title="Dashboard"
      description="Here is today's report and performances"
    >
      {/* ─── Stat Cards ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statCards.map(({ label, value, icon: Icon, hint, trend, color, iconBg }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className={cn(
              'relative overflow-hidden border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5',
              color
            )}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardDescription className="text-xs font-medium uppercase tracking-wider">
                    {label}
                  </CardDescription>
                  {loading ? (
                    <Skeleton className="mt-2 h-8 w-28" />
                  ) : (
                    <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="size-8 rounded-lg text-muted-foreground">
                  <MoreHorizontal className="size-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-1.5 text-xs">
                  {trend === 'up' ? (
                    <ArrowUpRight className="size-3.5 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="size-3.5 text-amber-400" />
                  )}
                  <span className={trend === 'up' ? 'text-emerald-400' : 'text-amber-400'}>
                    {hint}
                  </span>
                </div>
              </CardContent>
              {/* Subtle glow */}
              <div className={cn('pointer-events-none absolute -right-4 -top-4 size-24 rounded-full opacity-20 blur-2xl', iconBg.split(' ')[0])} />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Charts Row ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid gap-4 lg:grid-cols-5"
      >
        {/* Revenue Bar Chart */}
        <Card className="border-border lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Performance</CardTitle>
              <CardDescription>Monthly revenue overview</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-full text-xs">
              Monthly
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(v) => `₵${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="orders" fill="#6d28d9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Donut */}
        <Card className="border-border lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Order Status</CardTitle>
            <CardDescription>Breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {orderStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-center">
              {orderStatusData.map((item, i) => (
                <div key={item.name}>
                  <p className="text-lg font-bold" style={{ color: CHART_COLORS[i] }}>{item.value}</p>
                  <p className="text-[11px] text-muted-foreground">{item.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Quick Actions + Recent Orders ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="grid gap-4 lg:grid-cols-5"
      >
        {/* Quick Actions */}
        <Card className="border-border lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your site</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {quickActions.map(({ label, description, to, icon: Icon }) => (
              <Link
                key={to + label}
                to={to}
                className="group flex items-center gap-3 rounded-xl border border-transparent bg-accent/40 px-4 py-3 transition-all duration-200 hover:border-primary/20 hover:bg-primary/[0.06]"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="size-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders Table */}
        <Card className="border-border lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
              <CardDescription>Latest customer purchases</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="rounded-full text-xs">
              <Link to="/orders">
                View all
                <ArrowRight className="ml-1 size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : orders.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="pb-3 pl-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium text-right">Amount</th>
                      <th className="pb-3 pr-3 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-border/50 transition-colors hover:bg-accent/30">
                        <td className="py-3 pl-3 font-mono text-xs text-muted-foreground">
                          #{o.id}
                        </td>
                        <td className="py-3">
                          <p className="font-medium">{o.customer?.name || 'Guest'}</p>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {o.created_at
                            ? new Date(o.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td className="py-3 text-right font-semibold tabular-nums">
                          GH₵ {Number(o.subtotal || 0).toLocaleString()}
                        </td>
                        <td className="py-3 pr-3 text-center">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium capitalize">
                            <StatusDot status={o.status} />
                            {o.status || 'unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
          </CardContent>
        </Card>
      </motion.div>
    </AdminPage>
  );
}
