import axios from 'axios';
import { GroceryItem, ItemResponse, ItemsResponse } from '@smartcart/shared';

const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },


  // Get specific item
  getItems: async (): Promise<GroceryItem[]> => {
    const response = await apiClient.get<ItemsResponse>(`/items/`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch item');
  },

  getItem: async (item_id: string): Promise<GroceryItem> => {
    const response = await apiClient.get<ItemResponse>(`/items/${item_id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch item');
  },

};