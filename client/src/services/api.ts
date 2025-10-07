// Serviço de API simplificado para funcionar sem Firebase por enquanto
import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
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

// Interceptor para lidar com respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/tesouraria/login';
    }
    return Promise.reject(error);
  }
);

// API para transações (usando dados locais por enquanto)
export const transactionsAPI = {
  getTransactions: async (params?: any) => {
    try {
      // Buscar dados do localStorage
      const savedTransactions = localStorage.getItem('transactions');
      const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
      
      return { data: { transactions, total: transactions.length } };
    } catch (error) {
      console.error('❌ Erro ao buscar transações:', error);
      return { data: { transactions: [], total: 0 } };
    }
  },

  createTransaction: async (data: any) => {
    try {
      console.log('💾 Salvando transação localmente:', data);
      
      const savedTransactions = localStorage.getItem('transactions');
      const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
      
      const newTransaction = {
        id: Date.now().toString(),
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      transactions.push(newTransaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      console.log('✅ Transação salva localmente');
      
      return {
        data: {
          message: 'Transação criada com sucesso',
          transaction: newTransaction
        }
      };
    } catch (error) {
      console.error('❌ Erro ao criar transação:', error);
      throw error;
    }
  },

  updateTransaction: async (id: string, data: any) => {
    try {
      const savedTransactions = localStorage.getItem('transactions');
      const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
      
      const index = transactions.findIndex((t: any) => t.id === id);
      if (index !== -1) {
        transactions[index] = { ...transactions[index], ...data, updated_at: new Date().toISOString() };
        localStorage.setItem('transactions', JSON.stringify(transactions));
      }
      
      return { data: { message: 'Transação atualizada com sucesso' } };
    } catch (error) {
      console.error('❌ Erro ao atualizar transação:', error);
      throw error;
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      const savedTransactions = localStorage.getItem('transactions');
      const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
      
      const filteredTransactions = transactions.filter((t: any) => t.id !== id);
      localStorage.setItem('transactions', JSON.stringify(filteredTransactions));
      
      return { data: { message: 'Transação deletada com sucesso' } };
    } catch (error) {
      console.error('❌ Erro ao deletar transação:', error);
      throw error;
    }
  },

  getSummary: async () => {
    try {
      const savedTransactions = localStorage.getItem('transactions');
      const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
      
      let totalIncome = 0;
      let totalExpense = 0;
      
      transactions.forEach((t: any) => {
        if (t.type === 'income') {
          totalIncome += parseFloat(t.amount) || 0;
        } else if (t.type === 'expense') {
          totalExpense += parseFloat(t.amount) || 0;
        }
      });
      
      return {
        data: {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
          transactionCount: transactions.length
        }
      };
    } catch (error) {
      console.error('❌ Erro ao calcular resumo:', error);
      return { data: { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0 } };
    }
  },

  getTransaction: async (id: string) => {
    const savedTransactions = localStorage.getItem('transactions');
    const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
    const transaction = transactions.find((t: any) => t.id === id);
    
    if (!transaction) {
      throw new Error('Transação não encontrada');
    }
    
    return { data: transaction };
  },

  getByCategory: async (params?: any) => {
    return { data: { transactions: [], total: 0 } };
  },

  getCashFlow: async (params?: any) => {
    return { data: { cashFlow: [] } };
  }
};

// API para membros (usando dados locais)
export const membersAPI = {
  getMembers: async () => {
    try {
      const savedMembers = localStorage.getItem('members');
      const members = savedMembers ? JSON.parse(savedMembers) : [];
      
      return { data: { members, total: members.length } };
    } catch (error) {
      console.error('❌ Erro ao buscar membros:', error);
      return { data: { members: [], total: 0 } };
    }
  },

  createMember: async (data: any) => {
    try {
      console.log('💾 Salvando membro localmente:', data);
      
      const savedMembers = localStorage.getItem('members');
      const members = savedMembers ? JSON.parse(savedMembers) : [];
      
      const newMember = {
        id: Date.now().toString(),
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      members.push(newMember);
      localStorage.setItem('members', JSON.stringify(members));
      
      console.log('✅ Membro salvo localmente');
      
      return {
        data: {
          message: 'Membro criado com sucesso',
          member: newMember
        }
      };
    } catch (error) {
      console.error('❌ Erro ao criar membro:', error);
      throw error;
    }
  },

  updateMember: async (id: string, data: any) => {
    try {
      const savedMembers = localStorage.getItem('members');
      const members = savedMembers ? JSON.parse(savedMembers) : [];
      
      const index = members.findIndex((m: any) => m.id === id);
      if (index !== -1) {
        members[index] = { ...members[index], ...data, updated_at: new Date().toISOString() };
        localStorage.setItem('members', JSON.stringify(members));
      }
      
      return { data: { message: 'Membro atualizado com sucesso' } };
    } catch (error) {
      console.error('❌ Erro ao atualizar membro:', error);
      throw error;
    }
  },

  deleteMember: async (id: string) => {
    try {
      const savedMembers = localStorage.getItem('members');
      const members = savedMembers ? JSON.parse(savedMembers) : [];
      
      const filteredMembers = members.filter((m: any) => m.id !== id);
      localStorage.setItem('members', JSON.stringify(filteredMembers));
      
      return { data: { message: 'Membro deletado com sucesso' } };
    } catch (error) {
      console.error('❌ Erro ao deletar membro:', error);
      throw error;
    }
  },

  getMember: async (id: string) => {
    const savedMembers = localStorage.getItem('members');
    const members = savedMembers ? JSON.parse(savedMembers) : [];
    const member = members.find((m: any) => m.id === id);
    
    if (!member) {
      throw new Error('Membro não encontrado');
    }
    
    return { data: member };
  },

  getMemberStats: async () => {
    return { data: { stats: {} } };
  },

  getMemberContributions: async (id: string, params?: any) => {
    return { data: { contributions: [] } };
  }
};

// API para categorias (usando dados locais)
export const categoriesAPI = {
  getCategories: async () => {
    try {
      const savedCategories = localStorage.getItem('categories');
      const categories = savedCategories ? JSON.parse(savedCategories) : [];
      
      // Se não há categorias salvas, criar algumas padrão
      if (categories.length === 0) {
        const defaultCategories = [
          { id: '1', name: 'Dízimos', type: 'income', description: 'Dízimos dos membros', color: '#10B981' },
          { id: '2', name: 'Ofertas', type: 'income', description: 'Ofertas especiais', color: '#3B82F6' },
          { id: '3', name: 'Utilidades', type: 'expense', description: 'Contas de água, luz, telefone', color: '#EF4444' },
          { id: '4', name: 'Manutenção', type: 'expense', description: 'Manutenção do prédio', color: '#F97316' }
        ];
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
        return { data: { categories: defaultCategories, total: defaultCategories.length } };
      }
      
      return { data: { categories, total: categories.length } };
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      return { data: { categories: [], total: 0 } };
    }
  },

  createCategory: async (data: any) => {
    try {
      const savedCategories = localStorage.getItem('categories');
      const categories = savedCategories ? JSON.parse(savedCategories) : [];
      
      const newCategory = {
        id: Date.now().toString(),
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      categories.push(newCategory);
      localStorage.setItem('categories', JSON.stringify(categories));
      
      return {
        data: {
          message: 'Categoria criada com sucesso',
          category: newCategory
        }
      };
    } catch (error) {
      console.error('❌ Erro ao criar categoria:', error);
      throw error;
    }
  },

  updateCategory: async (id: string, data: any) => {
    try {
      const savedCategories = localStorage.getItem('categories');
      const categories = savedCategories ? JSON.parse(savedCategories) : [];
      
      const index = categories.findIndex((c: any) => c.id === id);
      if (index !== -1) {
        categories[index] = { ...categories[index], ...data, updated_at: new Date().toISOString() };
        localStorage.setItem('categories', JSON.stringify(categories));
      }
      
      return { data: { message: 'Categoria atualizada com sucesso' } };
    } catch (error) {
      console.error('❌ Erro ao atualizar categoria:', error);
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const savedCategories = localStorage.getItem('categories');
      const categories = savedCategories ? JSON.parse(savedCategories) : [];
      
      const filteredCategories = categories.filter((c: any) => c.id !== id);
      localStorage.setItem('categories', JSON.stringify(filteredCategories));
      
      return { data: { message: 'Categoria deletada com sucesso' } };
    } catch (error) {
      console.error('❌ Erro ao deletar categoria:', error);
      throw error;
    }
  },

  getCategory: async (id: string) => {
    const savedCategories = localStorage.getItem('categories');
    const categories = savedCategories ? JSON.parse(savedCategories) : [];
    const category = categories.find((c: any) => c.id === id);
    
    if (!category) {
      throw new Error('Categoria não encontrada');
    }
    
    return { data: category };
  },

  getCategoryStats: async (params?: any) => {
    return { data: { stats: {} } };
  }
};

// APIs de compatibilidade
export const authAPI = {
  login: async (username: string, password: string) => {
    throw new Error('Use Firebase Auth diretamente');
  },
  register: async (username: string, email: string, password: string) => {
    throw new Error('Use Firebase Auth diretamente');
  },
  verifyToken: async () => {
    throw new Error('Use Firebase Auth diretamente');
  },
  getProfile: async () => {
    throw new Error('Use Firebase Auth diretamente');
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    throw new Error('Use Firebase Auth diretamente');
  }
};

export const usersAPI = {
  getUsers: async () => {
    return { data: { users: [] } };
  },
  createUser: async (data: any) => {
    return { data: { message: 'Use Firebase Auth' } };
  },
  deleteUser: async (id: string) => {
    return { data: { message: 'Use Firebase Auth' } };
  }
};

export const reportsAPI = {
  getMonthlyBalance: async (year: number, month: number) => {
    return { data: { balance: 0 } };
  },
  getYearlyBalance: async (year: number) => {
    return { data: { balance: 0 } };
  },
  getMemberContributions: async (params?: any) => {
    return { data: { contributions: [] } };
  },
  getIncomeByCategory: async (params?: any) => {
    return { data: { income: [] } };
  },
  getExpenseByCategory: async (params?: any) => {
    return { data: { expenses: [] } };
  },
  getCashFlow: async (params?: any) => {
    return { data: { cashFlow: [] } };
  },
  getTopContributors: async (params?: any) => {
    return { data: { contributors: [] } };
  }
};

export default {
  transactionsAPI,
  membersAPI,
  categoriesAPI,
  authAPI,
  usersAPI,
  reportsAPI
};