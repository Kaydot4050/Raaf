import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Shipping from './pages/Shipping.jsx';
import Returns from './pages/Returns.jsx';
import Wholesale from './pages/Wholesale.jsx';
import FAQ from './pages/FAQ.jsx';
import TrackOrder from './pages/TrackOrder.jsx';
import Account from './pages/Account.jsx';
import NotFound from './pages/NotFound.jsx';
import UnderDevelopment from './pages/UnderDevelopment.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import GuestRoute from './components/auth/GuestRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="under-development" element={<UnderDevelopment />} />
      <Route path="login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogPost />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmation" element={<OrderConfirmation />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="returns" element={<Returns />} />
        <Route path="wholesale" element={<Wholesale />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="track-order" element={<TrackOrder />} />
        <Route path="account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
