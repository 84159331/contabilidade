import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API de autenticação
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  
  verifyToken: () =>
    api.get('/auth/verify'),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

// API de membros
export const membersAPI = {
  getMembers: (params?: any) =>
    api.get('/members', { params }),
  
  getMember: (id: number) =>
    api.get(`/members/${id}`),
  
  createMember: (data: any) =>
    api.post('/members', data),
  
  updateMember: (id: number, data: any) =>
    api.put(`/members/${id}`, data),
  
  deleteMember: (id: number) =>
    api.delete(`/members/${id}`),
  
  getMemberStats: (useTestRoute = false) =>
    api.get(useTestRoute ? '/members/test/stats' : '/members/stats/overview'),
  
  getMemberContributions: (id: number, params?: any) =>
    api.get(`/members/${id}/contributions`, { params }),
};

// API de transações
export const transactionsAPI = {
  getTransactions: (params?: any) =>
    api.get('/transactions', { params }),
  
  getTransaction: (id: number) =>
    api.get(`/transactions/${id}`),
  
  createTransaction: (data: any) =>
    api.post('/transactions', data),
  
  updateTransaction: (id: number, data: any) =>
    api.put(`/transactions/${id}`, data),
  
  deleteTransaction: (id: number) =>
    api.delete(`/transactions/${id}`),
  
  getSummary: (useTestRoute = false) =>
    api.get(useTestRoute ? '/transactions/test/summary' : '/transactions/summary/overview'),
  
  getByCategory: (params?: any) =>
    api.get('/transactions/summary/by-category', { params }),
  
  getCashFlow: (params?: any) =>
    api.get('/transactions/summary/cash-flow', { params }),
};

// API de categorias
export const categoriesAPI = {
  getCategories: (params?: any) =>
    api.get('/categories', { params }),
  
  getCategory: (id: number) =>
    api.get(`/categories/${id}`),
  
  createCategory: (data: any) =>
    api.post('/categories', data),
  
  updateCategory: (id: number, data: any) =>
    api.put(`/categories/${id}`, data),
  
  deleteCategory: (id: number) =>
    api.delete(`/categories/${id}`),
  
  getCategoryStats: (params?: any) =>
    api.get('/categories/stats/overview', { params }),
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
