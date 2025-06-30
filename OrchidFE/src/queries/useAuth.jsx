import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authApiRequests from '../apis/auth';
import { navigateTo } from '../utils/navigation';
import { ROUTES, ROLES } from '../constants';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Hook for handling login mutation
 * @returns {Object} Login mutation object
 */
export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    const { setUser } = useAuth();
    return useMutation({
        mutationFn: async (credentials) => {
            const response = await authApiRequests.login(credentials);
            return response.data.data;
        },
        onSuccess: (data) => {
            // Store token in localStorage
            const { token, user } = data;
            if (token) {
                localStorage.setItem('token', token);
            }
            setUser(user);
            queryClient.invalidateQueries(['currentUser']);
            toast.success('Login successful!');
            navigateTo(user?.roleName === ROLES.ADMIN ? ROUTES.ORCHID_LIST : ROUTES.HOME);

            
        },
        onError: (error) => {
            toast.error(error.response?.data?.reason || error.message || 'Login failed');
        }
    });
}

/**
 * Hook for handling registration mutation
 * @returns {Object} Registration mutation object
 */
export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: async (userData) => {
            const response = await authApiRequests.register(userData);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Registration successful!');
            navigateTo(ROUTES.LOGIN);
        },
        onError: (error) => {
            toast.error(error.response?.data?.reason || error.message || 'Registration failed');
        }
    });
}

/**
 * Hook for getting the current authenticated user
 * Uses React Query to fetch user data and updates AuthContext
 * @returns {Object} Current user query object with user data and authentication status
 */
export const useCurrentUser = () => {
    const token = localStorage.getItem('token');
    
    // Use React Query to fetch the current user
    const query = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            if (!token) return null;
            const response = await authApiRequests.getCurrentUser();
            return response.data.data;
        },
          onError: (error) => {
            localStorage.removeItem('token');
            console.error('Current user fetch failed:', error);
          },
          refetchOnWindowFocus: false,
          enabled: !!token
    });
    
    return {
        user: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch
    };
}

