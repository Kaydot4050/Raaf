import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import AdminToaster from './components/AdminToaster.jsx';
import './tailwind.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <AdminToaster />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
