import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { membersAPI } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import MemberForm from '../components/MemberForm';
import MemberList from '../components/MemberList';

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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadMembers();
  }, [searchTerm, statusFilter, pagination.page]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await membersAPI.getMembers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        status: statusFilter
      });
      
      setMembers(response.data.members);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Erro ao carregar membros');
      console.error('Erro ao carregar membros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = async (memberData: any) => {
    try {
      await membersAPI.createMember(memberData);
      toast.success('Membro criado com sucesso!');
      setShowForm(false);
      loadMembers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao criar membro');
    }
  };

  const handleUpdateMember = async (id: number, memberData: any) => {
    try {
      await membersAPI.updateMember(id, memberData);
      toast.success('Membro atualizado com sucesso!');
      setEditingMember(null);
      loadMembers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar membro');
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este membro?')) {
      try {
        await membersAPI.deleteMember(id);
        toast.success('Membro deletado com sucesso!');
        loadMembers();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Erro ao deletar membro');
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
          <h1 className="text-2xl font-bold text-gray-900">Membros</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os membros da igreja
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Novo Membro
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="search"
                className="input pl-10"
                placeholder="Nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Buscar
          </button>
        </form>
      </div>

      {/* Members List */}
      <MemberList
        members={members}
        loading={loading}
        pagination={pagination}
        onEdit={handleEditMember}
        onDelete={handleDeleteMember}
        onPageChange={handlePageChange}
      />

      {/* Member Form Modal */}
      {showForm && (
        <MemberForm
          member={editingMember}
          onSave={editingMember ? 
            (data) => handleUpdateMember(editingMember.id, data) : 
            handleCreateMember
          }
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Members;
