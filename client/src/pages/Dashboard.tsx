import React, { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { transactionsAPI, membersAPI } from '../services/api';
import { mockDashboardData, simulateApiDelay } from '../services/mockData';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedCard from '../components/AnimatedCard';
import StatusIndicator from '../components/StatusIndicator';
import PageTransition from '../components/PageTransition';
import QuickActions from '../components/QuickActions';
import { SkeletonCard } from '../components/Skeleton';
import FinancialSummary from '../components/FinancialSummary';
import RecentTransactions from '../components/RecentTransactions';
import MemberStats from '../components/MemberStats';
import useNotificationDemo from '../hooks/useNotificationDemo';

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

  // Hook para demonstração de notificações
  useNotificationDemo();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Debug: verificar token
      const token = localStorage.getItem('token');
      console.log('Token no localStorage:', token);
      
      // Se não há token, usar dados mock
      const useMockData = !token;
      console.log('Usando dados mock:', useMockData);
      
      if (useMockData) {
        // Simular delay de API
        await simulateApiDelay(800);
        
        // Usar dados mock
        setStats(mockDashboardData.financialSummary);
        setMemberStats(mockDashboardData.memberStats);
        
        console.log('Dados mock carregados:', {
          stats: mockDashboardData.financialSummary,
          memberStats: mockDashboardData.memberStats
        });
      } else {
        // Tentar usar APIs reais
        const [financialSummary, memberStatsData] = await Promise.all([
          transactionsAPI.getSummary(),
          membersAPI.getMemberStats()
        ]);

        console.log('Financial Summary:', financialSummary.data);
        console.log('Member Stats:', memberStatsData.data);

        // Usar dados mock por enquanto
        setStats(mockDashboardData.financialSummary);
        setMemberStats(mockDashboardData.memberStats);
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      
      // Em caso de erro, usar dados mock como fallback
      console.log('Usando dados mock como fallback');
      setStats(mockDashboardData.financialSummary);
      setMemberStats(mockDashboardData.memberStats);
      
      toast.info('Usando dados de demonstração');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="mt-1 text-md text-slate-600">
              Visão geral das finanças da igreja
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <SkeletonCard key={index} delay={index} />
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-md text-slate-600 dark:text-gray-400">
          Visão geral das finanças da igreja
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Receitas */}
        <AnimatedCard delay={0}>
          <div className="p-5">
            <StatusIndicator
              status="positive"
              value={stats?.income?.total || 0}
              label="Receitas"
              icon={<ArrowUpIcon className="h-5 w-5 text-green-600 dark:text-green-400" />}
              pulse={true}
            />
            <div className="mt-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stats?.income?.count || 0} transações
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Despesas */}
        <AnimatedCard delay={1}>
          <div className="p-5">
            <StatusIndicator
              status="negative"
              value={stats?.expense?.total || 0}
              label="Despesas"
              icon={<ArrowDownIcon className="h-5 w-5 text-red-600 dark:text-red-400" />}
              pulse={true}
            />
            <div className="mt-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stats?.expense?.count || 0} transações
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Saldo */}
        <AnimatedCard delay={2}>
          <div className="p-5">
            <StatusIndicator
              status={(stats?.balance || 0) >= 0 ? "positive" : "negative"}
              value={stats?.balance || 0}
              label="Saldo"
              icon={<CurrencyDollarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              pulse={(stats?.balance || 0) >= 0}
            />
          </div>
        </AnimatedCard>

        {/* Membros */}
        <AnimatedCard delay={3}>
          <div className="p-5">
            <StatusIndicator
              status="neutral"
              value={memberStats?.total || 0}
              label="Membros"
              icon={<UsersIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
              pulse={false}
            />
            <div className="mt-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {memberStats?.active || 0} ativos
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Financial Summary Chart */}
          <AnimatedCard delay={4}>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Resumo Financeiro
              </h3>
              <FinancialSummary />
            </div>
          </AnimatedCard>

          {/* Member Stats */}
          <AnimatedCard delay={5}>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Estatísticas dos Membros
              </h3>
              <MemberStats />
            </div>
          </AnimatedCard>
        </div>

        {/* Recent Transactions */}
        <AnimatedCard delay={8}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Transações Recentes
            </h3>
          </div>
          <RecentTransactions />
        </AnimatedCard>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </PageTransition>
  );
};

export default Dashboard;
