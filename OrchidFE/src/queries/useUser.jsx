import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authApiRequests from '../apis/auth';
import roleApiRequests from '../apis/role';
import toast from 'react-hot-toast';

/**
 * Hook for fetching all users
 * @returns {Object} Users query object
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await authApiRequests.getUsers();
      return response.data.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to fetch users');
    }
  });
};

/**
 * Hook for fetching a single user by ID
 * @param {string} id - User ID
 * @returns {Object} User query object
 */
export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await authApiRequests.getUser(id);
      return response.data.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to fetch user');
    },
    enabled: !!id // Only run the query if an ID is provided
  });
};


/**
 * Hook for updating an existing user
 * @returns {Object} Update user mutation object
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userData, id }) => {
      const response = await authApiRequests.updateUser(userData, id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to update user');
    }
  });
};

/**
 * Hook for deleting a user
 * @returns {Object} Delete user mutation object
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await authApiRequests.deleteUser(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to delete user');
    }
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await roleApiRequests.getRoles();
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to fetch roles');
    }
  });
};
