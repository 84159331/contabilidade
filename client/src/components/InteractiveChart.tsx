import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  TimeScale,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  ChartBarIcon, 
  ChartPieIcon, 
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  TimeScale
);

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

interface InteractiveChartProps {
  type: 'line' | 'bar' | 'doughnut' | 'pie';
  data: ChartData;
  title: string;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  interactive?: boolean;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  type,
  data,
  title,
  height = 300,
  showLegend = true,
  showTooltip = true,
  animated = true,
  interactive = true
}) => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        labels: {
          color: isDark ? '#e5e7eb' : '#374151',
          font: {
            size: 12,
            family: 'Montserrat'
          }
        }
      },
      tooltip: {
        enabled: showTooltip,
        backgroundColor: isDark ? '#374151' : '#ffffff',
        titleColor: isDark ? '#f9fafb' : '#111827',
        bodyColor: isDark ? '#e5e7eb' : '#374151',
        borderColor: isDark ? '#4b5563' : '#d1d5db',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || context.parsed;
            return `${label}: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
          }
        }
      },
      title: {
        display: true,
        text: title,
        color: isDark ? '#f9fafb' : '#111827',
        font: {
          size: 16,
          weight: 'bold' as const,
          family: 'Lato'
        }
      }
    },
    scales: type === 'line' || type === 'bar' ? {
      x: {
        grid: {
          color: isDark ? '#374151' : '#e5e7eb',
          drawBorder: false
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            family: 'Montserrat'
          }
        }
      },
      y: {
        grid: {
          color: isDark ? '#374151' : '#e5e7eb',
          drawBorder: false
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            family: 'Montserrat'
          },
          callback: function(value: any) {
            return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
          }
        }
      }
    } : {},
    animation: false,
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8,
        borderWidth: 2
      },
      line: {
        tension: 0.4
      }
    }
  };

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  const renderChart = () => {
    const chartProps = {
      data,
      options: chartOptions,
      style: { height: `${height}px` }
    } as any;

    switch (type) {
      case 'line':
        return <Line {...chartProps} />;
      case 'bar':
        return <Bar {...chartProps} />;
      case 'doughnut':
        return <Doughnut {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      default:
        return <Line {...chartProps} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
    >
      {/* Header com controles */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {type === 'line' && <ChartBarIcon className="h-6 w-6 text-blue-500" />}
          {type === 'bar' && <ChartBarIcon className="h-6 w-6 text-green-500" />}
          {(type === 'doughnut' || type === 'pie') && <ChartPieIcon className="h-6 w-6 text-purple-500" />}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        
        {interactive && (
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setIsVisible(!isVisible)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isVisible ? 'Ocultar gráfico' : 'Mostrar gráfico'}
            >
              {isVisible ? (
                <EyeSlashIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <EyeIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              )}
            </motion.button>
            
            <motion.button
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Atualizar dados"
            >
              <motion.div
                animate={isAnimating ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <ArrowPathIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </motion.div>
            </motion.button>
          </div>
        )}
      </div>

      {/* Gráfico */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          scale: isVisible ? 1 : 0.95 
        }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {isVisible && (
          <div className="relative">
            {renderChart()}
            
            {/* Overlay de carregamento */}
            {isAnimating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Atualizando...
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* Informações adicionais */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Total de dados: {data.datasets[0]?.data.length || 0}</span>
            <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InteractiveChart;
