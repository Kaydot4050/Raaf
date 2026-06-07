import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import WhatsAppFloat from './WhatsAppFloat.jsx';
import SearchCommand from './SearchCommand.jsx';
import FloatingWeather from './FloatingWeather.jsx';

const AUTH_PAGES = new Set(['/login', '/register']);

export default function Layout() {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PAGES.has(pathname);
  const showFloatingWidgets = !isAuthPage;
  const hideOnDesktopAuth = isAuthPage ? 'lg:hidden' : '';

  return (
    <div className={`min-h-screen min-h-[100dvh] flex flex-col bg-cream overflow-x-hidden ${isAuthPage ? 'lg:overflow-hidden' : ''}`}>
      <SearchCommand />
      <Header className={hideOnDesktopAuth} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer className={hideOnDesktopAuth} />
      {showFloatingWidgets && <WhatsAppFloat />}
      {showFloatingWidgets && <FloatingWeather />}
    </div>
  );
}
