import React, { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import LoadingSpinner from '../components/LoadingSpinner';

// Definindo a interface para o objeto de usuário
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar os usuários da API
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Erro ao carregar usuários.');
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega os usuários quando o componente é montado
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Função para lidar com a submissão do formulário de criação
  const handleCreateUser = async (formData: any) => {
    try {
      await usersAPI.createUser(formData);
      toast.success('Usuário criado com sucesso!');
      loadUsers(); // Recarrega a lista de usuários
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao criar usuário.';
      toast.error(errorMessage);
      console.error('Erro ao criar usuário:', error);
      // Lançar o erro novamente para que o formulário saiba que a submissão falhou
      throw error;
    }
  };

  // Função para lidar com a exclusão de usuário
  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await usersAPI.deleteUser(id);
        toast.success('Usuário deletado com sucesso!');
        loadUsers(); // Recarrega a lista de usuários
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Erro ao deletar usuário.';
        toast.error(errorMessage);
        console.error('Erro ao deletar usuário:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gerenciamento de Usuários</h1>
          <p className="mt-1 text-md text-slate-600">
            Adicione, visualize e gerencie os usuários administradores do sistema.
          </p>
        </div>
        {/* Formulário para adicionar novo usuário (direto na página) */}
        <UserForm onSubmit={handleCreateUser} />
      </div>

      {/* Lista de usuários existentes */}
      {loading ? <LoadingSpinner /> : <UserList users={users} onDelete={handleDeleteUser} />}
    </div>
  );
};

export default Users;