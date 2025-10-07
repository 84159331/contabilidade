// Serviço de API usando Firebase Firestore diretamente
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Serviço para Transações
export const transactionsAPI = {
  // Buscar todas as transações
  getTransactions: async (params?: any) => {
    try {
      console.log('📊 Buscando transações do Firestore...');
      
      const transactionsRef = collection(db, 'transactions');
      const q = query(transactionsRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      
      const transactions = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          ...data,
          // Converter Timestamp para string se necessário
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
          transaction_date: data.transaction_date
        });
      });

      console.log(`✅ ${transactions.length} transações encontradas`);
      return { data: { transactions, total: transactions.length } };
    } catch (error) {
      console.error('❌ Erro ao buscar transações:', error);
      throw error;
    }
  },

  // Buscar transação por ID
  getTransaction: async (id: string) => {
    try {
      console.log(`📊 Buscando transação ${id} do Firestore...`);
      
      const transactionsRef = collection(db, 'transactions');
      const q = query(transactionsRef, where('__name__', '==', id));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Transação não encontrada');
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      
      return {
        data: {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at
        }
      };
    } catch (error) {
      console.error('❌ Erro ao buscar transação:', error);
      throw error;
    }
  },

  // Criar nova transação
  createTransaction: async (data: any) => {
    try {
      console.log('💾 Criando nova transação no Firestore:', data);
      
      const transactionData = {
        description: data.description,
        amount: parseFloat(data.amount),
        type: data.type,
        category_id: data.category_id || null,
        member_id: data.member_id || null,
        transaction_date: data.transaction_date,
        payment_method: data.payment_method || null,
        reference: data.reference || null,
        notes: data.notes || null,
        created_at: new Date(),
        updated_at: new Date()
      };

      const transactionsRef = collection(db, 'transactions');
      const docRef = await addDoc(transactionsRef, transactionData);

      console.log('✅ Transação criada com ID:', docRef.id);

      return {
        data: {
          message: 'Transação criada com sucesso',
          transaction: {
            id: docRef.id,
            ...transactionData
          }
        }
      };
    } catch (error) {
      console.error('❌ Erro ao criar transação:', error);
      throw error;
    }
  },

  // Atualizar transação
  updateTransaction: async (id: string, data: any) => {
    try {
      console.log(`💾 Atualizando transação ${id} no Firestore:`, data);
      
      const transactionRef = doc(db, 'transactions', id);
      const updateData = {
        ...data,
        updated_at: new Date()
      };

      await updateDoc(transactionRef, updateData);

      console.log('✅ Transação atualizada com sucesso');

      return {
        data: {
          message: 'Transação atualizada com sucesso',
          transaction: {
            id,
            ...updateData
          }
        }
      };
    } catch (error) {
      console.error('❌ Erro ao atualizar transação:', error);
      throw error;
    }
  },

  // Deletar transação
  deleteTransaction: async (id: string) => {
    try {
      console.log(`🗑️ Deletando transação ${id} do Firestore...`);
      
      const transactionRef = doc(db, 'transactions', id);
      await deleteDoc(transactionRef);

      console.log('✅ Transação deletada com sucesso');

      return {
        data: {
          message: 'Transação deletada com sucesso'
        }
      };
    } catch (error) {
      console.error('❌ Erro ao deletar transação:', error);
      throw error;
    }
  },

  // Resumo financeiro
  getSummary: async () => {
    try {
      console.log('📊 Calculando resumo financeiro...');
      
      const transactionsRef = collection(db, 'transactions');
      const snapshot = await getDocs(transactionsRef);
      
      let totalIncome = 0;
      let totalExpense = 0;
      let transactionCount = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        transactionCount++;
        
        if (data.type === 'income') {
          totalIncome += data.amount;
        } else if (data.type === 'expense') {
          totalExpense += data.amount;
        }
      });

      const balance = totalIncome - totalExpense;

      return {
        data: {
          totalIncome,
          totalExpense,
          balance,
          transactionCount
        }
      };
    } catch (error) {
      console.error('❌ Erro ao calcular resumo:', error);
      throw error;
    }
  },

  // Métodos de compatibilidade
  getByCategory: async (params?: any) => {
    // Implementar busca por categoria se necessário
    return { data: { transactions: [], total: 0 } };
  },

  getCashFlow: async (params?: any) => {
    // Implementar fluxo de caixa se necessário
    return { data: { cashFlow: [] } };
  }
};

