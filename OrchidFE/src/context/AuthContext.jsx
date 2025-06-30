import  { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useCurrentUser } from '../queries/useAuth';
import { navigateTo } from '../utils/navigation';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // Use the query hook to get user data and handle persistence
  const { user: queryUser, isLoading: loading, error } = useCurrentUser();
  
  // Update local state when query user changes
  useEffect(() => {
    if (queryUser) {
      setUser(queryUser);
    }
  }, [queryUser]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigateTo('/login');
  };
  
  // Check if user is authenticated
  const checkIsAuthenticated = () => !!localStorage.getItem('token');
  
  // Check if user is admin
  const checkIsAdmin = () => user && user.roleName === 'Admin';
  
  const value = {
    user,
    loading,
    logout: handleLogout,
    isAuthenticated: checkIsAuthenticated,
    isAdmin: checkIsAdmin,
    setUser // Add setUser so React Query hooks can update the user state
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};