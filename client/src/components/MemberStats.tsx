import React, { useState, useEffect } from 'react';
import { membersAPI } from '../services/api';
import { toast } from 'react-toastify';

interface MemberStatsData {
  total: number;
  active: number;
  inactive: number;
}

const MemberStats: React.FC = () => {
  const [stats, setStats] = useState<MemberStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemberStats();
  }, []);

  const loadMemberStats = async () => {
    try {
      const response = await membersAPI.getMemberStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Erro ao carregar estatísticas dos membros');
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhum dado disponível
      </div>
    );
  }

  const activePercentage = stats.total > 0 ? (stats.active / stats.total) * 100 : 0;
  const inactivePercentage = stats.total > 0 ? (stats.inactive / stats.total) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Total de membros */}
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900">
          {stats.total}
        </div>
        <div className="text-sm text-gray-500">
          Total de Membros
        </div>
      </div>

      {/* Gráfico de status */}
      <div className="space-y-3">
        {/* Membros Ativos */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ativos</span>
            <span className="font-medium text-gray-900">
              {stats.active} ({activePercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-success-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${activePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Membros Inativos */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Inativos</span>
            <span className="font-medium text-gray-900">
              {stats.inactive} ({inactivePercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gray-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${inactivePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-success-600">
              {stats.active}
            </div>
            <div className="text-xs text-gray-500">Ativos</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-400">
              {stats.inactive}
            </div>
            <div className="text-xs text-gray-500">Inativos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberStats;