// Serviço para Membros
export const membersAPI = {
  // Buscar todos os membros
  getMembers: async () => {
    try {
      console.log('👥 Buscando membros do Firestore...');
      
      const membersRef = collection(db, 'members');
      const q = query(membersRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      
      const members = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        members.push({
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at
        });
      });

      console.log(`✅ ${members.length} membros encontrados`);
      return { data: { members, total: members.length } };
    } catch (error) {
      console.error('❌ Erro ao buscar membros:', error);
      throw error;
    }
  },

  // Buscar membro por ID
  getMember: async (id: string) => {
    try {
      console.log(`📊 Buscando membro ${id} do Firestore...`);
      
      const membersRef = collection(db, 'members');
      const q = query(membersRef, where('__name__', '==', id));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Membro não encontrado');
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      
      return {
        data: {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at
        }
      };
    } catch (error) {
      console.error('❌ Erro ao buscar membro:', error);
      throw error;
    }
  },

  // Criar novo membro
  createMember: async (data: any) => {
    try {
      console.log('💾 Criando novo membro no Firestore:', data);
      
      const memberData = {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        birth_date: data.birth_date || null,
        member_since: data.member_since || null,
        status: data.status || 'active',
        notes: data.notes || null,
        created_at: new Date(),
        updated_at: new Date()
      };

      const membersRef = collection(db, 'members');
      const docRef = await addDoc(membersRef, memberData);

      console.log('✅ Membro criado com ID:', docRef.id);

      return {
        data: {
          message: 'Membro criado com sucesso',
          member: {
            id: docRef.id,
            ...memberData
          }
        }
      };
    } catch (error) {
      console.error('❌ Erro ao criar membro:', error);
      throw error;
    }
  },

  // Atualizar membro
  updateMember: async (id: string, data: any) => {
    try {
      console.log(`💾 Atualizando membro ${id} no Firestore:`, data);
      
      const memberRef = doc(db, 'members', id);
      const updateData = {
        ...data,
        updated_at: new Date()
      };

      await updateDoc(memberRef, updateData);

      console.log('✅ Membro atualizado com sucesso');

      return {
        data: {
          message: 'Membro atualizado com sucesso',
          member: {
            id,
            ...updateData
          }
        }
      };
    } catch (error) {
      console.error('❌ Erro ao atualizar membro:', error);
      throw error;
    }
  },

  // Deletar membro
  deleteMember: async (id: string) => {
    try {
      console.log(`🗑️ Deletando membro ${id} do Firestore...`);
      
      const memberRef = doc(db, 'members', id);
      await deleteDoc(memberRef);

      console.log('✅ Membro deletado com sucesso');

      return {
        data: {
          message: 'Membro deletado com sucesso'
        }
      };
    } catch (error) {
      console.error('❌ Erro ao deletar membro:', error);
      throw error;
    }
  },

  // Métodos de compatibilidade
  getMemberStats: async () => {
    return { data: { stats: {} } };
  },

  getMemberContributions: async (id: string, params?: any) => {
    return { data: { contributions: [] } };
  }
};

// Serviço para Categorias
export const categoriesAPI = {
  // Buscar todas as categorias
  getCategories: async () => {
    try {
      console.log('🏷️ Buscando categorias do Firestore...');
      
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      
      const categories = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        categories.push({
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at
        });
      });

      console.log(`✅ ${categories.length} categorias encontradas`);
      return { data: { categories, total: categories.length } };
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      throw error;
    }
  },

  // Buscar categoria por ID
  getCategory: async (id: string) => {
    try {
      console.log(`📊 Buscando categoria ${id} do Firestore...`);
      
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, where('__name__', '==', id));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Categoria não encontrada');
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      
      return {
        data: {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at
        }
      };
    } catch (error) {
      console.error('❌ Erro ao buscar categoria:', error);
      throw error;
    }
  },

  // Criar nova categoria
  createCategory: async (data: any) => {
    try {
      console.log('💾 Criando nova categoria no Firestore:', data);
      
      const categoryData = {
        name: data.name,
        type: data.type,
        description: data.description || null,
        color: data.color || '#3B82F6',
        created_at: new Date(),
        updated_at: new Date()
      };

      const categoriesRef = collection(db, 'categories');
      const docRef = await addDoc(categoriesRef, categoryData);

      console.log('✅ Categoria criada com ID:', docRef.id);

      return {
        data: {
          message: 'Categoria criada com sucesso',
          category: {
            id: docRef.id,
            ...categoryData
          }
        }
      };
    } catch (error) {
      console.error('❌ Erro ao criar categoria:', error);
      throw error;
    }
  },

  // Atualizar categoria
  updateCategory: async (id: string, data: any) => {
    try {
      console.log(`💾 Atualizando categoria ${id} no Firestore:`, data);
      
      const categoryRef = doc(db, 'categories', id);
      const updateData = {
        ...data,
        updated_at: new Date()
      };

      await updateDoc(categoryRef, updateData);

      console.log('✅ Categoria atualizada com sucesso');

      return {
        data: {
          message: 'Categoria atualizada com sucesso',
          category: {
            id,
            ...updateData
          }
        }
      };
    } catch (error) {
      console.error('❌ Erro ao atualizar categoria:', error);
      throw error;
    }
  },

  // Deletar categoria
  deleteCategory: async (id: string) => {
    try {
      console.log(`🗑️ Deletando categoria ${id} do Firestore...`);
      
      const categoryRef = doc(db, 'categories', id);
      await deleteDoc(categoryRef);

      console.log('✅ Categoria deletada com sucesso');

      return {
        data: {
          message: 'Categoria deletada com sucesso'
        }
      };
    } catch (error) {
      console.error('❌ Erro ao deletar categoria:', error);
      throw error;
    }
  },

  // Métodos de compatibilidade
  getCategoryStats: async (params?: any) => {
    return { data: { stats: {} } };
  }
};

// APIs de compatibilidade (manter para não quebrar o código existente)
export const authAPI = {
  login: async (username: string, password: string) => {
    // Implementar autenticação Firebase se necessário
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

// Exportar como default para compatibilidade
export default {
  transactionsAPI,
  membersAPI,
  categoriesAPI,
  authAPI,
  usersAPI,
  reportsAPI
};