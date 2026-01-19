import React, { useEffect, useRef } from 'react';
import { 
  CurrencyDollarIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useDashboardData } from '../hooks/useDashboardData';
import { useAuth } from '../firebase/AuthContext';
import { useUserRole } from '../hooks/useUserRole';
import { toast } from 'react-toastify';
import AnimatedCard from '../components/AnimatedCard';
import StatusIndicator from '../components/StatusIndicator';
import PageTransition from '../components/PageTransition';
import QuickActions from '../components/QuickActions';
import SkeletonCard from '../components/SkeletonCard';
import FinancialSummary from '../components/FinancialSummary';
import RecentTransactions from '../components/RecentTransactions';
import PullToRefresh from '../components/PullToRefresh';
import { useEventsAlerts } from '../contexts/EventsAlertsContext';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { stats, loading, error, refresh } = useDashboardData();
  const { loading: authLoading, authReady, user } = useAuth();
  const { isAdmin, isLider } = useUserRole();
  const { unreadCount: unreadEvents, markAllSeen } = useEventsAlerts();
  const hasRenderedRef = useRef(false);
  const hasShownErrorRef = useRef(false);

  const financePin = (process.env.REACT_APP_FINANCE_PIN || '').trim();
  const [financeUnlocked, setFinanceUnlocked] = React.useState<boolean>(() => {
    try {
      return sessionStorage.getItem('finance_unlocked') === '1';
    } catch {
      return false;
    }
  });

  const canViewIncome = isAdmin || isLider || (financePin.length > 0 && financeUnlocked);

  const requestFinanceAccess = () => {
    if (!financePin) {
      return;
    }

    const value = window.prompt('Digite a chave de acesso para visualizar as entradas:');
    if (!value) return;
    if (value.trim() === financePin) {
      try {
        sessionStorage.setItem('finance_unlocked', '1');
      } catch {
        // ignore
      }
      setFinanceUnlocked(true);
      toast.success('Acesso liberado');
      return;
    }

    toast.error('Chave inválida');
  };

  // Força recarregamento quando a rota muda ou quando necessário
  useEffect(() => {
    // Se não há dados mas o loading terminou, forçar refresh
    if (authReady && user && !loading && !authLoading && !stats) {
      console.log('🔄 Dashboard sem dados, forçando refresh...');
      refresh();
    }
  }, [authReady, user, loading, authLoading, stats, refresh]);

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

  const handleRefresh = async () => {
    await refresh();
  };

  return (
    <PageTransition>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm sm:text-md text-slate-600 dark:text-gray-400">
            Visão geral das finanças da igreja
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 min-h-[44px] text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation w-full sm:w-auto"
          aria-label="Atualizar dados"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </button>
      </div>

      {unreadEvents > 0 && (
        <div className="border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-blue-900 dark:text-blue-200">
            Você tem <span className="font-bold">{unreadEvents > 9 ? '9+' : unreadEvents}</span> novo(s) evento(s).
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/tesouraria/events"
              onClick={markAllSeen}
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Ver eventos
            </Link>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Receitas */}
        <AnimatedCard delay={0}>
          <div className="p-5">
            {canViewIncome ? (
              <>
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
              </>
            ) : (
              <button
                type="button"
                onClick={requestFinanceAccess}
                className="w-full text-left"
                aria-label="Solicitar acesso às entradas"
              >
                <StatusIndicator
                  status="positive"
                  value={0}
                  label="Receitas"
                  icon={<ArrowUpIcon className="h-5 w-5 text-green-600 dark:text-green-400" />}
                  pulse={false}
                />
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Acesso restrito
                </div>
              </button>
            )}
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

        {/* Transações */}
        <AnimatedCard delay={3}>
          <div className="p-5">
            <StatusIndicator
              status="neutral"
              value={(stats?.income?.count || 0) + (stats?.expense?.count || 0)}
              label="Transações"
              icon={<ArrowPathIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
              pulse={false}
            />
          </div>
        </AnimatedCard>
      </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Financial Summary Chart */}
          <AnimatedCard delay={5}>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Resumo Financeiro
              </h3>
              {canViewIncome ? (
                <FinancialSummary />
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Acesso restrito
                </div>
              )}
            </div>
          </AnimatedCard>
        </div>

        {/* Recent Transactions */}
        <AnimatedCard delay={7}>
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
      </PullToRefresh>
    </PageTransition>
  );
};

export default Dashboard;
