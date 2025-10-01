import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { 
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PlusIcon,
  XMarkIcon,
  Bars3Icon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  TagIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const ResponsiveGridLayout = (WidthProvider as any)(Responsive);

interface Widget {
  id: string;
  title: string;
  type: 'stats' | 'chart' | 'goals' | 'transactions' | 'members' | 'calendar';
  visible: boolean;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number; w: number; h: number };
  data?: any;
}

interface DraggableDashboardProps {
  children?: React.ReactNode;
}

const DraggableDashboard: React.FC<DraggableDashboardProps> = ({ children }) => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);

  // Widgets padrão
  const defaultWidgets: Widget[] = [
    {
      id: 'income-stats',
      title: 'Receitas',
      type: 'stats',
      visible: true,
      size: 'small',
      position: { x: 0, y: 0, w: 3, h: 2 }
    },
    {
      id: 'expense-stats',
      title: 'Despesas',
      type: 'stats',
      visible: true,
      size: 'small',
      position: { x: 3, y: 0, w: 3, h: 2 }
    },
    {
      id: 'balance-stats',
      title: 'Saldo',
      type: 'stats',
      visible: true,
      size: 'small',
      position: { x: 6, y: 0, w: 3, h: 2 }
    },
    {
      id: 'members-stats',
      title: 'Membros',
      type: 'stats',
      visible: true,
      size: 'small',
      position: { x: 9, y: 0, w: 3, h: 2 }
    },
    {
      id: 'financial-chart',
      title: 'Gráfico Financeiro',
      type: 'chart',
      visible: true,
      size: 'large',
      position: { x: 0, y: 2, w: 6, h: 4 }
    },
    {
      id: 'goals-widget',
      title: 'Metas',
      type: 'goals',
      visible: true,
      size: 'medium',
      position: { x: 6, y: 2, w: 6, h: 4 }
    },
    {
      id: 'recent-transactions',
      title: 'Transações Recentes',
      type: 'transactions',
      visible: true,
      size: 'large',
      position: { x: 0, y: 6, w: 8, h: 3 }
    },
    {
      id: 'calendar-widget',
      title: 'Calendário',
      type: 'calendar',
      visible: true,
      size: 'small',
      position: { x: 8, y: 6, w: 4, h: 3 }
    }
  ];

  // Carregar widgets do localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboard-widgets');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    } else {
      setWidgets(defaultWidgets);
    }
  }, []);

  // Salvar widgets no localStorage
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
    }
  }, [widgets]);

  const handleLayoutChange = (layout: any) => {
    setWidgets(prev => 
      prev.map(widget => {
        const layoutItem = layout.find((item: any) => item.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            position: {
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h
            }
          };
        }
        return widget;
      })
    );
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    );
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
  };

  const addWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: `${type}-${Date.now()}`,
      title: `Novo ${type}`,
      type,
      visible: true,
      size: 'medium',
      position: { x: 0, y: 0, w: 4, h: 3 }
    };
    setWidgets(prev => [...prev, newWidget]);
    setShowWidgetSelector(false);
  };

  const resetLayout = () => {
    setWidgets(defaultWidgets);
  };

  const getWidgetIcon = (type: Widget['type']) => {
    switch (type) {
      case 'stats': return CurrencyDollarIcon;
      case 'chart': return ChartBarIcon;
      case 'goals': return TagIcon;
      case 'transactions': return Bars3Icon;
      case 'members': return UsersIcon;
      case 'calendar': return CalendarIcon;
      default: return ChartBarIcon;
    }
  };

  const renderWidget = (widget: Widget) => {
    if (!widget.visible) return null;

    const Icon = getWidgetIcon(widget.type);

    return (
      <motion.div
        key={widget.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Widget Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {widget.title}
            </h3>
          </div>
          
          {isEditMode && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => toggleWidgetVisibility(widget.id)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title={widget.visible ? 'Ocultar' : 'Mostrar'}
              >
                {widget.visible ? (
                  <EyeIcon className="h-4 w-4" />
                ) : (
                  <EyeSlashIcon className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => removeWidget(widget.id)}
                className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                title="Remover"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Widget Content */}
        <div className="p-4">
          {widget.type === 'stats' && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ 25.000
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                +12% este mês
              </div>
            </div>
          )}
          
          {widget.type === 'chart' && (
            <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
          )}
          
          {widget.type === 'goals' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Meta Mensal</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">75%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          )}
          
          {widget.type === 'transactions' && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Transação {i}</span>
                  <span className="text-gray-900 dark:text-white">R$ 1.000</span>
                </div>
              ))}
            </div>
          )}
          
          {widget.type === 'members' && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">150</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Membros Ativos</div>
            </div>
          )}
          
          {widget.type === 'calendar' && (
            <div className="text-center">
              <CalendarIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Próximo evento
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Personalizável
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Arraste e redimensione os widgets conforme sua preferência
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Toggle modo de edição */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isEditMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            data-edit-mode
          >
            <Cog6ToothIcon className="h-4 w-4" />
            <span>{isEditMode ? 'Sair do Modo Edição' : 'Editar Layout'}</span>
          </button>
          
          {/* Toggle tela cheia */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={isFullscreen ? 'Sair do modo tela cheia' : 'Modo tela cheia'}
          >
            {isFullscreen ? (
              <ArrowsPointingInIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <ArrowsPointingOutIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          
          {/* Adicionar widget */}
          {isEditMode && (
            <button
              onClick={() => setShowWidgetSelector(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Adicionar Widget</span>
            </button>
          )}
          
          {/* Reset layout */}
          {isEditMode && (
            <button
              onClick={resetLayout}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Resetar
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4' : ''}`}>
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: widgets.map(w => ({ ...w.position, i: w.id })) }}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={60}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          onLayoutChange={handleLayoutChange}
          margin={[16, 16]}
          containerPadding={[0, 0]}
        >
          {widgets.map(widget => (
            <div key={widget.id}>
              {renderWidget(widget)}
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      {/* Widget Selector Modal */}
      <AnimatePresence>
        {showWidgetSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowWidgetSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Adicionar Widget
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {(['stats', 'chart', 'goals', 'transactions', 'members', 'calendar'] as const).map((type) => {
                  const Icon = getWidgetIcon(type);
                  return (
                    <button
                      key={type}
                      onClick={() => addWidget(type)}
                      className="flex flex-col items-center space-y-2 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Icon className="h-6 w-6 text-blue-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {type}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-end mt-6">
                <button
                  onClick={() => setShowWidgetSelector(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruções */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4"
        >
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Dicas de Personalização:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Arraste os widgets para reorganizar o layout</li>
            <li>• Redimensione arrastando as bordas dos widgets</li>
            <li>• Use os ícones de olho para mostrar/ocultar widgets</li>
            <li>• Clique no X para remover widgets</li>
            <li>• Seu layout será salvo automaticamente</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default DraggableDashboard;
