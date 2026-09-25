import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import DashboardLayout from '../components/layout/DashboardLayout'

// Auth
import Auth from '../pages/auth/Auth'
import ForgotPassword from '../pages/auth/ForgotPassword'

// Customer
import Home from '../pages/customer/Home'
import ProductListing from '../pages/customer/ProductListing'
import ProductDetail from '../pages/customer/ProductDetail'
import Cart from '../pages/customer/Cart'
import Checkout from '../pages/customer/Checkout'
import OrderHistory from '../pages/customer/OrderHistory'
import Wishlist from '../pages/customer/Wishlist'
import AddressManagement from '../pages/customer/AddressManagement'
import Profile from '../pages/customer/Profile'
import About from '../pages/customer/About'
import Categories from '../pages/customer/Categories'

// Vendor
import VendorDashboard from '../pages/vendor/Dashboard'
import StoreProfile from '../pages/vendor/StoreProfile'
import ProductManagement from '../pages/vendor/ProductManagement'
import AddProduct from '../pages/vendor/AddProduct'
import OrderManagement from '../pages/vendor/OrderManagement'
import Analytics from '../pages/vendor/Analytics'

// Admin
import AdminDashboard from '../pages/admin/Dashboard'
import UserManagement from '../pages/admin/UserManagement'
import VendorManagement from '../pages/admin/VendorManagement'
import CategoryManagement from '../pages/admin/CategoryManagement'
import PlatformAnalytics from '../pages/admin/PlatformAnalytics'
import OrderMonitoring from '../pages/admin/OrderMonitoring'


const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/addresses" element={<AddressManagement />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Vendor Dashboard */}
      <Route path="/vendor" element={<DashboardLayout role="vendor" />}>
        <Route index element={<VendorDashboard />} />
        <Route path="store" element={<StoreProfile />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Admin Dashboard */}
      <Route path="/admin" element={<DashboardLayout role="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="vendors" element={<VendorManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="analytics" element={<PlatformAnalytics />} />
        <Route path="orders" element={<OrderMonitoring />} />
      </Route>
    </Routes>
  )
}

export default AppRouter