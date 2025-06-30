import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import orderApiRequests from '../apis/order';
import toast from 'react-hot-toast';
import { navigateTo } from '../utils/navigation';
import { ROUTES } from '../constants';

/**
 * Hook for fetching all orders
 * @returns {Object} Query result with orders data
 */
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await orderApiRequests.getOrders();
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to fetch orders');
    }
  });
};

/**
 * Hook for fetching a single order by ID
 * @param {string} id - The ID of the order to fetch
 * @returns {Object} Query result with order data
 */
export const useOrder = (id) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await orderApiRequests.getOrder(id);
      return response.data;
    },
    enabled: !!id,
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to fetch order details');
    }
  });
};

/**
 * Hook for fetching orders for the current user
 * @returns {Object} Query result with user's orders data
 */
export const useUserOrders = () => {
  return useQuery({
    queryKey: ['orders', 'user'],
    queryFn: async () => {
      const response = await orderApiRequests.getUserOrder();
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to fetch your orders');
    }
  });
};

/**
 * Hook for creating a new order
 * @returns {Object} Mutation object for creating orders
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData) => {
      const response = await orderApiRequests.createOrder(orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orders', 'user']);
      toast.success('Order created successfully!');
      navigateTo(ROUTES.HOME);
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to create order');
    }
  });
};

/**
 * Hook for updating an existing order
 * @returns {Object} Mutation object for updating orders
 */
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await orderApiRequests.updateOrder(data, id);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orders', variables.id]);
      queryClient.invalidateQueries(['orders', 'user']);
      toast.success('Order updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to update order');
    }
  });
};

/**
 * Hook for marking an order as successful
 * @returns {Object} Mutation object for completing orders
 */
export const useCompleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderId) => {
      const response = await orderApiRequests.successOrder(orderId);
      return response.data;
    },
    onSuccess: (orderId) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orders', orderId]);
      queryClient.invalidateQueries(['orders', 'user']);
      toast.success('Order marked as completed!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to complete order');
    }
  });
};

/**
 * Hook for deleting an order
 * @returns {Object} Mutation object for deleting orders
 */
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await orderApiRequests.deleteOrder(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orders', 'user']);
      toast.success('Order deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to delete order');
    }
  });
};