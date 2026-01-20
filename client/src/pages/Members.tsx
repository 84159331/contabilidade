import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon, LinkIcon } from '@heroicons/react/24/outline';
import { membersAPI } from '../services/api';
import { mockDashboardData, simulateApiDelay } from '../services/mockData';
import { useAuth } from '../firebase/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import MemberForm from '../components/MemberForm';
import MemberList from '../components/MemberList';
import Modal from '../components/Modal';
import Button from '../components/Button';

// ValidaÃ§Ã£o de componentes importados (apenas para logging em desenvolvimento)
const validateComponents = () => {
  if (process.env.NODE_ENV !== 'development') {
    return true; // Em produÃ§Ã£o, confiar nos imports
  }
  
  const components = {
    LoadingSpinner,
    MemberForm,
    MemberList,
    Modal,
    Button,
    PlusIcon,
    MagnifyingGlassIcon,
    LinkIcon
  };
  
  const invalid = Object.entries(components).filter(([name, comp]) => {
    const isValid = comp !== undefined && comp !== null;
    if (!isValid) {
      console.error(`âŒ Componente ${name} estÃ¡ undefined ou invÃ¡lido:`, typeof comp, comp);
    }
    return !isValid;
  });
  
  if (invalid.length > 0) {
    console.warn('âš ï¸ Componentes invÃ¡lidos encontrados:', invalid.map(([name]) => name));
    // NÃ£o bloquear renderizaÃ§Ã£o, apenas avisar
  }
  return true; // Sempre retornar true para nÃ£o bloquear renderizaÃ§Ã£o
};

interface Member {
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  cpf?: string;
  cell_group?: string;
  photo_url?: string;
  birth_date?: string;
  member_since?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const lastRouteRef = useRef<string>(location.pathname);
  const hasLoadedRef = useRef(false);

  // Resetar quando a rota mudar
  useEffect(() => {
    if (lastRouteRef.current !== location.pathname) {
      hasLoadedRef.current = false;
      lastRouteRef.current = location.pathname;
      console.log('ðŸ”„ Rota mudou em Members, resetando estado');
    }
  }, [location.pathname]);

  const loadMembers = useCallback(async (forceReload = false) => {
    // Aguardar autenticaÃ§Ã£o terminar
    if (authLoading) {
      return;
    }

    try {
      setLoading(true);
      
      // Limpar cache se forÃ§ado
      if (forceReload) {
        console.log('ðŸ”„ ForÃ§ando recarga dos membros...');
        setMembers([]);
      }
      
      // Verificar se deve usar dados mock
      const useMockData = !user;
      
      if (useMockData) {
        // Simular delay de API
        await simulateApiDelay(600);
        
        // Usar dados mock
        setMembers(mockDashboardData.members);
        setPagination({
          page: 1,
          limit: 10,
          total: mockDashboardData.members.length,
          pages: Math.ceil(mockDashboardData.members.length / 10)
        });
        console.log('Dados mock de membros carregados:', mockDashboardData.members.length);
      } else {
        // Usar API real do Firestore
        console.log('ðŸ”¥ Carregando membros do Firestore...');
        const response = await membersAPI.getMembers();
        
        // Verificar se os IDs sÃ£o vÃ¡lidos
        const validMembers = response.data.members.filter(member => {
          const isValid = typeof member.id === 'string' && member.id.length > 0;
          if (!isValid) {
            console.warn('âš ï¸ Membro com ID invÃ¡lido encontrado:', member);
          }
          return isValid;
        });
        
        setMembers(validMembers);
        setPagination({
          page: 1,
          limit: 10,
          total: validMembers.length,
          pages: Math.ceil(validMembers.length / 10)
        });
        console.log('âœ… Membros vÃ¡lidos carregados do Firestore:', validMembers.length);
      }
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
      
      // Em caso de erro, usar dados mock como fallback
      setMembers(mockDashboardData.members);
      setPagination({
        page: 1,
        limit: 10,
        total: mockDashboardData.members.length,
        pages: Math.ceil(mockDashboardData.members.length / 10)
      });
      console.log('Usando dados mock como fallback');
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    // Aguardar auth terminar
    if (authLoading) {
      return;
    }

    // Carregar apenas se ainda nÃ£o carregou ou se filtros mudaram
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadMembers();
    } else if (searchTerm || statusFilter || pagination.page > 1) {
      // Se jÃ¡ carregou, sÃ³ recarregar se filtros mudaram
      loadMembers();
    }
  }, [searchTerm, statusFilter, pagination.page, authLoading, location.pathname, loadMembers]);

  const handleCreateMember = useCallback(async (memberData: any) => {
    // Validar dados antes de enviar
    if (!memberData || typeof memberData !== 'object') {
      console.error('âŒ Dados invÃ¡lidos para criar membro:', memberData);
      toast.error('Dados invÃ¡lidos para criar membro');
      return;
    }

    try {
      setIsCreating(true);
      console.log('âœ… Criando membro com dados:', memberData);
      await membersAPI.createMember(memberData);
      toast.success('Membro criado com sucesso!');
      setShowForm(false);
      setEditingMember(null);
      await loadMembers(true);
    } catch (error: any) {
      console.error('âŒ Erro ao criar membro:', error);
      toast.error(error.response?.data?.error || error.message || 'Erro ao criar membro');
    } finally {
      setIsCreating(false);
    }
  }, [loadMembers]);

