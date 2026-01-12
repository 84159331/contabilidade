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
      console.log('🔄 Rota mudou em Members, resetando estado');
    }
  }, [location.pathname]);

  const loadMembers = useCallback(async (forceReload = false) => {
    // Aguardar autenticação terminar
    if (authLoading) {
      return;
    }

    try {
      setLoading(true);
      
      // Limpar cache se forçado
      if (forceReload) {
        console.log('🔄 Forçando recarga dos membros...');
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
        console.log('🔥 Carregando membros do Firestore...');
        const response = await membersAPI.getMembers();
        
        // Verificar se os IDs são válidos
        const validMembers = response.data.members.filter(member => {
          const isValid = typeof member.id === 'string' && member.id.length > 0;
          if (!isValid) {
            console.warn('⚠️ Membro com ID inválido encontrado:', member);
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
        console.log('✅ Membros válidos carregados do Firestore:', validMembers.length);
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

    // Carregar apenas se ainda não carregou ou se filtros mudaram
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadMembers();
    } else if (searchTerm || statusFilter || pagination.page > 1) {
      // Se já carregou, só recarregar se filtros mudaram
      loadMembers();
    }
  }, [searchTerm, statusFilter, pagination.page, authLoading, location.pathname, loadMembers]);

  const handleCreateMember = useCallback(async (memberData: any) => {
    // Validar dados antes de enviar
    if (!memberData || typeof memberData !== 'object') {
      console.error('❌ Dados inválidos para criar membro:', memberData);
      toast.error('Dados inválidos para criar membro');
      return;
    }

    try {
      setIsCreating(true);
      console.log('✅ Criando membro com dados:', memberData);
      await membersAPI.createMember(memberData);
      toast.success('Membro criado com sucesso!');
      setShowForm(false);
      setEditingMember(null);
      await loadMembers(true);
    } catch (error: any) {
      console.error('❌ Erro ao criar membro:', error);
      toast.error(error.response?.data?.error || error.message || 'Erro ao criar membro');
    } finally {
      setIsCreating(false);
    }
  }, [loadMembers]);

  const handleUpdateMember = useCallback(async (id: string | number, memberData: any) => {
    // Validar ID e dados antes de enviar
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
      console.error('❌ ID inválido para atualizar membro:', id);
      toast.error('ID inválido para atualizar membro');
      return;
    }

    if (!memberData || typeof memberData !== 'object') {
      console.error('❌ Dados inválidos para atualizar membro:', memberData);
      toast.error('Dados inválidos para atualizar membro');
      return;
    }

    try {
      setIsUpdating(true);
      const memberId = String(id);
      console.log('🔄 Iniciando atualização do membro:', memberId, 'Tipo:', typeof id);
      await membersAPI.updateMember(memberId, memberData);
      toast.success('Membro atualizado com sucesso!');
      setEditingMember(null);
      setShowForm(false);
      await loadMembers(true); // Forçar recarga
    } catch (error: any) {
      console.error('❌ Erro na atualização:', error);
      toast.error(error.response?.data?.error || error.message || 'Erro ao atualizar membro');
    } finally {
      setIsUpdating(false);
    }
  }, [loadMembers]);

  const handleDeleteMember = useCallback(async (id: string | number) => {
    // Validar ID antes de deletar
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
      console.error('❌ ID inválido para deletar membro:', id);
      toast.error('ID inválido para deletar membro');
      return;
    }

    if (window.confirm('Tem certeza que deseja deletar este membro?')) {
      try {
        setIsDeleting(true);
        const memberId = String(id);
        console.log('🗑️ Iniciando exclusão do membro:', memberId, 'Tipo:', typeof id);
        await membersAPI.deleteMember(memberId);
        toast.success('Membro deletado com sucesso!');
        await loadMembers(true); // Forçar recarga
      } catch (error: any) {
        console.error('❌ Erro na exclusão:', error);
        toast.error(error.response?.data?.error || error.message || 'Erro ao deletar membro');
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
      console.error('❌ Dados inválidos no formulário:', data);
      toast.error('Dados inválidos no formulário');
      return;
    }

    if (editingMember && editingMember.id) {
      // Atualizar membro existente
      const memberId = editingMember.id;
      console.log('🔄 Salvando atualização do membro:', memberId);
      handleUpdateMember(memberId, data).catch((error) => {
        console.error('❌ Erro ao salvar atualização:', error);
      });
    } else {
      // Criar novo membro
      console.log('✅ Salvando novo membro');
      handleCreateMember(data).catch((error) => {
        console.error('❌ Erro ao salvar novo membro:', error);
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

  // Validação apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    if (!LoadingSpinner || !MemberForm || !MemberList || !Modal || !Button) {
      console.error('❌ Componente crítico não encontrado em Members!');
      return <div>Erro: Componente não encontrado</div>;
    }
  }

  if (loading && members.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Membros</h1>
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
        members={members}
        loading={loading}
        pagination={pagination}
        onEdit={handleEditMember}
        onDelete={handleDeleteMember}
        isDeleting={isDeleting}
        onPageChange={handlePageChange}
      />

      {/* Member Form Modal */}
      {showForm && Modal && MemberForm && (
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
