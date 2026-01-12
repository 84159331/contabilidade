import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';

interface Member {
  id: number | string;
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
  isSaving?: boolean;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onSave, onClose, isSaving = false }) => {
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
  const currentMemberIdRef = useRef<string | number | null>(null);

  // Helper para formatar data para input type="date" (YYYY-MM-DD)
  // Usa métodos UTC para evitar problemas de fuso horário
  const formatDateForInput = (dateValue: string | undefined | null): string => {
    if (!dateValue) return '';
    
    // Se já está no formato YYYY-MM-DD, retornar como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    
    // Tentar extrair YYYY-MM-DD de strings em outros formatos
    const dateMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      return dateMatch[0]; // Retornar YYYY-MM-DD
    }
    
    // Tentar converter de outros formatos usando UTC para evitar problemas de timezone
    try {
      // Se a string tem formato de data, fazer parse manual para evitar problemas de timezone
      const parts = dateValue.split(/[-\/]/);
      if (parts.length === 3) {
        let year, month, day;
        
        // Detectar formato (DD/MM/YYYY ou YYYY-MM-DD)
        if (parts[0].length === 4) {
          // YYYY-MM-DD ou YYYY/MM/DD
          year = parseInt(parts[0], 10);
          month = parseInt(parts[1], 10);
          day = parseInt(parts[2], 10);
        } else {
          // DD/MM/YYYY ou DD-MM-YYYY
          day = parseInt(parts[0], 10);
          month = parseInt(parts[1], 10);
          year = parseInt(parts[2], 10);
        }
        
        // Validar valores
        if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
      }
      
      // Fallback: usar Date com UTC
      const date = new Date(dateValue + 'T00:00:00Z'); // Adicionar hora UTC para evitar problemas
      if (isNaN(date.getTime())) return '';
      
      // Usar métodos UTC para evitar problemas de fuso horário
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    // Só atualizar quando o membro realmente mudar (comparar por ID)
    if (member) {
      const memberId = member.id;
      
      // Se é o mesmo membro que já está sendo editado, não resetar os dados
      if (currentMemberIdRef.current === memberId) {
        return; // Preservar dados que o usuário pode estar editando
      }
      
      // Novo membro ou membro diferente - carregar dados
      currentMemberIdRef.current = memberId;
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        birth_date: formatDateForInput(member.birth_date),
        member_since: formatDateForInput(member.member_since),
        status: member.status || 'active',
        notes: member.notes || ''
      });
    } else {
      // Resetar apenas se realmente não há membro
      if (currentMemberIdRef.current !== null) {
        currentMemberIdRef.current = null;
        // Resetar formulário apenas se estiver vazio (usuário pode estar preenchendo)
        setFormData(prev => {
          // Se o usuário já começou a preencher, não resetar
          if (prev.name || prev.email || prev.phone || prev.birth_date) {
            return prev;
          }
          // Resetar apenas se estiver completamente vazio
          return {
            name: '',
            email: '',
            phone: '',
            address: '',
            birth_date: '',
            member_since: '',
            status: 'active',
            notes: ''
          };
        });
      }
    }
  }, [member?.id]); // Depender apenas do ID para evitar re-renders desnecessários

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Para campos de data, garantir que o valor seja preservado
    let processedValue = value;
    if (name === 'birth_date' || name === 'member_since') {
      // Se o campo de data estiver vazio ou no formato correto, usar como está
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        // Tentar converter se não estiver no formato correto
        processedValue = formatDateForInput(value) || value;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
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

    if (formData.phone && !/^[\d\s()\-+]+$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que onSave existe e é uma função
    if (!onSave || typeof onSave !== 'function') {
      console.error('❌ onSave não é uma função válida:', onSave);
      return;
    }
    
    if (validateForm()) {
      try {
        onSave(formData);
      } catch (error) {
        console.error('❌ Erro ao chamar onSave:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-6 -mx-6 -mb-6 rounded-b-lg">
        {Button ? (
          <>
            <Button
              type="submit"
              className="sm:ml-3 sm:w-auto w-full"
              loading={isSaving}
            >
              {member ? 'Atualizar' : 'Criar'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="mt-3 sm:mt-0 sm:w-auto w-full"
            >
              Cancelar
            </Button>
          </>
        ) : (
          <div className="text-red-600">Erro: Componente Button não encontrado</div>
        )}
      </div>
    </form>
  );
};

export default MemberForm;
