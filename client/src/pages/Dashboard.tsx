import React, { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { transactionsAPI, membersAPI } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import FinancialSummary from '../components/FinancialSummary';
import RecentTransactions from '../components/RecentTransactions';
import MemberStats from '../components/MemberStats';

interface DashboardStats {
  income: { total: number; count: number };
  expense: { total: number; count: number };
  balance: number;
}

interface MemberStatsData {
  total: number;
  active: number;
  inactive: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [memberStats, setMemberStats] = useState<MemberStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [financialSummary, memberStatsData] = await Promise.all([
        transactionsAPI.getSummary(),
        membersAPI.getMemberStats()
      ]);

      setStats(financialSummary.data);
      setMemberStats(memberStatsData.data);
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard');
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral das finanças da igreja
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Receitas */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUpIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Receitas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {stats?.income.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-1">
              <div className="text-sm text-gray-500">
                {stats?.income.count || 0} transações
              </div>
            </div>
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowDownIcon className="h-6 w-6 text-danger-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Despesas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {stats?.expense.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-1">
              <div className="text-sm text-gray-500">
                {stats?.expense.count || 0} transações
              </div>
            </div>
          </div>
        </div>

        {/* Saldo */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Saldo
                  </dt>
                  <dd className={`text-lg font-medium ${
                    (stats?.balance || 0) >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    R$ {stats?.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Membros */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Membros
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {memberStats?.total || 0}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-1">
              <div className="text-sm text-gray-500">
                {memberStats?.active || 0} ativos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Financial Summary Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Resumo Financeiro
          </h3>
          <FinancialSummary />
        </div>

        {/* Member Stats */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Estatísticas dos Membros
          </h3>
          <MemberStats />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Transações Recentes
          </h3>
        </div>
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Dashboard;
