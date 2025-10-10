import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
  const { user } = useAuth();

  useEffect(() => {
    loadMembers();
  }, [searchTerm, statusFilter, pagination.page]);

  const loadMembers = async (forceReload = false) => {
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
  };

  const handleCreateMember = async (memberData: any) => {
    try {
      setIsCreating(true);
      await membersAPI.createMember(memberData);
      toast.success('Membro criado com sucesso!');
      setShowForm(false);
      loadMembers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao criar membro');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateMember = async (id: string | number, memberData: any) => {
    try {
      setIsUpdating(true);
      console.log('🔄 Iniciando atualização do membro:', id, 'Tipo:', typeof id);
      await membersAPI.updateMember(String(id), memberData);
      toast.success('Membro atualizado com sucesso!');
      setEditingMember(null);
      setShowForm(false);
      loadMembers(true); // Forçar recarga
    } catch (error: any) {
      console.error('❌ Erro na atualização:', error);
      toast.error(error.response?.data?.error || 'Erro ao atualizar membro');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMember = async (id: string | number) => {
    if (window.confirm('Tem certeza que deseja deletar este membro?')) {
      try {
        setIsDeleting(true);
        console.log('🗑️ Iniciando exclusão do membro:', id, 'Tipo:', typeof id);
        await membersAPI.deleteMember(String(id));
        toast.success('Membro deletado com sucesso!');
        loadMembers(true); // Forçar recarga
      } catch (error: any) {
        console.error('❌ Erro na exclusão:', error);
        toast.error(error.response?.data?.error || 'Erro ao deletar membro');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

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
        <Button onClick={() => setShowForm(true)} loading={isCreating}>
          <PlusIcon className="h-4 w-4" />
          Novo Membro
        </Button>
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
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingMember ? 'Editar Membro' : 'Novo Membro'}
      >
        <MemberForm
          member={editingMember}
          onSave={editingMember ? 
            (data) => handleUpdateMember(editingMember.id.toString(), data) :
            handleCreateMember
          }
          onClose={handleCloseForm}
          isSaving={isCreating || isUpdating}
        />
      </Modal>
    </div>
  );
};

export default Members;
