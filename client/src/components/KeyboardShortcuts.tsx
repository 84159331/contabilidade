import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  CommandLineIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TagIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'ui' | 'data';
  modifier?: 'ctrl' | 'alt' | 'shift' | 'meta';
}

interface KeyboardShortcutsProps {
  children: React.ReactNode;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotifications();
  const [showHelp, setShowHelp] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Atalhos de navegação
  const navigationShortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      description: 'Ir para Dashboard',
      action: () => navigate('/tesouraria/dashboard'),
      category: 'navigation'
    },
    {
      key: '2',
      description: 'Ir para Transações',
      action: () => navigate('/tesouraria/transactions'),
      category: 'navigation'
    },
    {
      key: '3',
      description: 'Ir para Membros',
      action: () => navigate('/tesouraria/members'),
      category: 'navigation'
    },
    {
      key: '4',
      description: 'Ir para Relatórios',
      action: () => navigate('/tesouraria/reports'),
      category: 'navigation'
    },
    {
      key: '5',
      description: 'Ir para Metas',
      action: () => navigate('/tesouraria/goals'),
      category: 'navigation'
    },
    {
      key: '6',
      description: 'Ir para Dashboard Personalizado',
      action: () => navigate('/tesouraria/custom-dashboard'),
      category: 'navigation'
    },
    {
      key: 'h',
      description: 'Voltar para Home',
      action: () => navigate('/tesouraria/dashboard'),
      category: 'navigation'
    }
  ];

  // Atalhos de ações
  const actionShortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      description: 'Nova Transação',
      action: () => navigate('/tesouraria/transactions?action=new'),
      category: 'actions'
    },
    {
      key: 'm',
      description: 'Novo Membro',
      action: () => navigate('/tesouraria/members?action=new'),
      category: 'actions'
    },
    {
      key: 'g',
      description: 'Nova Meta',
      action: () => navigate('/tesouraria/goals?action=new'),
      category: 'actions'
    },
    {
      key: 's',
      description: 'Salvar (quando em formulário)',
      action: () => {
        const saveButton = document.querySelector('button[type="submit"], button[data-action="save"]') as HTMLButtonElement;
        if (saveButton) {
          saveButton.click();
        }
      },
      category: 'actions',
      modifier: 'ctrl'
    },
    {
      key: 'f',
      description: 'Buscar',
      action: () => {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="buscar" i]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      category: 'actions'
    }
  ];

  // Atalhos de UI
  const uiShortcuts: KeyboardShortcut[] = [
    {
      key: '?',
      description: 'Mostrar/Ocultar Ajuda',
      action: () => setShowHelp(!showHelp),
      category: 'ui'
    },
    {
      key: 'd',
      description: 'Alternar Modo Escuro',
      action: () => {
        const themeToggle = document.querySelector('[data-theme-toggle]') as HTMLButtonElement;
        if (themeToggle) {
          themeToggle.click();
        }
      },
      category: 'ui'
    },
    {
      key: 'e',
      description: 'Modo de Edição (Dashboard Personalizado)',
      action: () => {
        const editButton = document.querySelector('[data-edit-mode]') as HTMLButtonElement;
        if (editButton) {
          editButton.click();
        }
      },
      category: 'ui'
    },
    {
      key: 'Escape',
      description: 'Fechar Modais/Popups',
      action: () => {
        const closeButtons = document.querySelectorAll('[data-close], .modal-close');
        closeButtons.forEach(button => {
          if (button instanceof HTMLElement && button.offsetParent !== null) {
            button.click();
          }
        });
      },
      category: 'ui'
    },
    {
      key: 'k',
      description: 'Ativar Busca Global',
      action: () => {
        addNotification({
          title: 'Busca Global',
          message: 'Digite para buscar em todo o sistema',
          type: 'info',
          priority: 'medium',
          category: 'system'
        });
      },
      category: 'ui',
      modifier: 'ctrl'
    }
  ];

  // Atalhos de dados
  const dataShortcuts: KeyboardShortcut[] = [
    {
      key: 'r',
      description: 'Atualizar Dados',
      action: () => {
        window.location.reload();
      },
      category: 'data'
    },
    {
      key: 'p',
      description: 'Exportar PDF',
      action: () => {
        const pdfButton = document.querySelector('[data-export="pdf"]') as HTMLButtonElement;
        if (pdfButton) {
          pdfButton.click();
        }
      },
      category: 'data'
    },
    {
      key: 'c',
      description: 'Exportar CSV',
      action: () => {
        const csvButton = document.querySelector('[data-export="csv"]') as HTMLButtonElement;
        if (csvButton) {
          csvButton.click();
        }
      },
      category: 'data'
    }
  ];

  const allShortcuts = [
    ...navigationShortcuts,
    ...actionShortcuts,
    ...uiShortcuts,
    ...dataShortcuts
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isEnabled) return;

    const { key, ctrlKey, altKey, shiftKey, metaKey } = event;
    
    // Ignorar quando estiver digitando em inputs
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement) {
      return;
    }

    // Verificar modificadores
    const modifier = ctrlKey || metaKey ? 'ctrl' : 
                    altKey ? 'alt' : 
                    shiftKey ? 'shift' : undefined;

    // Encontrar atalho correspondente
    const shortcut = allShortcuts.find(s => 
      s.key.toLowerCase() === key.toLowerCase() && 
      s.modifier === modifier
    );

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
      
      // Mostrar feedback visual
      addNotification({
        title: 'Atalho Executado',
        message: `${shortcut.description}`,
        type: 'info',
        priority: 'low',
        category: 'system',
        autoHide: true,
        duration: 2000
      });
    }
  }, [isEnabled, addNotification]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Salvar configuração de atalhos
  useEffect(() => {
    localStorage.setItem('keyboard-shortcuts-enabled', isEnabled.toString());
  }, [isEnabled]);

  // Carregar configuração
  useEffect(() => {
    const saved = localStorage.getItem('keyboard-shortcuts-enabled');
    if (saved !== null) {
      setIsEnabled(saved === 'true');
    }
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return CommandLineIcon;
      case 'actions': return PlusIcon;
      case 'ui': return Cog6ToothIcon;
      case 'data': return ChartBarIcon;
      default: return CommandLineIcon;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return 'text-blue-500 bg-blue-100 dark:bg-blue-900';
      case 'actions': return 'text-green-500 bg-green-100 dark:bg-green-900';
      case 'ui': return 'text-purple-500 bg-purple-100 dark:bg-purple-900';
      case 'data': return 'text-orange-500 bg-orange-100 dark:bg-orange-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <>
      {children}
      
      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <CommandLineIcon className="h-6 w-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Atalhos de Teclado
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEnabled(!isEnabled)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
                      isEnabled 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {isEnabled ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeSlashIcon className="h-4 w-4" />
                    )}
                    <span>{isEnabled ? 'Ativado' : 'Desativado'}</span>
                  </button>
                  
                  <button
                    onClick={() => setShowHelp(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Shortcuts by Category */}
              <div className="space-y-6">
                {['navigation', 'actions', 'ui', 'data'].map((category) => {
                  const categoryShortcuts = allShortcuts.filter(s => s.category === category);
                  const Icon = getCategoryIcon(category);
                  const colorClass = getCategoryColor(category);
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                          {category === 'navigation' ? 'Navegação' :
                           category === 'actions' ? 'Ações' :
                           category === 'ui' ? 'Interface' : 'Dados'}
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {categoryShortcuts.map((shortcut, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {shortcut.description}
                            </span>
                            <div className="flex items-center space-x-1">
                              {shortcut.modifier && (
                                <span className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                                  {shortcut.modifier === 'ctrl' ? 'Ctrl' : 
                                   shortcut.modifier === 'alt' ? 'Alt' : 
                                   shortcut.modifier === 'shift' ? 'Shift' : 'Meta'}
                                </span>
                              )}
                              <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded font-mono">
                                {shortcut.key}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pressione <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">?</kbd> para mostrar/ocultar esta ajuda
                  </p>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Help Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 left-4 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => setShowHelp(true)}
        title="Atalhos de Teclado (?)"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <QuestionMarkCircleIcon className="h-5 w-5" />
      </motion.button>
    </>
  );
};

export default KeyboardShortcuts;
