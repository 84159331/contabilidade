import React, { useEffect, useRef } from 'react';
import { 
  CurrencyDollarIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useDashboardData } from '../hooks/useDashboardData';
import { useAuth } from '../firebase/AuthContext';
import { toast } from 'react-toastify';
import AnimatedCard from '../components/AnimatedCard';
import StatusIndicator from '../components/StatusIndicator';
import PageTransition from '../components/PageTransition';
import QuickActions from '../components/QuickActions';
import { SkeletonCard } from '../components/Skeleton';
import FinancialSummary from '../components/FinancialSummary';
import RecentTransactions from '../components/RecentTransactions';
import MemberStats from '../components/MemberStats';

const Dashboard: React.FC = () => {
  const { stats, memberStats, loading, error, refresh } = useDashboardData();
  const { loading: authLoading } = useAuth();
  const hasRenderedRef = useRef(false);
  const hasShownErrorRef = useRef(false);

  // Marcar como renderizado
  useEffect(() => {
    hasRenderedRef.current = true;
  }, []);

  // Mostrar erro se houver (apenas uma vez)
  useEffect(() => {
    if (error && !hasShownErrorRef.current) {
      hasShownErrorRef.current = true;
      toast.info(error, { autoClose: 3000 });
    } else if (!error) {
      hasShownErrorRef.current = false;
    }
  }, [error]);

  if (loading || authLoading) {
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-md text-slate-600 dark:text-gray-400">
            Visão geral das finanças da igreja
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Atualizar dados"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </button>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Membros</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {memberStats?.total || 0}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {memberStats?.active || 0} ativos
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {memberStats?.inactive || 0} inativos
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Status dos Membros</span>
                <span>{memberStats?.total ? Math.round(((memberStats?.active || 0) / memberStats.total) * 100) : 0}% ativos</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${memberStats?.total ? ((memberStats?.active || 0) / memberStats.total) * 100 : 0}%` 
                  }}
                ></div>
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
