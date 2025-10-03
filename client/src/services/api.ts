import axios from 'axios';

// Usar Netlify Functions para autenticação
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Usar Netlify Functions
  : 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/tesouraria/login';
    }
    return Promise.reject(error);
  }
);

// API de autenticação usando Netlify Functions
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/.netlify/functions/auth-login', { username, password }),
  
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  
  verifyToken: () =>
    api.post('/.netlify/functions/auth-verify', { token: localStorage.getItem('token') }),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

// API de membros usando Netlify Functions
export const membersAPI = {
  getMembers: (params?: any) =>
    api.get('/.netlify/functions/members', { params }),
  
  getMember: (id: number) =>
    api.get(`/.netlify/functions/members/${id}`),
  
  createMember: (data: any) =>
    api.post('/.netlify/functions/members', data),
  
  updateMember: (id: number, data: any) =>
    api.put(`/.netlify/functions/members/${id}`, data),
  
  deleteMember: (id: number) =>
    api.delete(`/.netlify/functions/members/${id}`),
  
  getMemberStats: (useTestRoute = false) =>
    api.get(useTestRoute ? '/.netlify/functions/members/test/stats' : '/.netlify/functions/members/stats/overview'),
  
  getMemberContributions: (id: number, params?: any) =>
    api.get(`/.netlify/functions/members/${id}/contributions`, { params }),
};

// API de transações usando Netlify Functions
export const transactionsAPI = {
  getTransactions: (params?: any) =>
    api.get('/.netlify/functions/transactions', { params }),
  
  getTransaction: (id: number) =>
    api.get(`/.netlify/functions/transactions/${id}`),
  
  createTransaction: (data: any) =>
    api.post('/.netlify/functions/transactions', data),
  
  updateTransaction: (id: number, data: any) =>
    api.put(`/.netlify/functions/transactions/${id}`, data),
  
  deleteTransaction: (id: number) =>
    api.delete(`/.netlify/functions/transactions/${id}`),
  
  getSummary: (useTestRoute = false) =>
    api.get(useTestRoute ? '/.netlify/functions/financial-summary/test/summary' : '/.netlify/functions/financial-summary'),
  
  getByCategory: (params?: any) =>
    api.get('/.netlify/functions/transactions/summary/by-category', { params }),
  
  getCashFlow: (params?: any) =>
    api.get('/.netlify/functions/transactions/summary/cash-flow', { params }),
};

// API de categorias usando Netlify Functions
export const categoriesAPI = {
  getCategories: (params?: any) =>
    api.get('/.netlify/functions/categories', { params }),
  
  getCategory: (id: number) =>
    api.get(`/.netlify/functions/categories/${id}`),
  
  createCategory: (data: any) =>
    api.post('/.netlify/functions/categories', data),
  
  updateCategory: (id: number, data: any) =>
    api.put(`/.netlify/functions/categories/${id}`, data),
  
  deleteCategory: (id: number) =>
    api.delete(`/.netlify/functions/categories/${id}`),
  
  getCategoryStats: (params?: any) =>
    api.get('/.netlify/functions/categories/stats/overview', { params }),
};

// API de Usuários
export const usersAPI = {
  getUsers: () =>
    api.get('/users'),
  
  createUser: (data: any) =>
    api.post('/users', data),
  
  deleteUser: (id: number) =>
    api.delete(`/users/${id}`), // Adicionado
};

// API de relatórios
export const reportsAPI = {
  getMonthlyBalance: (year: number, month: number) =>
    api.get('/reports/monthly-balance', { params: { year, month } }),
  
  getYearlyBalance: (year: number) =>
    api.get('/reports/yearly-balance', { params: { year } }),
  
  getMemberContributions: (params?: any) =>
    api.get('/reports/member-contributions', { params }),
  
  getIncomeByCategory: (params?: any) =>
    api.get('/reports/income-by-category', { params }),
  
  getExpenseByCategory: (params?: any) =>
    api.get('/reports/expense-by-category', { params }),
  
  getCashFlow: (params?: any) =>
    api.get('/reports/cash-flow', { params }),
  
  getTopContributors: (params?: any) =>
    api.get('/reports/top-contributors', { params }),
};

export default api;
