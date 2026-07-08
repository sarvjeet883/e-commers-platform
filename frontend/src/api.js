import axios from 'axios';

// Backend base URL — set VITE_API_URL in frontend/.env to override
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT (if logged in) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const handleError = (error, fallbackMessage) => {
  if (error.response) {
    // The backend sent a response with an error status
    throw new Error(error.response.data.message || fallbackMessage);
  } else if (error.request) {
    // No response was received from the backend
    throw new Error('No response received from server');
  } else {
    throw new Error('An unexpected error occurred');
  }
};

export const signup = async (userData) => {
  try {
    const response = await api.post('/signup', userData);
    return response.data;
  } catch (error) {
    handleError(error, 'An error occurred during signup');
  }
};

export const login = async (userData) => {
  try {
    const response = await api.post('/login', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    handleError(error, 'An error occurred during login');
  }
};

// Place an order after UPI payment (requires login)
export const placeOrder = async (orderData) => {
  try {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  } catch (error) {
    handleError(error, 'An error occurred while placing the order');
  }
};

// Fetch the logged-in user's orders
export const getMyOrders = async () => {
  try {
    const response = await api.get('/api/orders/my');
    return response.data;
  } catch (error) {
    handleError(error, 'An error occurred while fetching orders');
  }
};

// ---------- Products (public read, admin write) ----------

export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

export const createProduct = async (data) => {
  try {
    const response = await api.post('/api/products', data);
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to create product');
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await api.put(`/api/products/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to update product');
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to delete product');
  }
};

// ---------- Admin ----------

export const getAdminStats = async () => {
  try {
    const response = await api.get('/api/admin/stats');
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to load dashboard stats');
  }
};

export const getAllOrders = async () => {
  try {
    const response = await api.get('/api/admin/orders');
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to load orders');
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/api/admin/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to update order status');
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/admin/users');
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to load users');
  }
};

export default api;
