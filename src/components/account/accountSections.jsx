import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  Tractor,
  Shield,
  Bell,
  Plus,
  Trash2,
  User,
} from 'lucide-react';
import { useAccount } from '../../context/AccountContext.jsx';
import { sampleOrders } from '../../data/orders.js';
import { products, getProduct, formatPrice } from '../../data/products.js';
import { useCart } from '../../context/CartContext.jsx';
import Button from '../ui/Button.jsx';
import ProductCard from '../ProductCard.jsx';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25';
const labelCls = 'block text-xs font-semibold text-charcoal uppercase tracking-wide mb-1.5';

function Card({ title, description, children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          {title && <h2 className="font-display text-lg font-bold text-charcoal">{title}</h2>}
          {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function SaveBanner({ show, message = 'Changes saved.' }) {
  if (!show) return null;
  return (
    <p className="mb-4 text-sm font-medium text-forest bg-forest/10 border border-forest/20 rounded-xl px-4 py-2.5">
      {message}
    </p>
  );
}

const statusColors = {
  Delivered: 'bg-forest/10 text-forest',
  'In transit': 'bg-amber-100 text-amber-800',
  Processing: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-red-100 text-red-700',
};

export function DashboardSection() {
  const { profile, wishlist, addresses } = useAccount();
  const name = profile.firstName || 'Farmer';

  return (
    <div className="space-y-6">
      <Card title={`Welcome back, ${name}`} description="Manage your farm orders and account details in one place.">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Orders', value: sampleOrders.length },
            { label: 'Wishlist', value: wishlist.length },
            { label: 'Addresses', value: addresses.length },
            { label: 'Member', value: 'Active' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-beige-soft/80 border border-beige-dark/25 p-4 text-center">
              <p className="font-display text-2xl font-bold text-forest">{s.value}</p>
              <p className="text-xs text-text-muted mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button to="/shop">Shop now</Button>
          <Button to="/track-order" variant="ghost">
            Track an order
          </Button>
        </div>
      </Card>

      <Card title="Recent orders" action={<Link to="/account?tab=orders" className="text-sm font-semibold text-forest">View all</Link>}>
        <ul className="space-y-3">
          {sampleOrders.slice(0, 2).map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-border/60 last:border-0">
              <div>
                <p className="font-semibold text-sm text-charcoal">{o.id}</p>
                <p className="text-xs text-text-muted">{o.date}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusColors[o.status] || 'bg-beige-soft text-charcoal'}`}>
                {o.status}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function ProfileSection() {
  const { profile, setProfile } = useAccount();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Card title="Profile details" description="Update your contact information for orders and delivery.">
      <SaveBanner show={saved} />
      <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-4">
          <label>
            <span className={labelCls}>First name</span>
            <input className={inputCls} value={profile.firstName} onChange={(e) => setProfile({ firstName: e.target.value })} />
          </label>
          <label>
            <span className={labelCls}>Last name</span>
            <input className={inputCls} value={profile.lastName} onChange={(e) => setProfile({ lastName: e.target.value })} />
          </label>
        </div>
        <label>
          <span className={labelCls}>Email</span>
          <input type="email" className={inputCls} value={profile.email} onChange={(e) => setProfile({ email: e.target.value })} />
        </label>
        <label>
          <span className={labelCls}>Phone</span>
          <input type="tel" className={inputCls} value={profile.phone} onChange={(e) => setProfile({ phone: e.target.value })} />
        </label>
        <label>
          <span className={labelCls}>Farm / business name</span>
          <input className={inputCls} value={profile.farmName} onChange={(e) => setProfile({ farmName: e.target.value })} />
        </label>
        <Button type="submit">Save profile</Button>
      </form>
    </Card>
  );
}

export function OrdersSection() {
  return (
    <Card title="Order history" description="View past orders and track current deliveries.">
      <ul className="space-y-4">
        {sampleOrders.map((o) => (
          <li key={o.id} className="rounded-xl border border-border p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold text-charcoal">{o.id}</p>
                <p className="text-xs text-text-muted mt-0.5">Placed {o.date}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-lg mb-1 ${statusColors[o.status]}`}>
                  {o.status}
                </span>
                <p className="text-sm font-bold text-charcoal">{formatPrice(o.total, o.total)}</p>
              </div>
            </div>
            <ul className="text-sm text-text-muted space-y-1 mb-4">
              {o.items.map((item, i) => (
                <li key={i}>
                  {item.qty}× {item.name}
                </li>
              ))}
            </ul>
            <Button to={`/track-order?order=${o.id}`} variant="ghost" size="sm">
              Track this order
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const emptyAddress = {
  label: 'Farm',
  name: '',
  phone: '',
  region: '',
  address: '',
  isDefault: false,
};

export function AddressesSection() {
  const { addresses, addAddress, removeAddress, setDefaultAddress } = useAccount();
  const [form, setForm] = useState(null);

  const submitAddress = (e) => {
    e.preventDefault();
    addAddress(form);
    setForm(null);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Delivery addresses"
        description="Save farm gate and depot locations for faster checkout."
        action={
          !form && (
            <button
              type="button"
              onClick={() => setForm({ ...emptyAddress })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest"
            >
              <Plus className="w-4 h-4" /> Add address
            </button>
          )
        }
      >
        {form && (
          <form className="mb-6 p-4 rounded-xl bg-beige-soft/60 border border-beige-dark/25 space-y-3" onSubmit={submitAddress}>
            <div className="grid sm:grid-cols-2 gap-3">
              <label>
                <span className={labelCls}>Label</span>
                <input className={inputCls} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Main farm" />
              </label>
              <label>
                <span className={labelCls}>Contact name</span>
                <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
            </div>
            <label>
              <span className={labelCls}>Phone</span>
              <input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </label>
            <label>
              <span className={labelCls}>Region</span>
              <input className={inputCls} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} required />
            </label>
            <label>
              <span className={labelCls}>Full address</span>
              <textarea className={`${inputCls} resize-y`} rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </label>
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
              Set as default
            </label>
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Save address
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setForm(null)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {addresses.length === 0 && !form && (
          <p className="text-sm text-text-muted">No saved addresses yet. Add your farm delivery location.</p>
        )}

        <ul className="space-y-3">
          {addresses.map((a) => (
            <li key={a.id} className="flex gap-3 p-4 rounded-xl border border-border">
              <MapPin className="w-5 h-5 text-forest shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm text-charcoal">{a.label}</p>
                  {a.isDefault && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-forest bg-forest/10 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted mt-1">{a.name} · {a.phone}</p>
                <p className="text-sm text-text-muted">{a.address}, {a.region}</p>
                {!a.isDefault && (
                  <button type="button" onClick={() => setDefaultAddress(a.id)} className="text-xs font-semibold text-forest mt-2">
                    Set as default
                  </button>
                )}
              </div>
              <button type="button" onClick={() => removeAddress(a.id)} className="text-text-muted hover:text-red-600 p-1" aria-label="Remove">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function WishlistSection() {
  const { wishlist } = useAccount();
  const { addItem } = useCart();
  const items = wishlist.map(getProduct).filter(Boolean);

  return (
    <Card title="Wishlist" description="Products you have saved for later.">
      {items.length === 0 ? (
        <div className="text-center py-10">
          <Heart className="w-10 h-10 text-forest/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted mb-4">Your wishlist is empty.</p>
          <Button to="/shop">Browse products</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addItem} />
          ))}
        </div>
      )}
    </Card>
  );
}

export function FarmSection() {
  const { farm, setFarm } = useAccount();
  const [saved, setSaved] = useState(false);

  return (
    <Card title="Farm details" description="Help us recommend the right breeds, feed, and delivery options.">
      <SaveBanner show={saved} />
      <form
        className="space-y-4 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }}
      >
        <label>
          <span className={labelCls}>Farm type</span>
          <select className={inputCls} value={farm.farmType} onChange={(e) => setFarm({ farmType: e.target.value })}>
            <option value="">Select type</option>
            <option value="poultry">Poultry</option>
            <option value="livestock">Livestock</option>
            <option value="mixed">Mixed farm</option>
            <option value="commercial">Commercial unit</option>
          </select>
        </label>
        <label>
          <span className={labelCls}>Region</span>
          <input className={inputCls} value={farm.region} onChange={(e) => setFarm({ region: e.target.value })} placeholder="e.g. Ashanti" />
        </label>
        <label>
          <span className={labelCls}>Approx. flock / herd size</span>
          <input className={inputCls} value={farm.flockSize} onChange={(e) => setFarm({ flockSize: e.target.value })} placeholder="e.g. 2,000 broilers" />
        </label>
        <label>
          <span className={labelCls}>Notes for our team</span>
          <textarea className={`${inputCls} resize-y`} rows={3} value={farm.notes} onChange={(e) => setFarm({ notes: e.target.value })} />
        </label>
        <Button type="submit">Save farm details</Button>
      </form>
    </Card>
  );
}

export function SecuritySection() {
  const [saved, setSaved] = useState(false);

  return (
    <Card title="Password & security" description="Keep your account secure.">
      <SaveBanner show={saved} message="Password updated (demo)." />
      <form
        className="space-y-4 max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }}
      >
        <label>
          <span className={labelCls}>Current password</span>
          <input type="password" className={inputCls} autoComplete="current-password" />
        </label>
        <label>
          <span className={labelCls}>New password</span>
          <input type="password" className={inputCls} autoComplete="new-password" />
        </label>
        <label>
          <span className={labelCls}>Confirm new password</span>
          <input type="password" className={inputCls} autoComplete="new-password" />
        </label>
        <Button type="submit">Update password</Button>
      </form>
    </Card>
  );
}

export function NotificationsSection() {
  const { settings, setSettings } = useAccount();

  const toggles = [
    { key: 'orderUpdates', label: 'Order updates', desc: 'Shipping and delivery notifications' },
    { key: 'promotions', label: 'Offers & promotions', desc: 'Seasonal deals on chicks and feed' },
    { key: 'farmTips', label: 'Farm insights', desc: 'Tips from our blog and agronomy team' },
    { key: 'smsAlerts', label: 'SMS alerts', desc: 'Text messages for urgent order updates' },
  ];

  return (
    <Card title="Notifications" description="Choose how we contact you.">
      <ul className="space-y-4 max-w-xl">
        {toggles.map(({ key, label, desc }) => (
          <li key={key} className="flex items-start justify-between gap-4 py-3 border-b border-border/60 last:border-0">
            <div>
              <p className="font-semibold text-sm text-charcoal">{label}</p>
              <p className="text-xs text-text-muted mt-0.5">{desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings[key]}
              onClick={() => setSettings({ [key]: !settings[key] })}
              className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${settings[key] ? 'bg-forest' : 'bg-border'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings[key] ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export const ACCOUNT_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'farm', label: 'Farm details', icon: Tractor },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export const SECTION_MAP = {
  dashboard: DashboardSection,
  profile: ProfileSection,
  orders: OrdersSection,
  addresses: AddressesSection,
  wishlist: WishlistSection,
  farm: FarmSection,
  security: SecuritySection,
  notifications: NotificationsSection,
};
