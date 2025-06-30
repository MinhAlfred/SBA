import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated() ? children : <Navigate to={ROUTES.LOGIN} />;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} />;
  }
  
  if (!isAdmin()) {
    return <Navigate to={ROUTES.HOME} />;
  }
  
  return children;
};