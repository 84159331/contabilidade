// Serviço de API integrado com Firebase Firestore
import { db } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  limit,
  startAfter,
  endBefore,
  limitToLast
} from 'firebase/firestore';
import { toast } from 'react-toastify';

// API para transações (usando Firebase Firestore)
export const transactionsAPI = {
  getTransactions: async (params?: any) => {
    try {
      console.log('🔥 Buscando transações no Firestore...');
      
      // Buscar transações
      const transactionsRef = collection(db, 'transactions');
      const q = query(transactionsRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      // Buscar categorias
      const categoriesRef = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesRef);
      const categories = categoriesSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().name;
        return acc;
      }, {} as Record<string, string>);
      
      // Buscar membros
      const membersRef = collection(db, 'members');
      const membersSnapshot = await getDocs(membersRef);
      const members = membersSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().name;
        return acc;
      }, {} as Record<string, string>);
      
      const transactions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id, // Manter como string para compatibilidade com Firebase
          description: data.description || 'Descrição não informada',
          amount: data.amount || 0,
          type: data.type || 'income',
          transaction_date: data.transaction_date || new Date(),
          category_id: data.category_id || '',
          member_id: data.member_id || '',
          payment_method: data.payment_method || 'cash',
          created_at: data.created_at || new Date(),
          updated_at: data.updated_at || new Date(),
          // Adicionar nomes das categorias e membros
          category_name: data.category_id ? categories[data.category_id] || 'Categoria não encontrada' : '',
          member_name: data.member_id ? members[data.member_id] || 'Membro não encontrado' : ''
        };
      });
      
      console.log('✅ Transações carregadas do Firestore:', transactions.length);
      return { data: { transactions, total: transactions.length } };
    } catch (error) {
      console.error('❌ Erro ao buscar transações:', error);
      return { data: { transactions: [], total: 0 } };
    }
  },

  createTransaction: async (data: any) => {
    try {
      console.log('💾 Salvando transação no Firestore:', data);
      console.log('🔥 Firebase DB instance:', db);
      
      const transactionData = {
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      console.log('📝 Dados da transação preparados:', transactionData);
      
      const transactionsRef = collection(db, 'transactions');
      console.log('📂 Referência da coleção criada:', transactionsRef);
      
      const docRef = await addDoc(transactionsRef, transactionData);
      console.log('✅ Transação salva no Firestore com ID:', docRef.id);
      
      return {
        data: {
          message: 'Transação criada com sucesso',
          transaction: { id: docRef.id, ...transactionData }
        }
      };
    } catch (error: any) {
      console.error('❌ Erro ao criar transação:', error);
      console.error('❌ Detalhes do erro:', error.message);
      console.error('❌ Stack trace:', error.stack);
      toast.error('Erro ao salvar transação: ' + error.message);
      throw error;
    }
  },

  updateTransaction: async (id: string, data: any) => {
    try {
      console.log('🔄 Atualizando transação no Firestore:', id);
      
      const transactionRef = doc(db, 'transactions', id);
      await updateDoc(transactionRef, {
        ...data,
        updated_at: new Date()
      });
      
      console.log('✅ Transação atualizada no Firestore');
      return { data: { message: 'Transação atualizada com sucesso' } };
    } catch (error) {
      console.error('❌ Erro ao atualizar transação:', error);
      toast.error('Erro ao atualizar transação');
      throw error;
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      console.log('🗑️ Deletando transação do Firestore:', id);
      console.log('🔍 Tipo do ID:', typeof id);
      console.log('🔍 Valor do ID:', id);
      
      const transactionRef = doc(db, 'transactions', id);
      console.log('📂 Referência criada:', transactionRef);
      
      await deleteDoc(transactionRef);
      
      console.log('✅ Transação deletada do Firestore com sucesso');
      return { data: { message: 'Transação deletada com sucesso' } };
    } catch (error) {
      console.error('❌ Erro ao deletar transação:', error);
      console.error('❌ Detalhes do erro:', error);
      toast.error('Erro ao deletar transação: ' + (error as Error).message);
      throw error;
    }
  },

  getSummary: async () => {
    try {
      console.log('📊 Calculando resumo financeiro...');
      const transactionsRef = collection(db, 'transactions');
      const querySnapshot = await getDocs(transactionsRef);
      
      let totalIncome = 0;
      let totalExpense = 0;
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.type === 'income') {
          totalIncome += parseFloat(data.amount) || 0;
        } else if (data.type === 'expense') {
          totalExpense += parseFloat(data.amount) || 0;
        }
      });
      
      const summary = {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        transactionCount: querySnapshot.docs.length
      };
      
      console.log('✅ Resumo calculado:', summary);
      return { data: summary };
    } catch (error) {
      console.error('❌ Erro ao calcular resumo:', error);
      return { data: { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0 } };
    }
  },

  getTransaction: async (id: string) => {
    try {
      const transactionRef = doc(db, 'transactions', id);
      const transactionDoc = await getDocs(collection(db, 'transactions'));
      const transaction = transactionDoc.docs.find(doc => doc.id === id);
      
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }
      
      const data = transaction.data();
      
      // Buscar categoria se existir
      let category_name = '';
      if (data.category_id) {
        try {
          const categoryRef = doc(db, 'categories', data.category_id);
          const categorySnap = await getDoc(categoryRef);
          if (categorySnap.exists()) {
            category_name = categorySnap.data().name;
          }
        } catch (error) {
          console.error('Erro ao buscar categoria:', error);
        }
      }
      
      // Buscar membro se existir
      let member_name = '';
      if (data.member_id) {
        try {
          const memberRef = doc(db, 'members', data.member_id);
          const memberSnap = await getDoc(memberRef);
          if (memberSnap.exists()) {
            member_name = memberSnap.data().name;
          }
        } catch (error) {
          console.error('Erro ao buscar membro:', error);
        }
      }
      
      return { 
        data: { 
          id: transaction.id, 
          ...data,
          category_name,
          member_name
        } 
      };
    } catch (error) {
      console.error('❌ Erro ao buscar transação:', error);
      throw error;
    }
  },

  getByCategory: async (params?: any) => {
    return { data: { transactions: [], total: 0 } };
  },

  getCashFlow: async (params?: any) => {
    return { data: { cashFlow: [] } };
  }
};

