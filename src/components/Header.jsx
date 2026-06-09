import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useSearch } from '../context/SearchContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { usePageSection } from '../context/ContentContext.jsx';
import Button from './ui/Button.jsx';
import AuthButtons from './auth/AuthButtons.jsx';
import UserMenu from './auth/UserMenu.jsx';

const DEFAULT_NAV = [
  { to: '/', label: 'Home', end: true },
  { 
    to: '/shop', 
    label: 'Shop',
    dropdown: [
      { to: '/shop', label: 'All Products', end: true },
      { to: '/track-order', label: 'Track Order' }
    ]
  },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'Our Mission' },
  { to: '/contact', label: 'Contact' },
];

function NavPillLink({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `px-4 xl:px-5 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200 ${
          isActive ? 'bg-beige text-charcoal shadow-sm' : 'text-charcoal/75 hover:text-charcoal'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function NavDropdownPill({ to, label, end, dropdown }) {
  return (
    <div className="relative group">
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `flex items-center gap-1.5 px-4 xl:px-5 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200 ${
            isActive ? 'bg-beige text-charcoal shadow-sm' : 'text-charcoal/75 hover:text-charcoal'
          }`
        }
      >
        {label}
        <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" strokeWidth={2.5} />
      </NavLink>
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-white rounded-xl shadow-lg border border-border/60 p-1.5 min-w-[150px] flex flex-col gap-0.5">
          {dropdown.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive ? 'bg-beige-soft font-semibold text-charcoal' : 'text-charcoal/80 hover:bg-beige-soft/60 hover:text-charcoal'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileNavItem({ item, closeMenu }) {
  const { to, label, end, dropdown } = item;
  const [isOpen, setIsOpen] = useState(false);

  if (!dropdown) {
    return (
      <li className="flex flex-col gap-1">
        <NavLink
          to={to}
          end={end}
          onClick={closeMenu}
          className={({ isActive }) =>
            `block px-4 py-3 rounded-full text-sm font-medium ${
              isActive ? 'bg-beige text-charcoal' : 'text-charcoal hover:bg-white'
            }`
          }
        >
          {label}
        </NavLink>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <NavLink
          to={to}
          end={end}
          onClick={closeMenu}
          className={({ isActive }) =>
            `flex-1 block px-4 py-3 rounded-full text-sm font-medium ${
              isActive ? 'bg-beige text-charcoal' : 'text-charcoal hover:bg-white'
            }`
          }
        >
          {label}
        </NavLink>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          className="w-11 h-11 rounded-full flex items-center justify-center text-charcoal hover:bg-white shrink-0"
          aria-label="Toggle dropdown"
          aria-expanded={isOpen}
        >
          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col pl-4 ml-6 border-l border-border/60 gap-1 mb-2 overflow-hidden"
          >
            {dropdown.map(d => (
              <li key={d.to}>
                <NavLink
                  to={d.to}
                  end={d.end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-full text-sm font-medium ${
                      isActive ? 'text-forest font-semibold' : 'text-charcoal/70 hover:text-charcoal'
                    }`
                  }
                >
                  {d.label}
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

function AuthSpinner() {
  return (
    <div
      className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 border-forest/20 border-t-forest animate-spin"
      aria-label="Loading account"
    />
  );
}

export default function Header({ className = '' }) {
  const { count } = useCart();
  const { openSearch } = useSearch();
  const { isAuthenticated, loading } = useAuth();
  const { data: header } = usePageSection('global', 'header', {
    logo: '/images/cropped-cropped-gooo-1-1.png',
    brandName: 'raafortagro',
    searchPlaceholder: 'Search products…',
    nav: DEFAULT_NAV,
  });
  const nav = (() => {
    const items = header.nav?.filter?.((n) => n?.label?.trim());
    return items?.length ? items : DEFAULT_NAV;
  })();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const searchLabel = header.searchPlaceholder || 'Search products…';

  const openSearchFromMenu = () => {
    setOpen(false);
    openSearch();
  };

  const searchTrigger = (
    <button
      type="button"
      onClick={openSearch}
      className="relative flex items-center gap-2 w-full md:w-[168px] lg:w-[200px] h-11 pl-5 pr-3 rounded-full bg-white border border-border text-sm text-text-muted/90 hover:border-forest/30 transition-colors text-left"
    >
      <span className="flex-1 truncate">{searchLabel}</span>
      <Search className="w-[18px] h-[18px] text-charcoal/55 shrink-0" strokeWidth={1.75} />
    </button>
  );

  const authDesktop = loading ? <AuthSpinner /> : isAuthenticated ? <UserMenu /> : <AuthButtons />;
  const authMobile = loading ? <AuthSpinner /> : isAuthenticated ? <UserMenu compact /> : <AuthButtons compact />;

  const mobileMenu =
    typeof document !== 'undefined' &&
    createPortal(
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-[200] bg-charcoal/50 lg:hidden border-none cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            <motion.nav
              role="dialog"
              aria-modal="true"
              className="fixed inset-y-0 right-0 z-[201] w-full max-w-[300px] bg-cream lg:hidden shadow-2xl flex flex-col safe-top"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
            >
              <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
                <span className="font-display font-bold text-charcoal">Menu</span>
                <button type="button" className="touch-target" onClick={closeMenu} aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 border-b border-border">
                <button
                  type="button"
                  onClick={openSearchFromMenu}
                  className="relative flex items-center gap-2 w-full pl-5 pr-3 py-2.5 rounded-full bg-white border border-border text-sm text-text-muted/90 text-left"
                >
                  <span className="flex-1 truncate">{searchLabel}</span>
                  <Search className="w-[18px] h-[18px] text-charcoal/55 shrink-0" strokeWidth={1.75} />
                </button>
              </div>
              <ul className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1">
                {nav.map((item) => (
                  <MobileNavItem key={item.to} item={item} closeMenu={closeMenu} />
                ))}
                {isAuthenticated && (
                  <>
                    <li>
                      <NavLink
                        to="/account"
                        onClick={closeMenu}
                        className="block px-4 py-3 rounded-full text-sm font-medium text-charcoal hover:bg-white"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/account?tab=orders"
                        onClick={closeMenu}
                        className="block px-4 py-3 rounded-full text-sm font-medium text-charcoal hover:bg-white"
                      >
                        Orders
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
              <div className="p-4 border-t border-border safe-bottom space-y-3">
                {!isAuthenticated && !loading && <AuthButtons stacked onNavigate={closeMenu} />}
                {isAuthenticated && !loading && (
                  <Button to="/shop" variant="forest" className="w-full justify-center" onClick={closeMenu}>
                    Browse Shop
                  </Button>
                )}
                {!isAuthenticated && !loading && (
                  <Button to="/shop" variant="ghost" className="w-full justify-center" onClick={closeMenu}>
                    Browse Shop
                  </Button>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>,
      document.body,
    );

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 safe-top bg-cream/95 backdrop-blur-md ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex lg:hidden items-center justify-between h-14 gap-2">
            <Link to="/" className="flex items-center gap-2 min-w-0 shrink-0">
              <span className="w-9 h-9 rounded-full bg-beige-soft border border-border/60 flex shrink-0 overflow-hidden">
                <img src={header.logo} alt={header.brandName} className="w-full h-full object-cover" />
              </span>
              <span className="font-display font-semibold text-base text-charcoal lowercase tracking-tight truncate">
                {header.brandName}
              </span>
            </Link>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={openSearch}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-border text-charcoal"
                aria-label="Search"
              >
                <Search className="w-[17px] h-[17px]" strokeWidth={1.75} />
              </button>
              <Link
                to="/cart"
                className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-border text-charcoal"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[17px] h-[17px]" strokeWidth={1.75} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-beige text-charcoal text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                    {count}
                  </span>
                )}
              </Link>
              {authMobile}
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-border touch-target shrink-0"
                onClick={() => setOpen(!open)}
                aria-label="Menu"
              >
                {open ? <X className="w-5 h-5 text-charcoal" /> : <Menu className="w-5 h-5 text-charcoal" />}
              </button>
            </div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-[auto_1fr_auto] items-center gap-6 xl:gap-10 py-3">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <span className="w-11 h-11 rounded-full bg-beige-soft border border-border/70 flex overflow-hidden shrink-0">
                <img src={header.logo} alt={header.brandName} className="w-full h-full object-cover" />
              </span>
              <span className="font-display font-semibold text-[1.05rem] text-charcoal lowercase tracking-tight">
                {header.brandName}
              </span>
            </Link>

            <nav
              className="justify-self-center flex items-center gap-0.5 px-1.5 h-11 rounded-full bg-white border border-border shadow-[0_1px_2px_rgba(28,28,28,0.04)]"
              aria-label="Main"
            >
              {nav.map((item) => (
                item.dropdown ? <NavDropdownPill key={item.to} {...item} /> : <NavPillLink key={item.to} {...item} />
              ))}
            </nav>

            <div className="flex items-center gap-2.5 justify-self-end shrink-0">
              {searchTrigger}
              <Link
                to="/cart"
                className="relative w-11 h-11 flex items-center justify-center rounded-full bg-white border border-border text-charcoal hover:bg-beige-soft/50 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.75} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-beige text-charcoal text-[10px] font-bold min-w-[17px] h-[17px] flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </Link>
              {authDesktop}
            </div>
          </div>
        </div>
      </header>
      <div className={`h-14 lg:h-[76px] shrink-0 ${className}`} aria-hidden="true" />
      {mobileMenu}
    </>
  );
}
