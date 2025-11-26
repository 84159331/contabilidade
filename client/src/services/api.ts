// Serviço de API integrado com Firebase Firestore
import { db } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  setDoc,
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
import storage from '../utils/storage';

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
  },

  getRecentTransactions: async (limit: number = 5) => {
    try {
      console.log('🔥 Buscando transações recentes no Firestore...');
      
      // Buscar transações
      const transactionsRef = collection(db, 'transactions');
      const q = query(transactionsRef, orderBy('created_at', 'desc'), limitToLast(limit));
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
          id: doc.id,
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
      
      console.log('✅ Transações recentes carregadas do Firestore:', transactions.length);
      return { data: transactions };
    } catch (error) {
      console.error('❌ Erro ao buscar transações recentes:', error);
      return { data: [] };
    }
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
        description: doc.data().description || '',
        transaction_count: 0, // Será calculado posteriormente se necessário
        total_amount: 0, // Será calculado posteriormente se necessário
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
          description: doc.data().description || '',
          transaction_count: 0, // Será calculado posteriormente se necessário
          total_amount: 0, // Será calculado posteriormente se necessário
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
      console.log('💾 Iniciando salvamento da categoria no Firestore...');
      console.log('📝 Dados recebidos:', data);
      console.log('🔥 Firebase DB instance:', db);
      
      const categoryData = {
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      console.log('📋 Dados preparados para salvamento:', categoryData);
      
      const categoriesRef = collection(db, 'categories');
      console.log('📂 Referência da coleção criada:', categoriesRef);
      
      const docRef = await addDoc(categoriesRef, categoryData);
      console.log('✅ Categoria salva no Firestore com ID:', docRef.id);
      
      const result = {
        data: {
          message: 'Categoria criada com sucesso',
          category: { id: docRef.id, ...categoryData }
        }
      };
      
      console.log('📤 Retornando resultado:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Erro ao criar categoria:', error);
      console.error('❌ Detalhes do erro:', error.message);
      console.error('❌ Stack trace:', error.stack);
      toast.error('Erro ao salvar categoria: ' + error.message);
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

// Helper para converter data do Firestore para Date
const toDate = (dateValue: any): Date => {
  if (!dateValue) return new Date();
  if (dateValue instanceof Date) return dateValue;
  if (dateValue.toDate && typeof dateValue.toDate === 'function') {
    return dateValue.toDate();
  }
  if (typeof dateValue === 'string') {
    return new Date(dateValue);
  }
  if (typeof dateValue === 'number') {
    return new Date(dateValue);
  }
  return new Date();
};

// Helper para formatar mês com zero à esquerda
const formatMonth = (month: number): string => {
  return month.toString().padStart(2, '0');
};

export const reportsAPI = {
  // Relatório de balanço mensal
  getMonthlyBalance: async (year: number, month: number) => {
    try {
      console.log(`📊 Gerando relatório mensal: ${year}-${formatMonth(month)}`);
      
      const transactionsRef = collection(db, 'transactions');
      const querySnapshot = await getDocs(transactionsRef);
      
      const income = { total: 0, count: 0 };
      const expense = { total: 0, count: 0 };
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const transactionDate = toDate(data.transaction_date);
        const transactionYear = transactionDate.getFullYear();
        const transactionMonth = transactionDate.getMonth() + 1;
        
        // Verificar se a transação pertence ao mês/ano especificado
        if (transactionYear === year && transactionMonth === month) {
          const amount = parseFloat(data.amount) || 0;
          
          if (data.type === 'income') {
            income.total += amount;
            income.count += 1;
          } else if (data.type === 'expense') {
            expense.total += amount;
            expense.count += 1;
          }
        }
      });
      
      const balance = income.total - expense.total;
      
      const result = {
        income,
        expense,
        balance,
        period: { year, month }
      };
      
      console.log('✅ Relatório mensal gerado:', result);
      return { data: result };
    } catch (error) {
      console.error('❌ Erro ao gerar relatório mensal:', error);
      return { 
        data: { 
          income: { total: 0, count: 0 },
          expense: { total: 0, count: 0 },
          balance: 0,
          period: { year, month }
        } 
      };
    }
  },

  // Relatório de balanço anual
  getYearlyBalance: async (year: number) => {
    try {
      console.log(`📊 Gerando relatório anual: ${year}`);
      
      const transactionsRef = collection(db, 'transactions');
      const querySnapshot = await getDocs(transactionsRef);
      
      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      
      // Inicializar dados mensais
      const monthlyData: any[] = [];
      for (let i = 1; i <= 12; i++) {
        monthlyData.push({
          month: formatMonth(i),
          monthName: monthNames[i - 1],
          income: 0,
          expense: 0,
          balance: 0
        });
      }
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const transactionDate = toDate(data.transaction_date);
        const transactionYear = transactionDate.getFullYear();
        const transactionMonth = transactionDate.getMonth() + 1;
        
        // Verificar se a transação pertence ao ano especificado
        if (transactionYear === year) {
          const amount = parseFloat(data.amount) || 0;
          const monthIndex = transactionMonth - 1;
          
          if (data.type === 'income') {
            monthlyData[monthIndex].income += amount;
          } else if (data.type === 'expense') {
            monthlyData[monthIndex].expense += amount;
          }
        }
      });
      
      // Calcular saldos mensais
      monthlyData.forEach(month => {
        month.balance = month.income - month.expense;
      });
      
      // Calcular totais anuais
      const yearlyTotal = {
        income: monthlyData.reduce((sum, m) => sum + m.income, 0),
        expense: monthlyData.reduce((sum, m) => sum + m.expense, 0),
        balance: monthlyData.reduce((sum, m) => sum + m.balance, 0)
      };
      
      const result = {
        year,
        monthlyData,
        yearlyTotal
      };
      
      console.log('✅ Relatório anual gerado:', result);
      return { data: result };
    } catch (error) {
      console.error('❌ Erro ao gerar relatório anual:', error);
      return { 
        data: { 
          year,
          monthlyData: [],
          yearlyTotal: { income: 0, expense: 0, balance: 0 }
        } 
      };
    }
  },

  // Relatório de contribuições por membro
  getMemberContributions: async (params?: any) => {
    try {
      console.log('📊 Gerando relatório de contribuições por membro');
      
      const { start_date, end_date } = params || {};
      const transactionsRef = collection(db, 'transactions');
      const membersRef = collection(db, 'members');
      
      const [transactionsSnapshot, membersSnapshot] = await Promise.all([
        getDocs(query(transactionsRef, where('type', '==', 'income'))),
        getDocs(membersRef)
      ]);
      
      // Mapear membros
      const membersMap: Record<string, any> = {};
      membersSnapshot.docs.forEach(doc => {
        membersMap[doc.id] = doc.data();
      });
      
      // Agrupar contribuições por membro
      const contributionsMap: Record<string, {
        member: any;
        contributions: Array<{ amount: number; date: Date }>;
        total: number;
        count: number;
      }> = {};
      
      transactionsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const memberId = data.member_id;
        const transactionDate = toDate(data.transaction_date);
        
        // Verificar filtros de data
        if (start_date && transactionDate < new Date(start_date)) return;
        if (end_date && transactionDate > new Date(end_date)) return;
        
        if (memberId && membersMap[memberId]) {
          if (!contributionsMap[memberId]) {
            contributionsMap[memberId] = {
              member: membersMap[memberId],
              contributions: [],
              total: 0,
              count: 0
            };
          }
          
          const amount = parseFloat(data.amount) || 0;
          contributionsMap[memberId].contributions.push({
            amount,
            date: transactionDate
          });
          contributionsMap[memberId].total += amount;
          contributionsMap[memberId].count += 1;
        }
      });
      
      // Converter para formato esperado
      const contributions = Object.entries(contributionsMap)
        .map(([memberId, contrib]) => {
          const sortedContributions = contrib.contributions.sort((a, b) => a.date.getTime() - b.date.getTime());
          const firstContribution = sortedContributions[0];
          const lastContribution = sortedContributions[sortedContributions.length - 1];
          
          return {
            id: memberId,
            name: contrib.member.name || 'Sem nome',
            email: contrib.member.email || '',
            contribution_count: contrib.count,
            total_contributed: contrib.total,
            average_contribution: contrib.count > 0 ? contrib.total / contrib.count : 0,
            first_contribution: firstContribution ? firstContribution.date.toISOString().split('T')[0] : '',
            last_contribution: lastContribution ? lastContribution.date.toISOString().split('T')[0] : ''
          };
        })
        .sort((a, b) => b.total_contributed - a.total_contributed);
      
      console.log('✅ Relatório de contribuições gerado:', contributions.length, 'membros');
      return { data: contributions };
    } catch (error) {
      console.error('❌ Erro ao gerar relatório de contribuições:', error);
      return { data: [] };
    }
  },

  // Relatório de receitas por categoria
  getIncomeByCategory: async (params?: any) => {
    try {
      console.log('📊 Gerando relatório de receitas por categoria');
      
      const { start_date, end_date } = params || {};
      const transactionsRef = collection(db, 'transactions');
      const categoriesRef = collection(db, 'categories');
      
      const [transactionsSnapshot, categoriesSnapshot] = await Promise.all([
        getDocs(query(transactionsRef, where('type', '==', 'income'))),
        getDocs(query(categoriesRef, where('type', '==', 'income')))
      ]);
      
      // Mapear categorias
      const categoriesMap: Record<string, any> = {};
      categoriesSnapshot.docs.forEach(doc => {
        categoriesMap[doc.id] = { ...doc.data(), id: doc.id };
      });
      
      // Inicializar dados por categoria
      const categoryDataMap: Record<string, {
        id: string;
        name: string;
        color: string;
        transaction_count: number;
        total_amount: number;
      }> = {};
      
      // Inicializar todas as categorias
      Object.keys(categoriesMap).forEach(catId => {
        const cat = categoriesMap[catId];
        categoryDataMap[catId] = {
          id: catId,
          name: cat.name || 'Sem nome',
          color: cat.color || '#3B82F6',
          transaction_count: 0,
          total_amount: 0
        };
      });
      
      // Processar transações
      transactionsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const categoryId = data.category_id;
        const transactionDate = toDate(data.transaction_date);
        
        // Verificar filtros de data
        if (start_date && transactionDate < new Date(start_date)) return;
        if (end_date && transactionDate > new Date(end_date)) return;
        
        if (categoryId && categoryDataMap[categoryId]) {
          categoryDataMap[categoryId].transaction_count += 1;
          categoryDataMap[categoryId].total_amount += parseFloat(data.amount) || 0;
        }
      });
      
      // Converter para array e ordenar
      const result = Object.values(categoryDataMap)
        .filter(cat => cat.transaction_count > 0)
        .map(cat => ({
          ...cat,
          average_amount: cat.transaction_count > 0 ? cat.total_amount / cat.transaction_count : 0
        }))
        .sort((a, b) => b.total_amount - a.total_amount);
      
      console.log('✅ Relatório de receitas por categoria gerado:', result.length, 'categorias');
      return { data: result };
    } catch (error) {
      console.error('❌ Erro ao gerar relatório de receitas por categoria:', error);
      return { data: [] };
    }
  },

  // Relatório de despesas por categoria
  getExpenseByCategory: async (params?: any) => {
    try {
      console.log('📊 Gerando relatório de despesas por categoria');
      
      const { start_date, end_date } = params || {};
      const transactionsRef = collection(db, 'transactions');
      const categoriesRef = collection(db, 'categories');
      
      const [transactionsSnapshot, categoriesSnapshot] = await Promise.all([
        getDocs(query(transactionsRef, where('type', '==', 'expense'))),
        getDocs(query(categoriesRef, where('type', '==', 'expense')))
      ]);
      
      // Mapear categorias
      const categoriesMap: Record<string, any> = {};
      categoriesSnapshot.docs.forEach(doc => {
        categoriesMap[doc.id] = { ...doc.data(), id: doc.id };
      });
      
      // Inicializar dados por categoria
      const categoryDataMap: Record<string, {
        id: string;
        name: string;
        color: string;
        transaction_count: number;
        total_amount: number;
      }> = {};
      
      // Inicializar todas as categorias
      Object.keys(categoriesMap).forEach(catId => {
        const cat = categoriesMap[catId];
        categoryDataMap[catId] = {
          id: catId,
          name: cat.name || 'Sem nome',
          color: cat.color || '#EF4444',
          transaction_count: 0,
          total_amount: 0
        };
      });
      
      // Processar transações
      transactionsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const categoryId = data.category_id;
        const transactionDate = toDate(data.transaction_date);
        
        // Verificar filtros de data
        if (start_date && transactionDate < new Date(start_date)) return;
        if (end_date && transactionDate > new Date(end_date)) return;
        
        if (categoryId && categoryDataMap[categoryId]) {
          categoryDataMap[categoryId].transaction_count += 1;
          categoryDataMap[categoryId].total_amount += parseFloat(data.amount) || 0;
        }
      });
      
      // Converter para array e ordenar
      const result = Object.values(categoryDataMap)
        .filter(cat => cat.transaction_count > 0)
        .map(cat => ({
          ...cat,
          average_amount: cat.transaction_count > 0 ? cat.total_amount / cat.transaction_count : 0
        }))
        .sort((a, b) => b.total_amount - a.total_amount);
      
      console.log('✅ Relatório de despesas por categoria gerado:', result.length, 'categorias');
      return { data: result };
    } catch (error) {
      console.error('❌ Erro ao gerar relatório de despesas por categoria:', error);
      return { data: [] };
    }
  },

  // Relatório de fluxo de caixa
  getCashFlow: async (params?: any) => {
    try {
      console.log('📊 Gerando relatório de fluxo de caixa');
      
      const { start_date, end_date, period = 'monthly' } = params || {};
      
      if (!start_date || !end_date) {
        return { data: [] };
      }
      
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      
      const transactionsRef = collection(db, 'transactions');
      const querySnapshot = await getDocs(transactionsRef);
      
      const periodDataMap: Record<string, { period: string; income: number; expense: number; balance: number }> = {};
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const transactionDate = toDate(data.transaction_date);
        
        // Verificar se está no período
        if (transactionDate < startDate || transactionDate > endDate) return;
        
        let periodKey = '';
        if (period === 'daily') {
          periodKey = transactionDate.toISOString().split('T')[0]; // YYYY-MM-DD
        } else if (period === 'weekly') {
          const weekNum = getWeekNumber(transactionDate);
          periodKey = `${transactionDate.getFullYear()}-W${weekNum}`;
        } else {
          // monthly
          const year = transactionDate.getFullYear();
          const month = formatMonth(transactionDate.getMonth() + 1);
          periodKey = `${year}-${month}`;
        }
        
        if (!periodDataMap[periodKey]) {
          periodDataMap[periodKey] = {
            period: periodKey,
            income: 0,
            expense: 0,
            balance: 0
          };
        }
        
        const amount = parseFloat(data.amount) || 0;
        if (data.type === 'income') {
          periodDataMap[periodKey].income += amount;
        } else if (data.type === 'expense') {
          periodDataMap[periodKey].expense += amount;
        }
      });
      
      // Calcular saldos
      Object.values(periodDataMap).forEach(periodData => {
        periodData.balance = periodData.income - periodData.expense;
      });
      
      // Ordenar por período
      const result = Object.values(periodDataMap).sort((a, b) => {
        return a.period.localeCompare(b.period);
      });
      
      console.log('✅ Relatório de fluxo de caixa gerado:', result.length, 'períodos');
      return { data: result };
    } catch (error) {
      console.error('❌ Erro ao gerar relatório de fluxo de caixa:', error);
      return { data: [] };
    }
  },

  getTopContributors: async (params?: any) => {
    try {
      console.log('📊 Gerando relatório de top contribuintes');
      
      const contributions = await reportsAPI.getMemberContributions(params);
      const topContributors = contributions.data
        .slice(0, params?.limit || 10)
        .map((contrib: any, index: number) => ({
          ...contrib,
          rank: index + 1
        }));
      
      return { data: topContributors };
    } catch (error) {
      console.error('❌ Erro ao gerar relatório de top contribuintes:', error);
      return { data: [] };
    }
  }
};