// API para membros (usando Firebase Firestore)
export const membersAPI = {
  getMembers: async () => {
    try {
      console.log('🔥 Buscando membros no Firestore...');
      const membersRef = collection(db, 'members');
      const q = query(membersRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const members = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Documento ID:', doc.id, 'Tipo:', typeof doc.id, 'Dados:', data);
        return {
          id: doc.id, // Manter como string (ID do Firestore)
          name: data.name || 'Nome não informado',
          email: data.email || '',
          phone: data.phone || '',
          status: data.status || 'active',
          created_at: data.created_at || new Date(),
          updated_at: data.updated_at || new Date()
        };
      });
      
      console.log('✅ Membros carregados do Firestore:', members.length);
      console.log('🔍 IDs dos membros:', members.map(m => ({ id: m.id, type: typeof m.id })));
      return { data: { members, total: members.length } };
    } catch (error) {
      console.error('❌ Erro ao buscar membros:', error);
      return { data: { members: [], total: 0 } };
    }
  },

  createMember: async (data: any) => {
    try {
      console.log('💾 Salvando membro no Firestore:', data);
      console.log('🔥 Firebase DB instance:', db);
      
      const memberData = {
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      console.log('📝 Dados do membro preparados:', memberData);
      
      const membersRef = collection(db, 'members');
      console.log('📂 Referência da coleção criada:', membersRef);
      
      const docRef = await addDoc(membersRef, memberData);
      console.log('✅ Membro salvo no Firestore com ID:', docRef.id);
      
      return {
        data: {
          message: 'Membro criado com sucesso',
          member: { id: docRef.id, ...memberData }
        }
      };
    } catch (error: any) {
      console.error('❌ Erro ao criar membro:', error);
      console.error('❌ Detalhes do erro:', error.message);
      console.error('❌ Stack trace:', error.stack);
      toast.error('Erro ao salvar membro: ' + error.message);
      throw error;
    }
  },

  updateMember: async (id: string, data: any) => {
    try {
      console.log('🔄 Atualizando membro no Firestore:');
      console.log('  - ID recebido:', id, 'Tipo:', typeof id);
      console.log('  - Dados para atualização:', data);
      
      // Verificar se o documento existe antes de tentar atualizar
      const memberRef = doc(db, 'members', id);
      const memberSnap = await getDoc(memberRef);
      
      if (!memberSnap.exists()) {
        console.error('❌ Documento não encontrado no Firestore:', id);
        throw new Error(`Membro com ID ${id} não encontrado no Firestore`);
      }
      
      console.log('✅ Documento encontrado, procedendo com atualização...');
      
      await updateDoc(memberRef, {
        ...data,
        updated_at: new Date()
      });
      
      console.log('✅ Membro atualizado no Firestore com sucesso');
      return { data: { message: 'Membro atualizado com sucesso' } };
    } catch (error) {
      console.error('❌ Erro ao atualizar membro:', error);
      console.error('❌ Detalhes do erro:', error);
      toast.error('Erro ao atualizar membro: ' + (error as Error).message);
      throw error;
    }
  },

  deleteMember: async (id: string) => {
    try {
      console.log('🗑️ Deletando membro do Firestore:');
      console.log('  - ID recebido:', id, 'Tipo:', typeof id);
      
      // Verificar se o documento existe antes de tentar deletar
      const memberRef = doc(db, 'members', id);
      const memberSnap = await getDoc(memberRef);
      
      if (!memberSnap.exists()) {
        console.error('❌ Documento não encontrado no Firestore:', id);
        throw new Error(`Membro com ID ${id} não encontrado no Firestore`);
      }
      
      console.log('✅ Documento encontrado, procedendo com exclusão...');
      
      await deleteDoc(memberRef);
      
      console.log('✅ Membro deletado do Firestore com sucesso');
      return { data: { message: 'Membro deletado com sucesso' } };
    } catch (error) {
      console.error('❌ Erro ao deletar membro:', error);
      console.error('❌ Detalhes do erro:', error);
      toast.error('Erro ao deletar membro: ' + (error as Error).message);
      throw error;
    }
  },

  getMember: async (id: string) => {
    try {
      console.log('🔍 Buscando membro no Firestore:', id);
      const memberRef = doc(db, 'members', id);
      const memberSnap = await getDoc(memberRef);
      
      if (!memberSnap.exists()) {
        throw new Error('Membro não encontrado');
      }
      
      return { data: { id: memberSnap.id, ...memberSnap.data() } };
    } catch (error) {
      console.error('❌ Erro ao buscar membro:', error);
      throw error;
    }
  },

  getMemberStats: async () => {
    try {
      console.log('📊 Calculando estatísticas de membros...');
      const membersRef = collection(db, 'members');
      const querySnapshot = await getDocs(membersRef);
      
      const stats = {
        total: querySnapshot.docs.length,
        active: querySnapshot.docs.filter(doc => doc.data().status === 'active').length,
        inactive: querySnapshot.docs.filter(doc => doc.data().status === 'inactive').length
      };
      
      console.log('✅ Estatísticas calculadas:', stats);
      return { data: stats };
    } catch (error) {
      console.error('❌ Erro ao calcular estatísticas:', error);
      return { data: { total: 0, active: 0, inactive: 0 } };
    }
  },

  getMemberContributions: async (id: string, params?: any) => {
    return { data: { contributions: [] } };
  }
};

