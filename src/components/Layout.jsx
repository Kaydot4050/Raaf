import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import WhatsAppFloat from './WhatsAppFloat.jsx';
import SearchCommand from './SearchCommand.jsx';
export default function Layout() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-cream overflow-x-hidden">
      <SearchCommand />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