  const handleUpdateMember = useCallback(async (id: string | number, memberData: any) => {
    // Validar ID e dados antes de enviar
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
      console.error('âŒ ID invÃ¡lido para atualizar membro:', id);
      toast.error('ID invÃ¡lido para atualizar membro');
      return;
    }

    if (!memberData || typeof memberData !== 'object') {
      console.error('âŒ Dados invÃ¡lidos para atualizar membro:', memberData);
      toast.error('Dados invÃ¡lidos para atualizar membro');
      return;
    }

    try {
      setIsUpdating(true);
      const memberId = String(id);
      console.log('ðŸ”„ Iniciando atualizaÃ§Ã£o do membro:', memberId, 'Tipo:', typeof id);
      await membersAPI.updateMember(memberId, memberData);
      toast.success('Membro atualizado com sucesso!');
      setEditingMember(null);
      setShowForm(false);
      await loadMembers(true); // ForÃ§ar recarga
    } catch (error: any) {
      console.error('âŒ Erro na atualizaÃ§Ã£o:', error);
      toast.error(error.response?.data?.error || error.message || 'Erro ao atualizar membro');
    } finally {
      setIsUpdating(false);
    }
  }, [loadMembers]);

  const handleDeleteMember = useCallback(async (id: string | number) => {
    // Validar ID antes de deletar
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
      console.error('âŒ ID invÃ¡lido para deletar membro:', id);
      toast.error('ID invÃ¡lido para deletar membro');
      return;
    }

    if (window.confirm('Tem certeza que deseja deletar este membro?')) {
      try {
        setIsDeleting(true);
        const memberId = String(id);
        console.log('ðŸ—‘ï¸ Iniciando exclusÃ£o do membro:', memberId, 'Tipo:', typeof id);
        
        // Remover do estado local imediatamente para evitar render com membro deletado
        setMembers(prevMembers => {
          const filtered = prevMembers.filter(m => String(m.id) !== memberId);
          console.log('ðŸ”„ Removendo membro do estado local. Antes:', prevMembers.length, 'Depois:', filtered.length);
          return filtered;
        });
        
        await membersAPI.deleteMember(memberId);
        toast.success('Membro deletado com sucesso!');
        
        // Recarregar para garantir sincronizaÃ§Ã£o
        await loadMembers(true);
      } catch (error: any) {
        console.error('âŒ Erro na exclusÃ£o:', error);
        toast.error(error.response?.data?.error || error.message || 'Erro ao deletar membro');
        // Em caso de erro, recarregar para restaurar estado
        await loadMembers(true);
      } finally {
        setIsDeleting(false);
      }
    }
  }, [loadMembers]);

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  // Handler unificado para salvar (criar ou atualizar)
  const handleSaveMember = useCallback((data: any) => {
    // Validar dados antes de salvar
    if (!data || typeof data !== 'object') {
      console.error('âŒ Dados invÃ¡lidos no formulÃ¡rio:', data);
      toast.error('Dados invÃ¡lidos no formulÃ¡rio');
      return;
    }

    if (editingMember && editingMember.id) {
      // Atualizar membro existente
      const memberId = editingMember.id;
      console.log('ðŸ”„ Salvando atualizaÃ§Ã£o do membro:', memberId);
      handleUpdateMember(memberId, data).catch((error) => {
        console.error('âŒ Erro ao salvar atualizaÃ§Ã£o:', error);
      });
    } else {
      // Criar novo membro
      console.log('âœ… Salvando novo membro');
      handleCreateMember(data).catch((error) => {
        console.error('âŒ Erro ao salvar novo membro:', error);
      });
    }
  }, [editingMember, handleUpdateMember, handleCreateMember]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // ValidaÃ§Ã£o de componentes (apenas para logging)
  validateComponents();

  if (loading && members.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Membros</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie os membros da igreja
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary"
            onClick={() => window.open('/cadastro', '_blank')}
          >
            <LinkIcon className="h-4 w-4" />
            Link de Cadastro
          </Button>
          <Button onClick={() => navigate('/tesouraria/members/new')} >
            <PlusIcon className="h-4 w-4" />
            Novo Membro
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Buscar
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                id="search"
                className="input pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              className="input dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
          <Button type="submit">
            Buscar
          </Button>
        </form>
      </div>

      {/* Members List */}
      <MemberList
        members={members || []}
        loading={loading}
        pagination={pagination}
        onEdit={handleEditMember}
        onDelete={handleDeleteMember}
        isDeleting={isDeleting}
        onPageChange={handlePageChange}
      />

      {/* Member Form Modal */}
      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={handleCloseForm}
          title={editingMember ? 'Editar Membro' : 'Novo Membro'}
        >
          <MemberForm
            member={editingMember}
            onSave={handleSaveMember}
            onClose={handleCloseForm}
            isSaving={editingMember ? isUpdating : isCreating}
          />
        </Modal>
      )}
    </div>
  );
};

export default Members;
