import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, LogOut } from 'lucide-react';
import { ACCOUNT_NAV, SECTION_MAP } from '../components/account/accountSections.jsx';
import { useAccount } from '../context/AccountContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isDesktop;
}

function profileInitials(profile) {
  const a = profile.firstName?.[0] || '';
  const b = profile.lastName?.[0] || '';
  return (a + b).toUpperCase() || 'R';
}

function LogoutButton({ className = '' }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully');
    navigate('/');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-700 bg-white border border-border hover:bg-red-50 hover:border-red-200 transition-colors touch-target ${className}`}
    >
      <LogOut className="w-4 h-4 shrink-0" />
      Log out
    </button>
  );
}

export default function Account() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';
  const ActiveSection = SECTION_MAP[tab] || SECTION_MAP.dashboard;
  const activeNav = ACCOUNT_NAV.find((item) => item.id === tab) ?? ACCOUNT_NAV[0];
  const { profile } = useAccount();
  const { user } = useAuth();
  const isDesktop = useIsDesktop();
  const [mobileDetail, setMobileDetail] = useState(() => tab !== 'dashboard');

  useEffect(() => {
    if (isDesktop) {
      setMobileDetail(false);
      return;
    }
    setMobileDetail(tab !== 'dashboard');
  }, [isDesktop, tab]);

  const setTab = (id) => {
    setSearchParams(id === 'dashboard' ? {} : { tab: id });
    if (!isDesktop) setMobileDetail(true);
  };

  const backToMenu = () => {
    setMobileDetail(false);
    setSearchParams({});
  };

  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
    user?.name ||
    'Farmer';

  return (
    <div className="bg-beige-soft/40 min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 py-6 sm:py-12 pb-16">
        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <nav className="flex flex-col gap-2">
              {ACCOUNT_NAV.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSearchParams(id === 'dashboard' ? {} : { tab: id })}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors touch-target w-full ${
                    tab === id
                      ? 'bg-forest text-white shadow-sm'
                      : 'bg-white text-charcoal border border-border hover:border-forest/30'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-border">
              <LogoutButton />
            </div>
          </aside>

          {!isDesktop && !mobileDetail && (
            <div className="lg:hidden space-y-5">
              <h1 className="font-display text-2xl font-bold text-charcoal">My account</h1>

              <div className="bg-white rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-forest/10 text-forest font-display font-bold text-lg flex items-center justify-center shrink-0">
                  {profileInitials(profile)}
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-charcoal truncate">{displayName}</p>
                  <p className="text-sm text-text-muted truncate">
                    {profile.email || profile.phone || 'Update your profile details'}
                  </p>
                </div>
              </div>

              <nav className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden divide-y divide-border/70">
                {ACCOUNT_NAV.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-beige-soft/60 transition-colors touch-target"
                  >
                    <span className="w-10 h-10 rounded-xl bg-beige-soft flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-forest" />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-charcoal">{label}</span>
                    <ChevronRight className="w-5 h-5 text-text-muted shrink-0" />
                  </button>
                ))}
              </nav>

              <LogoutButton className="mt-4" />
            </div>
          )}

          {(isDesktop || mobileDetail) && (
            <div className="min-w-0">
              {!isDesktop && (
                <div className="lg:hidden flex items-center gap-3 mb-5">
                  <button
                    type="button"
                    onClick={backToMenu}
                    className="flex w-11 h-11 rounded-full bg-white border border-border text-charcoal items-center justify-center shadow-sm hover:bg-beige-soft transition-colors shrink-0"
                    aria-label="Back to account menu"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="font-display text-xl font-bold text-charcoal">{activeNav.label}</h1>
                </div>
              )}
              <ActiveSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
