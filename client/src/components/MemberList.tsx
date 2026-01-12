import React, { memo, useMemo } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import SkeletonLoader from './SkeletonLoader';
import LoadingSpinner from './LoadingSpinner';

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface MemberListProps {
  members: Member[];
  loading: boolean;
  pagination: Pagination;
  onEdit: (member: Member) => void;
  onDelete: (id: string | number) => void;
  isDeleting?: boolean;
  onPageChange: (page: number) => void;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  loading,
  pagination,
  onEdit,
  onDelete,
  isDeleting = false,
  onPageChange
}) => {
  const memoizedMembers = useMemo(() => members, [members]);

  if (loading && members.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <SkeletonLoader type="table" count={5} />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum membro encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Membro Desde
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {memoizedMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </div>
                    {member.address && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {member.address}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {member.email && (
                      <div>{member.email}</div>
                    )}
                    {member.phone && (
                      <div className="text-gray-500 dark:text-gray-400">{member.phone}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {member.member_since ? 
                    new Date(member.member_since).toLocaleDateString('pt-BR') : 
                    '-'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`badge ${
                    member.status === 'active' ? 'badge-success' : 'badge-danger'
                  }`}>
                    {member.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {PencilIcon ? (
                      <button
                        onClick={() => onEdit(member)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onEdit(member)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        title="Editar"
                      >
                        ✏️
                      </button>
                    )}
                    {TrashIcon ? (
                      <button
                        onClick={() => onDelete(member.id)}
                        disabled={isDeleting}
                        className={`text-danger-600 hover:text-danger-900 dark:text-red-400 dark:hover:text-red-300 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Deletar"
                      >
                        {isDeleting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-danger-600"></div>
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => onDelete(member.id)}
                        disabled={isDeleting}
                        className={`text-danger-600 hover:text-danger-900 dark:text-red-400 dark:hover:text-red-300 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Deletar"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-4">
        {members.map((member) => (
          <div key={member.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                {member.address && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {member.address}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`badge ${
                  member.status === 'active' ? 'badge-success' : 'badge-danger'
                }`}>
                  {member.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
                {PencilIcon ? (
                  <button
                    onClick={() => onEdit(member)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onEdit(member)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    title="Editar"
                  >
                    ✏️
                  </button>
                )}
                {TrashIcon ? (
                  <button
                    onClick={() => onDelete(member.id)}
                    disabled={isDeleting}
                    className={`text-danger-600 hover:text-danger-900 dark:text-red-400 dark:hover:text-red-300 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Deletar"
                  >
                    {isDeleting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-danger-600"></div>
                    ) : (
                      <TrashIcon className="h-4 w-4" />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => onDelete(member.id)}
                    disabled={isDeleting}
                    className={`text-danger-600 hover:text-danger-900 dark:text-red-400 dark:hover:text-red-300 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Deletar"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2 text-xs">
              {member.email && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Email:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {member.email}
                  </p>
                </div>
              )}
              {member.phone && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Telefone:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {member.phone}
                  </p>
                </div>
              )}
              <div>
                <span className="text-gray-500 dark:text-gray-400">Membro desde:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {member.member_since ? 
                    new Date(member.member_since).toLocaleDateString('pt-BR') : 
                    '-'
                  }
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{' '}
                <span className="font-medium">
                  {((pagination.page - 1) * pagination.limit) + 1}
                </span>{' '}
                até{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                de{' '}
                <span className="font-medium">{pagination.total}</span>{' '}
                resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = Math.max(1, pagination.page - 2) + i;
                  if (pageNum > pagination.pages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === pagination.page
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(MemberList);
