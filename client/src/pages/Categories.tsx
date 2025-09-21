import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { categoriesAPI } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  description?: string;
  color: string;
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

  useEffect(() => {
    loadCategories();
  }, [typeFilter]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getCategories({
        type: typeFilter === 'all' ? undefined : typeFilter
      });
      setCategories(response.data);
    } catch (error) {
      toast.error('Erro ao carregar categorias');
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (categoryData: any) => {
    try {
      await categoriesAPI.createCategory(categoryData);
      toast.success('Categoria criada com sucesso!');
      setShowForm(false);
      loadCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao criar categoria');
    }
  };

  const handleUpdateCategory = async (id: number, categoryData: any) => {
    try {
      await categoriesAPI.updateCategory(id, categoryData);
      toast.success('Categoria atualizada com sucesso!');
      setEditingCategory(null);
      loadCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar categoria');
    }
  };

  const handleDeleteCategory = async (id: number) => {
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
        categories={categories}
        loading={loading}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSave={editingCategory ? 
            (data) => handleUpdateCategory(editingCategory.id, data) : 
            handleCreateCategory
          }
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Categories;
