import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { transactionsAPI, categoriesAPI, membersAPI } from '../services/api';
import { mockDashboardData, simulateApiDelay } from '../services/mockData';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import useDebounce from '../hooks/useDebounce';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category_id?: number;
  member_id?: number;
  transaction_date: string;
  payment_method?: string;
  reference?: string;
  notes?: string;
  category_name?: string;
  member_name?: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

interface Member {
  id: number;
  name: string;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category_id: '',
    member_id: '',
    start_date: '',
    end_date: ''
  });

  // Debounce da busca para evitar muitas requisições
  const debouncedSearch = useDebounce(filters.search, 300);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Verificar se deve usar dados mock
      const token = localStorage.getItem('token');
      const useMockData = !token;
      
      if (useMockData) {
        // Simular delay de API
        await simulateApiDelay(600);
        
        // Usar dados mock
        setTransactions(mockDashboardData.transactions);
        setCategories(mockDashboardData.categories);
        setMembers(mockDashboardData.members);
        setPagination({
          page: 1,
          limit: 20,
          total: 0,
          pages: 0
        });
        console.log('Dados mock de transações carregados:', mockDashboardData.transactions);
      } else {
        // Tentar usar APIs reais
        const [transactionsResponse, categoriesResponse, membersResponse] = await Promise.all([
          transactionsAPI.getTransactions({
            page: pagination.page,
            limit: pagination.limit,
            ...filters
          }),
          categoriesAPI.getCategories(),
          membersAPI.getMembers({ limit: 1000 })
        ]);
        
        setTransactions(transactionsResponse.data.transactions);
        setPagination(transactionsResponse.data.pagination);
        setCategories(categoriesResponse.data);
        setMembers(membersResponse.data.members);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      
      // Em caso de erro, usar dados mock como fallback
      setTransactions(mockDashboardData.transactions);
      setCategories(mockDashboardData.categories);
      setMembers(mockDashboardData.members);
      setPagination({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
      });
      toast.info('Usando dados de demonstração');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Efeito separado para busca com debounce
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters(prev => ({ ...prev, search: debouncedSearch }));
    }
  }, [debouncedSearch, filters.search]);

  const handleCreateTransaction = useCallback(async (transactionData: any) => {
    try {
      console.log('🚀 Criando transação com dados:', transactionData);
      await transactionsAPI.createTransaction(transactionData);
      toast.success('Transação criada com sucesso!');
      setShowForm(false);
      loadData();
    } catch (error: any) {
      console.error('❌ Erro ao criar transação:', error);
      toast.error(error.response?.data?.error || 'Erro ao criar transação');
    }
  }, [loadData]);

  const handleUpdateTransaction = useCallback(async (id: number, transactionData: any) => {
    try {
      await transactionsAPI.updateTransaction(id, transactionData);
      toast.success('Transação atualizada com sucesso!');
      setEditingTransaction(null);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar transação');
    }
  }, [loadData]);

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta transação?')) {
      try {
        await transactionsAPI.deleteTransaction(id);
        toast.success('Transação deletada com sucesso!');
        loadData();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Erro ao deletar transação');
      }
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category_id: '',
      member_id: '',
      start_date: '',
      end_date: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading && transactions.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie receitas e despesas da igreja
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Nova Transação
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="search"
                  className="input pl-10"
                  placeholder="Descrição ou referência..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                id="type"
                className="input"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                id="category_id"
                className="input"
                value={filters.category_id}
                onChange={(e) => handleFilterChange('category_id', e.target.value)}
              >
                <option value="">Todas</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Member */}
            <div>
              <label htmlFor="member_id" className="block text-sm font-medium text-gray-700 mb-1">
                Membro
              </label>
              <select
                id="member_id"
                className="input"
                value={filters.member_id}
                onChange={(e) => handleFilterChange('member_id', e.target.value)}
              >
                <option value="">Todos</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                Data Início
              </label>
              <input
                type="date"
                id="start_date"
                className="input"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                Data Fim
              </label>
              <input
                type="date"
                id="end_date"
                className="input"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-secondary"
            >
              Limpar Filtros
            </button>
          </div>
        </form>
      </div>

      {/* Transactions List */}
      <TransactionList
        transactions={transactions}
        loading={loading}
        pagination={pagination}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onPageChange={handlePageChange}
      />

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          categories={categories}
          members={members}
          onSave={editingTransaction ? 
            (data) => handleUpdateTransaction(editingTransaction.id, data) : 
            handleCreateTransaction
          }
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Transactions;
