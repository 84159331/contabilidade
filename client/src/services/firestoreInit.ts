// Script para inicializar dados padrão no Firestore
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase/config';

// Função para inicializar categorias padrão
export const initializeDefaultCategories = async () => {
  try {
    console.log('🏷️ Inicializando categorias padrão...');
    
    const categoriesRef = collection(db, 'categories');
    
    // Verificar se já existem categorias
    const snapshot = await getDocs(categoriesRef);
    
    if (snapshot.empty) {
      console.log('📝 Criando categorias padrão...');
      
      const defaultCategories = [
        // Categorias de Receita
        {
          name: 'Dízimos',
          type: 'income',
          description: 'Dízimos dos membros',
          color: '#10B981'
        },
        {
          name: 'Ofertas',
          type: 'income',
          description: 'Ofertas especiais',
          color: '#3B82F6'
        },
        {
          name: 'Eventos',
          type: 'income',
          description: 'Receitas de eventos',
          color: '#8B5CF6'
        },
        {
          name: 'Doações',
          type: 'income',
          description: 'Doações diversas',
          color: '#F59E0B'
        },
        
        // Categorias de Despesa
        {
          name: 'Utilidades',
          type: 'expense',
          description: 'Contas de água, luz, telefone',
          color: '#EF4444'
        },
        {
          name: 'Manutenção',
          type: 'expense',
          description: 'Manutenção do prédio',
          color: '#F97316'
        },
        {
          name: 'Material',
          type: 'expense',
          description: 'Material de escritório e limpeza',
          color: '#84CC16'
        },
        {
          name: 'Eventos',
          type: 'expense',
          description: 'Despesas com eventos',
          color: '#06B6D4'
        },
        {
          name: 'Ministério',
          type: 'expense',
          description: 'Despesas ministeriais',
          color: '#8B5CF6'
        },
        {
          name: 'Outros',
          type: 'expense',
          description: 'Outras despesas',
          color: '#6B7280'
        }
      ];

      // Adicionar cada categoria
      for (const category of defaultCategories) {
        const categoryData = {
          ...category,
          created_at: new Date(),
          updated_at: new Date()
        };
        
        await addDoc(categoriesRef, categoryData);
        console.log(`✅ Categoria criada: ${category.name}`);
      }
      
      console.log('🎉 Todas as categorias padrão foram criadas!');
    } else {
      console.log('ℹ️ Categorias já existem no banco de dados');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar categorias:', error);
    throw error;
  }
};

// Função para inicializar dados de exemplo
export const initializeSampleData = async () => {
  try {
    console.log('📊 Inicializando dados de exemplo...');
    
    // Verificar se já existem transações
    const transactionsRef = collection(db, 'transactions');
    const transactionsSnapshot = await getDocs(transactionsRef);
    
    if (transactionsSnapshot.empty) {
      console.log('📝 Criando transações de exemplo...');
      
      const sampleTransactions = [
        {
          description: 'Dízimo - João Silva',
          amount: 500.00,
          type: 'income',
          category_id: null, // Será preenchido após criar categorias
          member_id: null,
          transaction_date: '2024-01-15',
          payment_method: 'Dinheiro',
          reference: 'DIZ-001',
          notes: 'Dízimo mensal',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          description: 'Oferta - Maria Santos',
          amount: 200.00,
          type: 'income',
          category_id: null,
          member_id: null,
          transaction_date: '2024-01-15',
          payment_method: 'PIX',
          reference: 'OFE-001',
          notes: 'Oferta especial',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          description: 'Conta de luz',
          amount: 150.00,
          type: 'expense',
          category_id: null,
          member_id: null,
          transaction_date: '2024-01-14',
          payment_method: 'Transferência',
          reference: 'DESP-001',
          notes: 'Conta de luz da igreja',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      // Adicionar transações de exemplo
      for (const transaction of sampleTransactions) {
        await addDoc(transactionsRef, transaction);
        console.log(`✅ Transação criada: ${transaction.description}`);
      }
      
      console.log('🎉 Dados de exemplo criados!');
    } else {
      console.log('ℹ️ Transações já existem no banco de dados');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar dados de exemplo:', error);
    throw error;
  }
};

// Função principal para inicializar tudo
export const initializeFirestore = async () => {
  try {
    console.log('🚀 Inicializando Firestore...');
    
    await initializeDefaultCategories();
    await initializeSampleData();
    
    console.log('✅ Firestore inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firestore:', error);
    throw error;
  }
};

export default {
  initializeDefaultCategories,
  initializeSampleData,
  initializeFirestore
};
