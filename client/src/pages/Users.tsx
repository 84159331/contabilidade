import React, { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../services/api';
import { mockDashboardData, simulateApiDelay } from '../services/mockData';
import { toast } from 'react-toastify';
import storage from '../utils/storage';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import LoadingSpinner from '../components/LoadingSpinner';

// Definindo a interface para o objeto de usuÃ¡rio
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
  const [showForm, setShowForm] = useState(false);

  // FunÃ§Ã£o para carregar os usuÃ¡rios da API
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Verificar se deve usar dados mock
      const token = storage.getString('token');
      const useMockData = !token;
      
      if (useMockData) {
        // Simular delay de API
        await simulateApiDelay(600);
        
        // Usar dados mock
        setUsers(mockDashboardData.users);
        console.log('Dados mock de usuÃ¡rios carregados:', mockDashboardData.users);
      } else {
        // Tentar usar API real
        const response = await usersAPI.getUsers();
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Erro ao buscar usuÃ¡rios:', error);
      
      // Em caso de erro, usar dados mock como fallback
      setUsers(mockDashboardData.users);
      toast.info('Usando dados de demonstraÃ§Ã£o');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega os usuÃ¡rios quando o componente Ã© montado
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // FunÃ§Ã£o para lidar com a submissÃ£o do formulÃ¡rio de criaÃ§Ã£o
  const handleCreateUser = async (formData: any) => {
    try {
      await usersAPI.createUser(formData);
      toast.success('UsuÃ¡rio criado com sucesso!');
      loadUsers(); // Recarrega a lista de usuÃ¡rios
      setShowForm(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao criar usuÃ¡rio.';
      toast.error(errorMessage);
      console.error('Erro ao criar usuÃ¡rio:', error);
      // LanÃ§ar o erro novamente para que o formulÃ¡rio saiba que a submissÃ£o falhou
      throw error;
    }
  };

  // FunÃ§Ã£o para lidar com a exclusÃ£o de usuÃ¡rio
  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este usuÃ¡rio?')) {
      try {
        await usersAPI.deleteUser(id);
        toast.success('UsuÃ¡rio deletado com sucesso!');
        loadUsers(); // Recarrega a lista de usuÃ¡rios
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Erro ao deletar usuÃ¡rio.';
        toast.error(errorMessage);
        console.error('Erro ao deletar usuÃ¡rio:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Gerenciamento de UsuÃ¡rios</h1>
          <p className="mt-1 text-md text-slate-600 dark:text-gray-400">
            Adicione, visualize e gerencie os usuÃ¡rios administradores do sistema.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-700"
        >
          Novo UsuÃ¡rio
        </button>
      </div>

      {/* Lista de usuÃ¡rios existentes */}
      {loading ? <LoadingSpinner /> : <UserList users={users} onDelete={handleDeleteUser} />}

      {/* Modal de criaÃ§Ã£o de usuÃ¡rio */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowForm(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Adicionar Novo UsuÃ¡rio</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none"
                  aria-label="Fechar"
                >
                  Ã—
                </button>
              </div>
              <div className="p-6">
                <UserForm onSubmit={handleCreateUser} onCancel={() => setShowForm(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
