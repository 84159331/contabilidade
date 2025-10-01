import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveChart from './InteractiveChart';
import { 
  ChartBarIcon, 
  ChartPieIcon, 
  PresentationChartLineIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

interface AdvancedChartsProps {
  financialData?: {
    monthlyIncome: number[];
    monthlyExpenses: number[];
    categories: { name: string; amount: number; color: string }[];
  };
}

const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ financialData }) => {
  const [activeChart, setActiveChart] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartType, setChartType] = useState<'2d' | '3d'>('2d');

  // Dados de exemplo se não houver dados reais
  const defaultData = {
    monthlyIncome: [15000, 18000, 22000, 19000, 25000, 28000],
    monthlyExpenses: [12000, 15000, 18000, 16000, 20000, 22000],
    categories: [
      { name: 'Dízimos', amount: 45000, color: '#10b981' },
      { name: 'Ofertas', amount: 25000, color: '#3b82f6' },
      { name: 'Eventos', amount: 15000, color: '#f59e0b' },
      { name: 'Doações', amount: 10000, color: '#ef4444' },
    ]
  };

  const data = financialData || defaultData;

  // Preparar dados para gráficos
  const monthlyData: ChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receitas',
        data: data.monthlyIncome,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Despesas',
        data: data.monthlyExpenses,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const categoryData: ChartData = {
    labels: data.categories.map(c => c.name),
    datasets: [{
      label: 'Valor por Categoria',
      data: data.categories.map(c => c.amount),
      backgroundColor: data.categories.map(c => c.color),
      borderColor: data.categories.map(c => c.color),
      borderWidth: 2
    }]
  };

  const charts = [
    {
      id: 'monthly-trend',
      title: 'Tendência Mensal',
      type: 'line' as const,
      data: monthlyData,
      icon: ChartBarIcon,
      color: 'text-blue-500'
    },
    {
      id: 'monthly-comparison',
      title: 'Comparação Mensal',
      type: 'bar' as const,
      data: monthlyData,
      icon: ChartBarIcon,
      color: 'text-green-500'
    },
    {
      id: 'categories-pie',
      title: 'Distribuição por Categoria',
      type: 'pie' as const,
      data: categoryData,
      icon: ChartPieIcon,
      color: 'text-purple-500'
    },
    {
      id: 'categories-doughnut',
      title: 'Categorias (Rosquinha)',
      type: 'doughnut' as const,
      data: categoryData,
      icon: ChartPieIcon,
      color: 'text-orange-500'
    }
  ];

  const handleChartClick = (chartId: string) => {
    setActiveChart(activeChart === chartId ? null : chartId);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gráficos Interativos
          </h2>
          
          {/* Toggle 2D/3D */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setChartType('2d')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === '2d'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              2D
            </button>
            <button
              onClick={() => setChartType('3d')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === '3d'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              3D
            </button>
          </div>
        </div>

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title={isFullscreen ? 'Sair do modo tela cheia' : 'Modo tela cheia'}
        >
          {isFullscreen ? (
            <ArrowsPointingInIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <ArrowsPointingOutIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Grid de gráficos */}
      <div className={`grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {chartType === '2d' ? (
          charts.map((chart) => {
            const Icon = chart.icon;
            return (
              <motion.div
                key={chart.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`cursor-pointer transition-all duration-300 ${
                  activeChart === chart.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => handleChartClick(chart.id)}
              >
                <InteractiveChart
                  type={chart.type}
                  data={chart.data}
                  title={chart.title}
                  height={isFullscreen ? 500 : 300}
                  animated={true}
                  interactive={true}
                />
              </motion.div>
            );
          })
        ) : (
          // Gráfico 3D
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="col-span-2"
          >
            <InteractiveChart
              type="doughnut"
              title="Distribuição por Categorias"
              data={{
                labels: data.categories.map(c => c.name),
                datasets: [{
                  label: 'Categorias',
                  data: data.categories.map(c => c.amount),
                  backgroundColor: data.categories.map(c => c.color),
                  borderWidth: 2,
                  borderColor: '#ffffff'
                }]
              }}
              animated={true}
              showTooltip={true}
            />
          </motion.div>
        )}
      </div>

      {/* Informações adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <EyeIcon className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dicas de Interação
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Gráficos 2D:</h4>
            <ul className="space-y-1">
              <li>• Clique nos ícones para mostrar/ocultar</li>
              <li>• Use o botão de atualizar para recarregar</li>
              <li>• Hover sobre os dados para ver detalhes</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Gráficos 3D:</h4>
            <ul className="space-y-1">
              <li>• Arraste para rotacionar a visualização</li>
              <li>• Scroll para zoom in/out</li>
              <li>• Hover nas barras para destacar</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedCharts;
