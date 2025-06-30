import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryApiRequests from '../apis/category';
import toast from 'react-hot-toast';

/**
 * Hook for fetching all categories
 * @returns {Object} Query result with categories data
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryApiRequests.getCategories();
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to fetch categories');
    }
  });
};

/**
 * Hook for fetching a single category by ID
 * @param {string} id - The ID of the category to fetch
 * @returns {Object} Query result with category data
 */
export const useCategory = (id) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await categoryApiRequests.getCategory(id);
      return response.data;
    },
    enabled: !!id,
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to fetch category details');
    }
  });
};

/**
 * Hook for creating a new category
 * @returns {Object} Mutation object for creating categories
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryData) => {
      const response = await categoryApiRequests.createCategory(categoryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to create category');
    }
  });
};

/**
 * Hook for updating an existing category
 * @returns {Object} Mutation object for updating categories
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await categoryApiRequests.updateCategory(data, id);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['categories']);
      queryClient.invalidateQueries(['categories', variables.id]);
      toast.success('Category updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to update category');
    }
  });
};

/**
 * Hook for deleting a category
 * @returns {Object} Mutation object for deleting categories
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await categoryApiRequests.deleteCategory(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.reason || error.message || 'Failed to delete category');
    }
  });
};