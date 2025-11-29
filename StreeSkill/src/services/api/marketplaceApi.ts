// Marketplace/Sell API Service
import { API_CONFIG, USE_MOCK_API, getHeaders } from './config';
import { ApiResponse, Product, Order, Earnings, Transaction } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from './authApi';

const PRODUCTS_KEY = '@streeskill_products';
const ORDERS_KEY = '@streeskill_orders';

// Mock data
const MOCK_PRODUCTS: Product[] = [
  { id: 'prod_1', userId: 'current_user', title: 'Handmade Embroidered Cushion Cover', description: 'Beautiful floral embroidery on cotton', price: 450, images: ['https://picsum.photos/300/300?random=101'], category: 'Home Decor', status: 'active', createdAt: '2024-11-20T10:00:00Z' },
  { id: 'prod_2', userId: 'current_user', title: 'Mango Pickle (500g)', description: 'Traditional homemade mango pickle', price: 180, images: ['https://picsum.photos/300/300?random=102'], category: 'Food', status: 'active', createdAt: '2024-11-18T14:30:00Z' },
];

const MOCK_ORDERS: Order[] = [
  { id: 'order_1', productId: 'prod_1', productTitle: 'Handmade Embroidered Cushion Cover', buyerId: 'buyer_1', buyerName: 'Ritu Sharma', amount: 450, status: 'delivered', createdAt: '2024-11-25T09:00:00Z' },
  { id: 'order_2', productId: 'prod_2', productTitle: 'Mango Pickle (500g)', buyerId: 'buyer_2', buyerName: 'Kavita Patel', amount: 180, status: 'shipped', createdAt: '2024-11-27T11:30:00Z' },
];

const MOCK_EARNINGS: Earnings = {
  totalEarnings: 12500,
  thisMonth: 3200,
  pendingPayouts: 850,
  completedOrders: 28,
  recentTransactions: [
    { id: 'txn_1', type: 'sale', amount: 450, description: 'Cushion Cover sold', createdAt: '2024-11-25T09:00:00Z' },
    { id: 'txn_2', type: 'payout', amount: 2000, description: 'Bank transfer', createdAt: '2024-11-20T15:00:00Z' },
    { id: 'txn_3', type: 'sale', amount: 180, description: 'Pickle sold', createdAt: '2024-11-18T14:30:00Z' },
  ],
};

export const marketplaceApi = {
  // GET /products - List user's products
  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const productsStr = await AsyncStorage.getItem(PRODUCTS_KEY);
      const products = productsStr ? JSON.parse(productsStr) : MOCK_PRODUCTS;
      return { success: true, data: products };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/products`, { headers: getHeaders(token || undefined) });
    return response.json();
  },

  // POST /products - Create product
  createProduct: async (data: Omit<Product, 'id' | 'userId' | 'status' | 'createdAt'>): Promise<ApiResponse<Product>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        userId: 'current_user',
        ...data,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      const productsStr = await AsyncStorage.getItem(PRODUCTS_KEY);
      const products = productsStr ? JSON.parse(productsStr) : MOCK_PRODUCTS;
      products.unshift(newProduct);
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      
      return { success: true, data: newProduct, message: 'Product listed successfully' };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(token || undefined),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // PUT /products/:id - Update product
  updateProduct: async (productId: string, data: Partial<Product>): Promise<ApiResponse<Product>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const productsStr = await AsyncStorage.getItem(PRODUCTS_KEY);
      const products = productsStr ? JSON.parse(productsStr) : MOCK_PRODUCTS;
      const index = products.findIndex((p: Product) => p.id === productId);
      
      if (index >= 0) {
        products[index] = { ...products[index], ...data };
        await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        return { success: true, data: products[index], message: 'Product updated' };
      }
      return { success: false, error: 'Product not found' };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: getHeaders(token || undefined),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // DELETE /products/:id - Remove product
  deleteProduct: async (productId: string): Promise<ApiResponse<null>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const productsStr = await AsyncStorage.getItem(PRODUCTS_KEY);
      const products = productsStr ? JSON.parse(productsStr) : MOCK_PRODUCTS;
      const filtered = products.filter((p: Product) => p.id !== productId);
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
      return { success: true, message: 'Product removed' };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(token || undefined),
    });
    return response.json();
  },

  // GET /orders - Get seller orders
  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const ordersStr = await AsyncStorage.getItem(ORDERS_KEY);
      const orders = ordersStr ? JSON.parse(ordersStr) : MOCK_ORDERS;
      return { success: true, data: orders };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/orders`, { headers: getHeaders(token || undefined) });
    return response.json();
  },

  // GET /earnings - Get earnings summary
  getEarnings: async (): Promise<ApiResponse<Earnings>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, data: MOCK_EARNINGS };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/earnings`, { headers: getHeaders(token || undefined) });
    return response.json();
  },
};