// Helper para calcular número da semana
const getWeekNumber = (date: Date): string => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7).toString().padStart(2, '0');
};

// API para eventos (usando Firebase Firestore)
export const eventsAPI = {
  getEvents: async () => {
    try {
      console.log('🔥 Buscando eventos no Firestore...');
      console.log('📊 Database:', db);
      
      const eventsRef = collection(db, 'events');
      console.log('📊 Events collection ref:', eventsRef);
      
      const q = query(eventsRef, orderBy('date', 'asc'));
      console.log('📊 Query:', q);
      
      const querySnapshot = await getDocs(q);
      console.log('📊 Query snapshot:', querySnapshot);
      console.log('📊 Docs count:', querySnapshot.docs.length);
      
      const events = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📊 Doc data:', doc.id, data);
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          date: data.date,
          time: data.time,
          location: data.location,
          image: data.image,
          social_media: data.social_media || {},
          created_at: data.created_at,
          updated_at: data.updated_at
        };
      });
      
      console.log('✅ Eventos carregados:', events.length);
      console.log('📊 Eventos:', events);
      return events;
    } catch (error) {
      console.error('❌ Erro ao buscar eventos:', error);
      if (error instanceof Error) {
        console.error('❌ Error details:', error.message);
        console.error('❌ Error stack:', error.stack);
      }
      return [];
    }
  },

  createEvent: async (eventData: any) => {
    try {
      console.log('🔥 Criando evento no Firestore...');
      console.log('📝 Dados do evento:', eventData);
      
      const eventsRef = collection(db, 'events');
      const eventToCreate = {
        ...eventData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('📝 Dados preparados:', eventToCreate);
      
      const docRef = await addDoc(eventsRef, eventToCreate);
      console.log('✅ Evento criado com ID:', docRef.id);
      
      return { id: docRef.id, ...eventToCreate };
    } catch (error) {
      console.error('❌ Erro ao criar evento:', error);
      throw error;
    }
  },

  updateEvent: async (id: string, eventData: any) => {
    try {
      console.log('🔥 Atualizando evento no Firestore...');
      console.log('📝 ID do evento:', id);
      console.log('📝 Dados para atualizar:', eventData);
      
      const eventRef = doc(db, 'events', id);
      
      // Verificar se o documento existe
      const eventSnap = await getDoc(eventRef);
      if (!eventSnap.exists()) {
        throw new Error('Evento não encontrado');
      }
      
      const updateData = {
        ...eventData,
        updated_at: new Date().toISOString()
      };
      
      await updateDoc(eventRef, updateData);
      console.log('✅ Evento atualizado com sucesso');
      
      return { id, ...updateData };
    } catch (error) {
      console.error('❌ Erro ao atualizar evento:', error);
      throw error;
    }
  },

  deleteEvent: async (id: string) => {
    try {
      console.log('🗑️ deleteEvent - Iniciando exclusão do evento:', id);
      
      // Verificar se o ID é válido
      if (!id || id.trim() === '') {
        throw new Error('ID do evento é inválido');
      }
      
      // Criar referência do documento
      const eventRef = doc(db, 'events', id);
      console.log('📝 deleteEvent - Referência do documento:', eventRef.path);
      
      // Verificar se o documento existe
      const eventSnap = await getDoc(eventRef);
      if (!eventSnap.exists()) {
        console.log('⚠️ deleteEvent - Documento não encontrado, tentando busca alternativa...');
        
        // Buscar por ID em todos os documentos
        const eventsQuery = query(collection(db, 'events'));
        const eventsSnapshot = await getDocs(eventsQuery);
        
        let foundDoc: any = null;
        eventsSnapshot.forEach((doc) => {
          if (doc.id === id) {
            foundDoc = doc;
          }
        });
        
        if (foundDoc) {
          console.log('✅ deleteEvent - Documento encontrado por busca:', foundDoc.id);
          await deleteDoc(doc(db, 'events', foundDoc.id));
        } else {
          throw new Error(`Evento com ID ${id} não encontrado`);
        }
      } else {
        console.log('✅ deleteEvent - Documento encontrado, procedendo com exclusão...');
        await deleteDoc(eventRef);
      }
      
      console.log('✅ deleteEvent - Evento deletado com sucesso do Firestore');
      
      // Limpar do cache local
      try {
        const cachedEvents = storage.getJSON<any[]>('cachedEvents');
        if (cachedEvents && Array.isArray(cachedEvents)) {
          const updatedEvents = cachedEvents.filter((event: any) => event.id !== id);
          storage.setJSON('cachedEvents', updatedEvents);
          console.log('✅ deleteEvent - Evento removido do cache local');
          
          // Disparar evento de sincronização
          window.dispatchEvent(new CustomEvent('eventsUpdated'));
        }
      } catch (cacheError) {
        console.error('⚠️ deleteEvent - Erro ao limpar cache local:', cacheError);
      }
      
      return true;
    } catch (error) {
      console.error('❌ deleteEvent - Erro ao deletar evento:', error);
      if (error instanceof Error) {
        console.error('❌ deleteEvent - Mensagem de erro:', error.message);
      }
      throw error;
    }
  },

  uploadEventImage: async (file: File) => {
    try {
      console.log('🔥 Fazendo upload da imagem do evento...');
      console.log('📁 Arquivo:', file.name, file.size, file.type);
      
      // Converter arquivo para base64 para persistência
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            console.log('✅ Base64 gerado com sucesso, tamanho:', reader.result.length);
            console.log('🔍 Primeiros 100 caracteres:', reader.result.substring(0, 100));
            resolve(reader.result);
          } else {
            reject(new Error('Falha ao converter imagem para base64'));
          }
        };
        reader.onerror = (error) => {
          console.error('❌ Erro no FileReader:', error);
          reject(new Error('Erro ao ler arquivo'));
        };
        reader.readAsDataURL(file);
      });
      
      console.log('✅ Imagem convertida para base64, tamanho total:', base64Image.length);
      return base64Image;
    } catch (error) {
      console.error('❌ Erro ao fazer upload da imagem:', error);
      throw error;
    }
  },

  // Função para testar permissões do Firestore
  testFirestorePermissions: async () => {
    try {
      console.log('🔍 testFirestorePermissions - Testando permissões...');
      
      // Testar leitura
      console.log('📖 testFirestorePermissions - Testando leitura...');
      const testQuery = query(collection(db, 'events'), limit(1));
      const testSnapshot = await getDocs(testQuery);
      console.log('✅ testFirestorePermissions - Leitura OK, documentos encontrados:', testSnapshot.size);
      
      // Testar escrita (criar documento temporário)
      console.log('✍️ testFirestorePermissions - Testando escrita...');
      const testDocRef = doc(collection(db, 'events'));
      const testData = {
        title: 'Teste de Permissão',
        description: 'Documento temporário para teste',
        date: new Date().toISOString().split('T')[0],
        time: '00:00',
        location: 'Teste',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await setDoc(testDocRef, testData);
      console.log('✅ testFirestorePermissions - Escrita OK, documento criado:', testDocRef.id);
      
      // Testar exclusão
      console.log('🗑️ testFirestorePermissions - Testando exclusão...');
      await deleteDoc(testDocRef);
      console.log('✅ testFirestorePermissions - Exclusão OK');
      
      console.log('✅ testFirestorePermissions - Todas as permissões OK');
      return true;
    } catch (error) {
      console.error('❌ testFirestorePermissions - Erro:', error);
      if (error instanceof Error) {
        console.error('❌ testFirestorePermissions - Mensagem:', error.message);
        console.error('❌ testFirestorePermissions - Código:', (error as any).code);
      }
      return false;
    }
  },

  // Função para limpar URLs temporárias antigas e migrar eventos
  migrateEventsImages: () => {
    try {
      console.log('🔄 migrateEventsImages - Iniciando migração...');
      
      // Carregar eventos do armazenamento local
      const cachedEvents = storage.getJSON<any[]>('cachedEvents');
      console.log('📦 migrateEventsImages - Cache encontrado:', !!cachedEvents);
      
      if (!cachedEvents || !Array.isArray(cachedEvents)) {
        console.log('ℹ️ migrateEventsImages - Nenhum evento encontrado no cache');
        return;
      }

      const events = cachedEvents;
      console.log('📊 migrateEventsImages - Eventos no cache:', events.length);
      
      if (events.length > 0) {
        console.log('🔍 migrateEventsImages - Primeiro evento:', events[0]);
        if (events[0].image) {
          console.log('🖼️ migrateEventsImages - Primeira imagem:', events[0].image.substring(0, 50) + '...');
          console.log('🖼️ migrateEventsImages - É blob?', events[0].image.startsWith('blob:'));
          console.log('🖼️ migrateEventsImages - É base64?', events[0].image.startsWith('data:'));
        }
      }
      
      let hasChanges = false;

      // Verificar se há eventos com URLs temporárias
      const updatedEvents = events.map((event: any) => {
        if (event.image && typeof event.image === 'string' && event.image.startsWith('blob:')) {
          console.log('🗑️ migrateEventsImages - Removendo URL temporária do evento:', event.title);
          hasChanges = true;
          return {
            ...event,
            image: '' // Remover imagem temporária
          };
        }
        return event;
      });

      // Salvar eventos atualizados se houver mudanças
      if (hasChanges) {
        storage.setJSON('cachedEvents', updatedEvents);
        console.log('✅ migrateEventsImages - Eventos migrados com sucesso');
        
        // Disparar evento de sincronização
        window.dispatchEvent(new CustomEvent('eventsUpdated'));
        console.log('📡 migrateEventsImages - Evento de sincronização disparado');
      } else {
        console.log('ℹ️ migrateEventsImages - Nenhuma migração necessária');
      }
    } catch (error) {
      console.error('❌ migrateEventsImages - Erro ao migrar eventos:', error);
    }
  }
};

export default {
  transactionsAPI,
  membersAPI,
  categoriesAPI,
  authAPI,
  usersAPI,
  reportsAPI,
  eventsAPI
}