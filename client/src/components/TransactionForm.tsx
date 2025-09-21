import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

interface TransactionFormProps {
  transaction?: Transaction | null;
  categories: Category[];
  members: Member[];
  onSave: (data: any) => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  transaction, 
  categories, 
  members, 
  onSave, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'income' as 'income' | 'expense',
    category_id: '',
    member_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    reference: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        amount: transaction.amount?.toString() || '',
        type: transaction.type || 'income',
        category_id: transaction.category_id?.toString() || '',
        member_id: transaction.member_id?.toString() || '',
        transaction_date: transaction.transaction_date || new Date().toISOString().split('T')[0],
        payment_method: transaction.payment_method || '',
        reference: transaction.reference || '',
        notes: transaction.notes || ''
      });
    }
  }, [transaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser um número positivo';
    }

    if (!formData.transaction_date) {
      newErrors.transaction_date = 'Data da transação é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        member_id: formData.member_id ? parseInt(formData.member_id) : null
      };
      onSave(submitData);
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {transaction ? 'Editar Transação' : 'Nova Transação'}
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
                {/* Tipo e Descrição */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Tipo *
                    </label>
                    <select
                      id="type"
                      name="type"
                      className="input mt-1"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="income">Receita</option>
                      <option value="expense">Despesa</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Valor *
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      step="0.01"
                      min="0"
                      className={`input mt-1 ${errors.amount ? 'border-red-500' : ''}`}
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0,00"
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição *
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    className={`input mt-1 ${errors.description ? 'border-red-500' : ''}`}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descrição da transação"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Categoria e Membro */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                      Categoria
                    </label>
                    <select
                      id="category_id"
                      name="category_id"
                      className="input mt-1"
                      value={formData.category_id}
                      onChange={handleChange}
                    >
                      <option value="">Selecione uma categoria</option>
                      {filteredCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="member_id" className="block text-sm font-medium text-gray-700">
                      Membro
                    </label>
                    <select
                      id="member_id"
                      name="member_id"
                      className="input mt-1"
                      value={formData.member_id}
                      onChange={handleChange}
                    >
                      <option value="">Selecione um membro</option>
                      {members.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Data e Método de Pagamento */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700">
                      Data *
                    </label>
                    <input
                      type="date"
                      id="transaction_date"
                      name="transaction_date"
                      className={`input mt-1 ${errors.transaction_date ? 'border-red-500' : ''}`}
                      value={formData.transaction_date}
                      onChange={handleChange}
                    />
                    {errors.transaction_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.transaction_date}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                      Método de Pagamento
                    </label>
                    <select
                      id="payment_method"
                      name="payment_method"
                      className="input mt-1"
                      value={formData.payment_method}
                      onChange={handleChange}
                    >
                      <option value="">Selecione</option>
                      <option value="dinheiro">Dinheiro</option>
                      <option value="pix">PIX</option>
                      <option value="cartao_debito">Cartão de Débito</option>
                      <option value="cartao_credito">Cartão de Crédito</option>
                      <option value="transferencia">Transferência</option>
                      <option value="cheque">Cheque</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                {/* Referência */}
                <div>
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                    Referência
                  </label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    className="input mt-1"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="Número do documento, comprovante, etc."
                  />
                </div>

                {/* Observações */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Observações
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="input mt-1"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Observações adicionais..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="btn btn-primary sm:ml-3 sm:w-auto w-full"
              >
                {transaction ? 'Atualizar' : 'Criar'}
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

export default TransactionForm;
