import { useState, useEffect, useRef, useCallback } from 'react';
import { transactionsAPI, membersAPI } from '../services/api';
import { mockDashboardData, simulateApiDelay } from '../services/mockData';
import { useAuth } from '../firebase/AuthContext';

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

interface DashboardData {
  stats: DashboardStats | null;
  memberStats: MemberStatsData | null;
  lastFetch: number | null;
}

const CACHE_KEY = 'dashboard_cache';
const CACHE_DURATION = 60000; // 1 minuto em milissegundos

// Hook para gerenciar dados do dashboard com cache inteligente
export const useDashboardData = (forceRefresh = false) => {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    memberStats: null,
    lastFetch: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Função para carregar dados do cache
  const loadFromCache = useCallback((): DashboardData | null => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: DashboardData = JSON.parse(cached);
        const now = Date.now();
        // Se o cache ainda é válido e não forçou refresh
        if (parsed.lastFetch && (now - parsed.lastFetch) < CACHE_DURATION && !forceRefresh) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar cache:', e);
    }
    return null;
  }, [forceRefresh]);

  // Função para salvar dados no cache
  const saveToCache = useCallback((stats: DashboardStats | null, memberStats: MemberStatsData | null) => {
    try {
      const cacheData: DashboardData = {
        stats,
        memberStats,
        lastFetch: Date.now(),
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Erro ao salvar cache:', e);
    }
  }, []);

  // Função para carregar dados
  const loadData = useCallback(async (useCache = true) => {
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Criar novo controller para esta requisição
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setLoading(true);
      setError(null);

      // Tentar carregar do cache primeiro
      if (useCache) {
        const cached = loadFromCache();
        if (cached && cached.stats && cached.memberStats) {
          setData(cached);
          setLoading(false);
          // Carregar dados frescos em background
          if (!forceRefresh) {
            loadData(false); // Recarregar sem mostrar loading
          }
          return;
        }
      }

      // Verificar se deve usar dados mock
      const useMockData = !user;

      if (useMockData) {
        // Simular delay de API
        await simulateApiDelay(800);

        if (signal.aborted || !isMountedRef.current) return;

        // Usar dados mock
        const stats = mockDashboardData.financialSummary;
        const memberStats = mockDashboardData.memberStats;

        const newData: DashboardData = {
          stats,
          memberStats,
          lastFetch: Date.now(),
        };

        if (!signal.aborted && isMountedRef.current) {
          setData(newData);
          saveToCache(stats, memberStats);
        }
      } else {
        // Usar APIs reais do Firestore
        const [financialSummary, memberStatsData] = await Promise.all([
          transactionsAPI.getSummary(),
          membersAPI.getMemberStats(),
        ]);

        if (signal.aborted || !isMountedRef.current) return;

        // Transformar dados
        const financialData = financialSummary.data;
        const stats: DashboardStats = {
          income: {
            total: financialData.totalIncome,
            count: financialData.transactionCount,
          },
          expense: {
            total: financialData.totalExpense,
            count: financialData.transactionCount,
          },
          balance: financialData.balance,
        };

        const newData: DashboardData = {
          stats,
          memberStats: memberStatsData.data,
          lastFetch: Date.now(),
        };

        if (!signal.aborted && isMountedRef.current) {
          setData(newData);
          saveToCache(stats, memberStatsData.data);
        }
      }
    } catch (err: any) {
      // Ignorar erros de abort
      if (err.name === 'AbortError' || signal.aborted) {
        return;
      }

      console.error('Erro ao carregar dashboard:', err);

      // Em caso de erro, tentar usar cache
      const cached = loadFromCache();
      if (cached && cached.stats && cached.memberStats) {
        setData(cached);
      } else {
        // Fallback para dados mock
        const stats = mockDashboardData.financialSummary;
        const memberStats = mockDashboardData.memberStats;
        const newData: DashboardData = {
          stats,
          memberStats,
          lastFetch: Date.now(),
        };
        setData(newData);
        setError('Erro ao carregar dados. Mostrando dados de demonstração.');
      }
    } finally {
      if (!signal.aborted && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [user, forceRefresh, loadFromCache, saveToCache]);

  // Carregar dados quando o hook é montado ou quando user muda
  useEffect(() => {
    isMountedRef.current = true;
    loadData(true);

    // Atualizar dados quando a janela/tab ganha foco novamente
    const handleFocus = () => {
      if (isMountedRef.current) {
        const cached = loadFromCache();
        const now = Date.now();
        // Se o cache tem mais de 30 segundos, atualizar
        if (!cached || !cached.lastFetch || (now - cached.lastFetch) > 30000) {
          loadData(false); // Atualizar em background
        }
      }
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('focus', handleFocus);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData, loadFromCache]);

  // Função para forçar refresh
  const refresh = useCallback(() => {
    loadData(false);
  }, [loadData]);

  // Limpar cache
  const clearCache = useCallback(() => {
    try {
      sessionStorage.removeItem(CACHE_KEY);
    } catch (e) {
      console.warn('Erro ao limpar cache:', e);
    }
  }, []);

  return {
    stats: data.stats,
    memberStats: data.memberStats,
    loading,
    error,
    refresh,
    clearCache,
  };
};

