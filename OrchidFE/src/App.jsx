import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

// Layout Components
import NavBar from './components/layout/NavBar';

// Auth Components
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';

// Orchid Components
import OrchidList from './features/orchids/OrchidList';
import HomeScreen from './features/orchids/HomeScreen';
import DetailOrchid from './features/orchids/DetailOrchid';
// import EditOrchid from './features/orchids/EditOrchid';

// User Components
import CategoryList from './features/categories/CategoryList';
import ManageUser from './features/users/ManageUser';

// Cart Component
import Cart from './features/cart/Cart';

// Order Components
import UserOrders from './features/orders/UserOrders';

// Route Protection
import { PrivateRoute, AdminRoute } from './components/common/PrivateRoute';

// Context Providers
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Constants
import { setNavigator } from './utils/navigation';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from './constants';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Gán navigate để dùng ở mọi nơi
    setNavigator(navigate);
  }, [navigate]);
  return (
    <AuthProvider>
      <CartProvider>
        <NavBar />
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          
          {/* Protected routes for all authenticated users */}
          <Route path={ROUTES.ORCHID_LIST} element={
            // <PrivateRoute>
              <OrchidList />
            // </PrivateRoute>
          } />
          <Route path={ROUTES.HOME} element={<HomeScreen />} />
          <Route path={`${ROUTES.ORCHID_DETAIL}/:id`} element={
            <PrivateRoute>
              <DetailOrchid />
            </PrivateRoute>
          } />
          
          {/* Protected routes for admin only */}
          <Route path={ROUTES.CATEGORY_MANAGEMENT} element={
            <AdminRoute>
              <CategoryList />
            </AdminRoute>
          } />
          {/* <Route path={`${ROUTES.EDIT_ORCHID}/:id`} element={
            <AdminRoute>
              <EditOrchid />
            </AdminRoute>
          } /> */}
          <Route path={ROUTES.USER_MANAGEMENT} element={
            <AdminRoute>
              <ManageUser />
            </AdminRoute>
          } />
          
          {/* Cart route */}
          <Route path={ROUTES.CART} element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } />
          
          {/* Orders route */}
          <Route path={ROUTES.ORDER_MANAGEMENT} element={
            <PrivateRoute>
              <UserOrders />
            </PrivateRoute>
          } />
          
          {/* Default route */}
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} />} />
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;