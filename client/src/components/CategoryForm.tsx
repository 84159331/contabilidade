import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string | number;
  name: string;
  type: 'income' | 'expense';
  description?: string;
  color: string;
  default_amount?: number; // Adicionado
}

interface CategoryFormProps {
  category?: Category | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'income' as 'income' | 'expense',
    description: '',
    color: '#3B82F6',
    default_amount: 0, // Adicionado
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Removido colorOptions não utilizado

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        type: category.type || 'income',
        description: category.description || '',
        color: category.color || '#3B82F6',
        default_amount: category.default_amount || 0, // Adicionado
      });
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'default_amount' ? parseFloat(value) || 0 : value // Converte para número se for default_amount
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.type) {
      newErrors.type = 'Tipo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {category ? 'Editar Categoria' : 'Nova Categoria'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Nome e Tipo */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`input mt-1 ${errors.name ? 'border-red-500' : ''}`}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nome da categoria"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Tipo *
                    </label>
                    <select
                      id="type"
                      name="type"
                      className={`input mt-1 ${errors.type ? 'border-red-500' : ''}`}
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="income">Receita</option>
                      <option value="expense">Despesa</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                    )}
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="input mt-1"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descrição da categoria..."
                  />
                </div>

                {/* Valor Padrão (default_amount) */}
                <div>
                  <label htmlFor="default_amount" className="block text-sm font-medium text-gray-700">
                    Valor Padrão (opcional)
                  </label>
                  <input
                    type="number"
                    id="default_amount"
                    name="default_amount"
                    className="input mt-1"
                    value={formData.default_amount}
                    onChange={handleChange}
                    placeholder="Ex: 100.00"
                    step="0.01" // Permite valores decimais
                  />
                </div>

                {/* Cor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor
                  </label>
                  {/* Original color input was here, now just a text input for simplicity */}
                  <input
                    type="text"
                    name="color"
                    id="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="btn btn-primary sm:ml-3 sm:w-auto w-full"
              >
                {category ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary mt-3 sm:mt-0 sm:w-auto w-full"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;