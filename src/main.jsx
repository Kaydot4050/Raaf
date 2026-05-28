import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AccountProvider } from './context/AccountContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { SearchProvider } from './context/SearchContext.jsx';
import { ContentProvider } from './context/ContentContext.jsx';
import './tailwind.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <ToastProvider>
          <AuthProvider>
            <ContentProvider>
              <AccountProvider>
                <CartProvider>
                  <App />
                </CartProvider>
              </AccountProvider>
            </ContentProvider>
          </AuthProvider>
        </ToastProvider>
      </SearchProvider>
    </BrowserRouter>
  </StrictMode>,
);
