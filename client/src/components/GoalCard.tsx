import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  TagIcon,
  TrophyIcon,
  FireIcon,
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  XMarkIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  deadline: Date;
  category: 'income' | 'expense' | 'members' | 'events' | 'custom';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'completed' | 'failed' | 'paused';
  createdAt: Date;
  completedAt?: Date;
  rewards?: string[];
}

interface GoalCardProps {
  goal: Goal;
  onUpdate: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdate, onDelete }) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(goal.current);

  const progress = Math.min((goal.current / goal.target) * 100, 100);
  const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;
  const isCompleted = goal.status === 'completed';

  const priorityColors = {
    low: 'text-gray-500 bg-gray-100 dark:bg-gray-700',
    medium: 'text-blue-600 bg-blue-100 dark:bg-blue-900',
    high: 'text-orange-600 bg-orange-100 dark:bg-orange-900',
    urgent: 'text-red-600 bg-red-100 dark:bg-red-900'
  };

  const categoryIcons = {
    income: CurrencyDollarIcon,
    expense: TagIcon,
    members: TrophyIcon,
    events: CalendarIcon,
    custom: StarIcon
  };

  const CategoryIcon = categoryIcons[goal.category];

  const handleUpdateProgress = () => {
    const updatedGoal = { ...goal, current: editValue };
    onUpdate(updatedGoal);
    setIsEditing(false);
  };

  const handleComplete = () => {
    const updatedGoal = { 
      ...goal, 
      status: 'completed' as const,
      completedAt: new Date(),
      current: goal.target
    };
    onUpdate(updatedGoal);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 ${
        isCompleted ? 'border-green-500' : 
        isOverdue ? 'border-red-500' : 
        'border-blue-500'
      }`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${priorityColors[goal.priority]}`}>
              <CategoryIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {goal.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {goal.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[goal.priority]}`}>
              {goal.priority}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isExpanded ? (
                <XMarkIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <PlusIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progresso
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {goal.current.toLocaleString('pt-BR')} / {goal.target.toLocaleString('pt-BR')}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-3 rounded-full ${
                isCompleted ? 'bg-green-500' :
                isOverdue ? 'bg-red-500' :
                'bg-blue-500'
              }`}
            />
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {progress.toFixed(1)}% concluído
            </span>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-3 w-3 text-gray-400" />
              <span className={`text-xs ${isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {isOverdue ? `${Math.abs(daysLeft)} dias atrasado` : `${daysLeft} dias restantes`}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {!isCompleted && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  Atualizar
                </button>
                <button
                  onClick={handleComplete}
                  className="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  Concluir
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
            title="Excluir meta"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Criado em:</span>
                    <p className="text-gray-900 dark:text-white">
                      {goal.createdAt.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Prazo:</span>
                    <p className="text-gray-900 dark:text-white">
                      {goal.deadline.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                {goal.rewards && goal.rewards.length > 0 && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Recompensas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {goal.rewards.map((reward, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full"
                        >
                          {reward}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Progress Modal */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setIsEditing(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Atualizar Progresso
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor Atual
                    </label>
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      min="0"
                      max={goal.target}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Meta: {goal.target.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {((editValue / goal.target) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateProgress}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Salvar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GoalCard;
