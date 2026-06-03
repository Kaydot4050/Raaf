import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AccountProvider } from './context/AccountContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import GoogleAuthProvider from './components/auth/GoogleAuthProvider.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { SearchProvider } from './context/SearchContext.jsx';
import { ContentProvider } from './context/ContentContext.jsx';
import { ProductsProvider } from './context/ProductsContext.jsx';
import './tailwind.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <SearchProvider>
        <ToastProvider>
          <GoogleAuthProvider>
            <AuthProvider>
              <ContentProvider>
                <ProductsProvider>
                  <AccountProvider>
                    <CartProvider>
                      <App />
                    </CartProvider>
                  </AccountProvider>
                </ProductsProvider>
              </ContentProvider>
            </AuthProvider>
          </GoogleAuthProvider>
        </ToastProvider>
      </SearchProvider>
    </BrowserRouter>
  </StrictMode>,
);
