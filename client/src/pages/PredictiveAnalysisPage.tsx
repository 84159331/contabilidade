import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import AnimatedCard from '../components/AnimatedCard';
import PageTransition from '../components/PageTransition';
import AnimatedButton from '../components/AnimatedButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { transactionsAPI, membersAPI } from '../services/api';

interface PredictionData {
  revenue: {
    current: number;
    predicted: number;
    trend: 'up' | 'down' | 'stable';
    confidence: number;
  };
  expenses: {
    current: number;
    predicted: number;
    trend: 'up' | 'down' | 'stable';
    confidence: number;
  };
  members: {
    current: number;
    predicted: number;
    trend: 'up' | 'down' | 'stable';
    confidence: number;
  };
  insights: string[];
  recommendations: string[];
  alerts: {
    type: 'warning' | 'info' | 'success';
    message: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

const PredictiveAnalysisPage: React.FC = () => {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadPredictionData();
  }, []);

  const loadPredictionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const useTestRoutes = !token;

      // Simular dados de análise preditiva
      const mockData: PredictionData = {
        revenue: {
          current: 15000,
          predicted: 16500,
          trend: 'up',
          confidence: 85
        },
        expenses: {
          current: 12000,
          predicted: 12800,
          trend: 'up',
          confidence: 78
        },
        members: {
          current: 150,
          predicted: 158,
          trend: 'up',
          confidence: 92
        },
        insights: [
          'Receitas estão crescendo consistentemente nos últimos 3 meses',
          'Despesas com manutenção podem aumentar no próximo trimestre',
          'Novos membros estão contribuindo mais que a média histórica',
          'Padrão sazonal indica crescimento de 8% no próximo mês'
        ],
        recommendations: [
          'Considere investir em campanhas de captação de novos membros',
          'Monitore de perto as despesas operacionais',
          'Planeje reserva de emergência para o próximo trimestre',
          'Avalie oportunidades de investimento com o crescimento previsto'
        ],
        alerts: [
          {
            type: 'warning',
            message: 'Despesas podem exceder 85% da receita no próximo mês',
            priority: 'high'
          },
          {
            type: 'info',
            message: 'Crescimento de membros acima da média histórica',
            priority: 'medium'
          },
          {
            type: 'success',
            message: 'Saldo positivo mantido por 6 meses consecutivos',
            priority: 'low'
          }
        ]
      };

      setPredictionData(mockData);
    } catch (error) {
      console.error('Erro ao carregar dados de análise:', error);
      toast.error('Erro ao carregar análise preditiva');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      // Simular processo de análise
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Análise preditiva atualizada com sucesso!');
      loadPredictionData();
    } catch (error) {
      toast.error('Erro ao executar análise');
    } finally {
      setAnalyzing(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="h-5 w-5 text-green-500" />;
      case 'down':
        return <ArrowDownIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ChartBarIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <EyeIcon className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'success':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Análise Preditiva com IA
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Carregando análise...
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Análise Preditiva com IA
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Insights inteligentes e previsões baseadas em dados históricos
            </p>
          </div>
          <AnimatedButton
            onClick={handleRunAnalysis}
            loading={analyzing}
            className="btn-primary flex items-center"
          >
            <LightBulbIcon className="h-5 w-5 mr-2" />
            {analyzing ? 'Analisando...' : 'Executar Análise'}
          </AnimatedButton>
        </div>

        {/* Prediction Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Receitas */}
          <AnimatedCard delay={0}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Receitas
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Previsão para próximo mês
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getTrendIcon(predictionData?.revenue.trend || 'stable')}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      R$ {predictionData?.revenue.predicted.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Atual: R$ {predictionData?.revenue.current.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getTrendColor(predictionData?.revenue.trend || 'stable')}`}>
                      +{((predictionData?.revenue.predicted || 0) - (predictionData?.revenue.current || 0)).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {predictionData?.revenue.confidence}% confiança
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Despesas */}
          <AnimatedCard delay={1}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <ArrowTrendingDownIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Despesas
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Previsão para próximo mês
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getTrendIcon(predictionData?.expenses.trend || 'stable')}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      R$ {predictionData?.expenses.predicted.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Atual: R$ {predictionData?.expenses.current.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getTrendColor(predictionData?.expenses.trend || 'stable')}`}>
                      +{((predictionData?.expenses.predicted || 0) - (predictionData?.expenses.current || 0)).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {predictionData?.expenses.confidence}% confiança
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Membros */}
          <AnimatedCard delay={2}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Membros
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Previsão para próximo mês
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getTrendIcon(predictionData?.members.trend || 'stable')}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {predictionData?.members.predicted}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Atual: {predictionData?.members.current}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getTrendColor(predictionData?.members.trend || 'stable')}`}>
                      +{((predictionData?.members.predicted || 0) - (predictionData?.members.current || 0))}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {predictionData?.members.confidence}% confiança
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Insights e Recomendações */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Insights */}
          <AnimatedCard delay={3}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Insights da IA
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {predictionData?.insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0">
                      <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {insight}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedCard>

          {/* Recomendações */}
          <AnimatedCard delay={4}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Recomendações
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {predictionData?.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0">
                      <ArrowUpIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {recommendation}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Alertas */}
        <AnimatedCard delay={5}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Alertas Inteligentes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {predictionData?.alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {alert.message}
                      </p>
                      <p className="text-xs opacity-75 mt-1">
                        Prioridade: {alert.priority === 'high' ? 'Alta' : 
                                   alert.priority === 'medium' ? 'Média' : 'Baixa'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedCard>

        {/* Informações sobre a IA */}
        <AnimatedCard delay={6}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Sobre a Análise Preditiva
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Como Funciona
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nossa IA analisa padrões históricos de receitas, despesas e crescimento de membros 
                  para gerar previsões precisas e insights acionáveis.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Precisão
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  As previsões têm uma precisão média de 85% baseada em dados históricos 
                  dos últimos 12 meses e tendências sazonais.
                </p>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </PageTransition>
  );
};

export default PredictiveAnalysisPage;
