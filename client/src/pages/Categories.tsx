import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { categoriesAPI } from '../services/api';
import { mockDashboardData, simulateApiDelay } from '../services/mockData';
import { useAuth } from '../firebase/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';

interface Category {
  id: string | number;
  name: string;
  type: 'income' | 'expense';
  description?: string;
  color: string;
  default_amount?: number; // Adicionado
  transaction_count: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadCategories();
  }, [typeFilter]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Verificar se deve usar dados mock
      const useMockData = !user;
      
      console.log('🔍 Usuário logado:', user ? 'Sim' : 'Não');
      console.log('🔍 Usando dados mock:', useMockData ? 'Sim' : 'Não');
      
      if (useMockData) {
        // Simular delay de API
        await simulateApiDelay(400);
        
        // Usar dados mock
        setCategories(mockDashboardData.categories);
        console.log('Dados mock de categorias carregados:', mockDashboardData.categories);
      } else {
        // Usar API real do Firestore
        console.log('🔥 Carregando categorias do Firestore...');
        const response = await categoriesAPI.getCategories();
        console.log('📊 Resposta da API:', response);
        setCategories(response.data.categories);
        console.log('✅ Categorias carregadas do Firestore:', response.data.categories.length);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      
      // Em caso de erro, usar dados mock como fallback
      setCategories(mockDashboardData.categories);
      console.log('Usando dados mock como fallback');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (categoryData: any) => {
    try {
      console.log('🔄 Iniciando criação de categoria...');
      console.log('📝 Dados da categoria:', categoryData);
      console.log('👤 Usuário logado:', user ? 'Sim' : 'Não');
      
      const response = await categoriesAPI.createCategory(categoryData);
      console.log('✅ Categoria criada com sucesso:', response);
      
      toast.success('Categoria criada com sucesso!');
      setShowForm(false);
      
      console.log('🔄 Recarregando categorias...');
      await loadCategories();
      console.log('✅ Categorias recarregadas');
      
      // Verificar se a categoria foi adicionada
      console.log('📊 Categorias atuais:', categories.length);
    } catch (error: any) {
      console.error('❌ Erro ao criar categoria:', error);
      console.error('❌ Detalhes do erro:', error.message);
      toast.error(error.response?.data?.error || 'Erro ao criar categoria');
    }
  };

  const handleUpdateCategory = async (id: string, categoryData: any) => {
    try {
      await categoriesAPI.updateCategory(id, categoryData);
      toast.success('Categoria atualizada com sucesso!');
      setEditingCategory(null);
      loadCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar categoria');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        await categoriesAPI.deleteCategory(id);
        toast.success('Categoria deletada com sucesso!');
        loadCategories();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Erro ao deletar categoria');
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  if (loading && categories.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as categorias de receitas e despesas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Nova Categoria
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              id="type"
              className="input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
            >
              <option value="all">Todas</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <CategoryList
        categories={categories.filter(category => 
          typeFilter === 'all' || category.type === typeFilter
        )}
        loading={loading}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSave={editingCategory ? 
            (data) => handleUpdateCategory(editingCategory.id.toString(), data) : 
            handleCreateCategory
          }
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Categories;