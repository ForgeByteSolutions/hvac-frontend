import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.157:8000/api/hvac';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const HvacAPI = {
  // Agentic recommendation API
  recommend: async (conversation) => {
    const response = await apiClient.post('/recommend', { conversation });
    return response.data;
  },

  // Regular browse
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/products${params ? `?${params}` : ''}`);
    return response.data;
  },

  // Specific product
  getProduct: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get compatible supplies
  getCompatibleSupplies: async (id) => {
    const response = await apiClient.get(`/products/${id}/supplies`);
    return response.data;
  },

  // Explain single product
  explainBrowse: async (product) => {
    const response = await apiClient.post('/browse/explain', { product });
    return response.data;
  },

  // Explain recommendations
  explainRecommendation: async (payload) => {
    const response = await apiClient.post('/explain-recommendation', payload);
    return response.data;
  },

  // Analyze cart for upsells
  analyzeCart: async (cartItems) => {
    const response = await apiClient.post('/cart/analyze', {
      cart_items: cartItems
    });
    return response.data;
  }
};
