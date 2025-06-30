import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import orchidApiRequests from '../apis/orchid';
import toast from 'react-hot-toast';
import { navigateTo } from '../utils/navigation';
import { ROUTES } from '../constants';

/**
 * Hook for fetching all orchids
 * @returns {Object} Query result with orchids data
 */
export const useOrchids = () => {
  return useQuery({
    queryKey: ['orchids'],
    queryFn: async () => {
      const response = await orchidApiRequests.getOrchids();
      return response.data;
    }, 
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to fetch orchids');
    }
  });
};

/**
 * Hook for fetching available orchids
 * @returns {Object} Query result with available orchids data
 */
export const useAvailableOrchids = () => {
  return useQuery({
    queryKey: ['orchids', 'available'],
    queryFn: async () => {
      const response = await orchidApiRequests.getAvailableOrchids();
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to fetch available orchids');
    }
  });
};

/**
 * Hook for fetching a single orchid by ID
 * @param {string} id - The ID of the orchid to fetch
 * @returns {Object} Query result with orchid data
 */
export const useOrchid = (id) => {
  return useQuery({
    queryKey: ['orchids', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await orchidApiRequests.getOrchid(id);
      return response.data;
    },
    enabled: !!id,
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to fetch orchid details');
    }
  });
};

/**
 * Hook for creating a new orchid
 * @returns {Object} Mutation object for creating orchids
 */
export const useCreateOrchid = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orchidData) => {
      const response = await orchidApiRequests.createOrchid(orchidData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orchids']);
      toast.success('Orchid created successfully!');
      navigateTo(ROUTES.ORCHID_LIST);
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to create orchid');
    }
  });
};

/**
 * Hook for updating an existing orchid
 * @returns {Object} Mutation object for updating orchids
 */
export const useUpdateOrchid = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await orchidApiRequests.updateOrchid(data, id);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['orchids']);
      queryClient.invalidateQueries(['orchids', variables.id]);
      toast.success('Orchid updated successfully!');
      navigateTo(ROUTES.ORCHID_LIST);
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to update orchid');
    }
  });
};

/**
 * Hook for deleting an orchid
 * @returns {Object} Mutation object for deleting orchids
 */
export const useDeleteOrchid = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await orchidApiRequests.deleteOrchid(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orchids']);
      toast.success('Orchid deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to delete orchid');
    }
  });
};