// API para categorias (usando Firebase Firestore)
export const categoriesAPI = {
  getCategories: async () => {
    try {
      console.log('🔥 Buscando categorias no Firestore...');
      const categoriesRef = collection(db, 'categories');
      const querySnapshot = await getDocs(categoriesRef);
      
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id, // Manter como string (ID do Firestore)
        name: doc.data().name || 'Categoria não informada',
        type: doc.data().type || 'income',
        color: doc.data().color || '#3B82F6',
        created_at: doc.data().created_at || new Date(),
        updated_at: doc.data().updated_at || new Date()
      }));
      
      // Se não há categorias salvas, criar algumas padrão
      if (categories.length === 0) {
        console.log('📝 Criando categorias padrão...');
        const defaultCategories = [
          { name: 'Dízimos', type: 'income', description: 'Dízimos dos membros', color: '#10B981' },
          { name: 'Ofertas', type: 'income', description: 'Ofertas especiais', color: '#3B82F6' },
          { name: 'Utilidades', type: 'expense', description: 'Contas de água, luz, telefone', color: '#EF4444' },
          { name: 'Manutenção', type: 'expense', description: 'Manutenção do prédio', color: '#F97316' }
        ];
        
        for (const category of defaultCategories) {
          await addDoc(categoriesRef, {
            ...category,
            created_at: new Date(),
            updated_at: new Date()
          });
        }
        
        // Buscar novamente após criar as categorias padrão
        const newQuerySnapshot = await getDocs(categoriesRef);
        const newCategories = newQuerySnapshot.docs.map(doc => ({
          id: doc.id, // Manter como string (ID do Firestore)
          name: doc.data().name || 'Categoria não informada',
          type: doc.data().type || 'income',
          color: doc.data().color || '#3B82F6',
          created_at: doc.data().created_at || new Date(),
          updated_at: doc.data().updated_at || new Date()
        }));
        
        console.log('✅ Categorias padrão criadas:', newCategories.length);
        return { data: { categories: newCategories, total: newCategories.length } };
      }
      
      console.log('✅ Categorias carregadas do Firestore:', categories.length);
      return { data: { categories, total: categories.length } };
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      return { data: { categories: [], total: 0 } };
    }
  },

  createCategory: async (data: any) => {
    try {
      console.log('💾 Salvando categoria no Firestore:', data);
      
      const categoryData = {
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const categoriesRef = collection(db, 'categories');
      const docRef = await addDoc(categoriesRef, categoryData);
      
      console.log('✅ Categoria salva no Firestore com ID:', docRef.id);
      
      return {
        data: {
          message: 'Categoria criada com sucesso',
          category: { id: docRef.id, ...categoryData }
        }
      };
    } catch (error) {
      console.error('❌ Erro ao criar categoria:', error);
      toast.error('Erro ao salvar categoria');
      throw error;
    }
  },

  updateCategory: async (id: string, data: any) => {
    try {
      console.log('🔄 Atualizando categoria no Firestore:', id);
      
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, {
        ...data,
        updated_at: new Date()
      });
      
      console.log('✅ Categoria atualizada no Firestore');
      return { data: { message: 'Categoria atualizada com sucesso' } };
    } catch (error) {
      console.error('❌ Erro ao atualizar categoria:', error);
      toast.error('Erro ao atualizar categoria');
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      console.log('🗑️ Deletando categoria do Firestore:', id);
      
      const categoryRef = doc(db, 'categories', id);
      await deleteDoc(categoryRef);
      
      console.log('✅ Categoria deletada do Firestore');
      return { data: { message: 'Categoria deletada com sucesso' } };
    } catch (error) {
      console.error('❌ Erro ao deletar categoria:', error);
      toast.error('Erro ao deletar categoria');
      throw error;
    }
  },

  getCategory: async (id: string) => {
    try {
      const categoriesRef = collection(db, 'categories');
      const querySnapshot = await getDocs(categoriesRef);
      const category = querySnapshot.docs.find(doc => doc.id === id);
      
      if (!category) {
        throw new Error('Categoria não encontrada');
      }
      
      return { data: { id: category.id, ...category.data() } };
    } catch (error) {
      console.error('❌ Erro ao buscar categoria:', error);
      throw error;
    }
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
}