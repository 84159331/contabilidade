import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Member {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  member_since?: string;
  status: string;
  notes?: string;
}

interface MemberFormProps {
  member?: Member | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    member_since: '',
    status: 'active',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        birth_date: member.birth_date || '',
        member_since: member.member_since || '',
        status: member.status || 'active',
        notes: member.notes || ''
      });
    }
  }, [member]);

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

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.phone && !/^[\d\s\(\)\-\+]+$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
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
                  {member ? 'Editar Membro' : 'Novo Membro'}
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
                {/* Nome */}
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
                    placeholder="Nome completo"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email e Telefone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`input mt-1 ${errors.email ? 'border-red-500' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@exemplo.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`input mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Endereço
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="input mt-1"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Endereço completo"
                  />
                </div>

                {/* Data de Nascimento e Membro Desde */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      id="birth_date"
                      name="birth_date"
                      className="input mt-1"
                      value={formData.birth_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="member_since" className="block text-sm font-medium text-gray-700">
                      Membro Desde
                    </label>
                    <input
                      type="date"
                      id="member_since"
                      name="member_since"
                      className="input mt-1"
                      value={formData.member_since}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="input mt-1"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
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
                {member ? 'Atualizar' : 'Criar'}
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

export default MemberForm;
