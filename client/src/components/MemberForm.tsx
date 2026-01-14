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
  // Usa mÃ©todos UTC para evitar problemas de fuso horÃ¡rio
  const formatDateForInput = (dateValue: string | undefined | null): string => {
    if (!dateValue) return '';
    
    // Se jÃ¡ estÃ¡ no formato YYYY-MM-DD, retornar como estÃ¡
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
      
      // Usar mÃ©todos UTC para evitar problemas de fuso horÃ¡rio
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    // SÃ³ atualizar quando o membro realmente mudar (comparar por ID)
    if (member) {
      const memberId = member.id;
      
      // Se Ã© o mesmo membro que jÃ¡ estÃ¡ sendo editado, nÃ£o resetar os dados
      if (currentMemberIdRef.current === memberId) {
        return; // Preservar dados que o usuÃ¡rio pode estar editando
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
      // Resetar apenas se realmente nÃ£o hÃ¡ membro
      if (currentMemberIdRef.current !== null) {
        currentMemberIdRef.current = null;
        // Resetar formulÃ¡rio apenas se estiver vazio (usuÃ¡rio pode estar preenchendo)
        setFormData(prev => {
          // Se o usuÃ¡rio jÃ¡ comeÃ§ou a preencher, nÃ£o resetar
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
  }, [member?.id]); // Depender apenas do ID para evitar re-renders desnecessÃ¡rios

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Para campos de data, garantir que o valor seja preservado
    let processedValue = value;
    if (name === 'birth_date' || name === 'member_since') {
      // Se o campo de data estiver vazio ou no formato correto, usar como estÃ¡
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        // Tentar converter se nÃ£o estiver no formato correto
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
      newErrors.name = 'Nome Ã© obrigatÃ³rio';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invÃ¡lido';
    }

    if (formData.phone && !/^[\d\s()\-+]+$/.test(formData.phone)) {
      newErrors.phone = 'Telefone invÃ¡lido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que onSave existe e Ã© uma funÃ§Ã£o
    if (!onSave || typeof onSave !== 'function') {
      console.error('âŒ onSave nÃ£o Ã© uma funÃ§Ã£o vÃ¡lida:', onSave);
      return;
    }
    
    if (validateForm()) {
      try {
        onSave(formData);
      } catch (error) {
        console.error('âŒ Erro ao chamar onSave:', error);
      }
    }
  };

  // Auto-scroll para campo ativo quando teclado aparece (mobile)
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (window.innerWidth <= 640) {
      // Pequeno delay para garantir que o teclado apareceu
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4 sm:space-y-5">
        {/* Nome */}
        <div>
          <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`input mt-1 ${errors.name ? 'border-red-500' : ''}`}
            value={formData.name}
            onChange={handleChange}
            onFocus={handleInputFocus}
            placeholder="Nome completo"
            autoComplete="name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email e Telefone */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`input mt-1 ${errors.email ? 'border-red-500' : ''}`}
              value={formData.email}
              onChange={handleChange}
              onFocus={handleInputFocus}
              placeholder="email@exemplo.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`input mt-1 ${errors.phone ? 'border-red-500' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              onFocus={handleInputFocus}
              placeholder="(11) 99999-9999"
              autoComplete="tel"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* EndereÃ§o */}
        <div>
          <label htmlFor="address" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
            EndereÃ§o
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="input mt-1"
            value={formData.address}
            onChange={handleChange}
            onFocus={handleInputFocus}
            placeholder="EndereÃ§o completo"
            autoComplete="street-address"
          />
        </div>

        {/* Data de Nascimento e Membro Desde */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="birth_date" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de Nascimento
            </label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              className="input mt-1"
              value={formData.birth_date}
              onChange={handleChange}
              onFocus={handleInputFocus}
            />
          </div>

          <div>
            <label htmlFor="member_since" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
              Membro Desde
            </label>
            <input
              type="date"
              id="member_since"
              name="member_since"
              className="input mt-1"
              value={formData.member_since}
              onChange={handleChange}
              onFocus={handleInputFocus}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="input mt-1"
            value={formData.status}
            onChange={handleChange}
            onFocus={handleInputFocus}
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>

        {/* ObservaÃ§Ãµes */}
        <div>
          <label htmlFor="notes" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
            ObservaÃ§Ãµes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="input mt-1 min-h-[100px] resize-y"
            value={formData.notes}
            onChange={handleChange}
            onFocus={handleInputFocus}
            placeholder="ObservaÃ§Ãµes adicionais..."
          />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-6 -mx-6 -mb-6 rounded-b-lg gap-3 sm:gap-0">
        {Button ? (
          <>
            <Button
              type="submit"
              className="sm:ml-3 sm:w-auto w-full min-h-[44px]"
              loading={isSaving}
            >
              {member ? 'Atualizar' : 'Criar'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="mt-3 sm:mt-0 sm:w-auto w-full min-h-[44px]"
            >
              Cancelar
            </Button>
          </>
        ) : (
          <div className="text-red-600">Erro: Componente Button nÃ£o encontrado</div>
        )}
      </div>
    </form>
  );
};

export default MemberForm;
