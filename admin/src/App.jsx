import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoute from './components/AdminRoute.jsx';
import AdminLayout from './pages/AdminLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminContent from './pages/AdminContent.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import AdminBlog from './pages/AdminBlog.jsx';
import AdminInquiries from './pages/AdminInquiries.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminReviews from './pages/AdminReviews.jsx';
import { ThemeProvider } from './components/ThemeProvider.jsx';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="raafort-admin-theme">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
