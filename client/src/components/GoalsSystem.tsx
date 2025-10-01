import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoalCard from './GoalCard';
import { 
  TagIcon,
  TrophyIcon,
  FireIcon,
  StarIcon,
  PlusIcon,
  FunnelIcon,
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ExclamationTriangleIcon
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

interface GoalsSystemProps {
  financialData?: {
    totalIncome: number;
    totalExpenses: number;
    memberCount: number;
  };
}

const GoalsSystem: React.FC<GoalsSystemProps> = ({ financialData }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'progress'>('deadline');
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    description: '',
    target: 0,
    current: 0,
    deadline: new Date(),
    category: 'income',
    priority: 'medium',
    status: 'active',
    rewards: []
  });

  // Carregar metas do localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals).map((goal: any) => ({
        ...goal,
        deadline: new Date(goal.deadline),
        createdAt: new Date(goal.createdAt),
        completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined
      }));
      setGoals(parsedGoals);
    } else {
      // Metas de exemplo
      const exampleGoals: Goal[] = [
        {
          id: '1',
          title: 'Meta Mensal de Receitas',
          description: 'Atingir R$ 50.000 em receitas mensais',
          target: 50000,
          current: 35000,
          deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          category: 'income',
          priority: 'high',
          status: 'active',
          createdAt: new Date(),
          rewards: ['Badge de Excelência', 'Reconhecimento Público']
        },
        {
          id: '2',
          title: 'Redução de Despesas',
          description: 'Reduzir despesas operacionais em 15%',
          target: 15000,
          current: 8000,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          category: 'expense',
          priority: 'medium',
          status: 'active',
          createdAt: new Date(),
          rewards: ['Certificado de Economia']
        },
        {
          id: '3',
          title: 'Crescimento de Membros',
          description: 'Atingir 200 membros ativos',
          target: 200,
          current: 150,
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          category: 'members',
          priority: 'high',
          status: 'active',
          createdAt: new Date(),
          rewards: ['Troféu de Crescimento', 'Celebração Especial']
        }
      ];
      setGoals(exampleGoals);
    }
  }, []);

  // Salvar metas no localStorage
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.target) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description || '',
      target: newGoal.target,
      current: newGoal.current || 0,
      deadline: newGoal.deadline || new Date(),
      category: newGoal.category || 'income',
      priority: newGoal.priority || 'medium',
      status: 'active',
      createdAt: new Date(),
      rewards: newGoal.rewards || []
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      target: 0,
      current: 0,
      deadline: new Date(),
      category: 'income',
      priority: 'medium',
      status: 'active',
      rewards: []
    });
    setShowCreateForm(false);
  };

  const handleUpdateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return a.deadline.getTime() - b.deadline.getTime();
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'progress':
        const progressA = (a.current / a.target) * 100;
        const progressB = (b.current / b.target) * 100;
        return progressB - progressA;
      default:
        return 0;
    }
  });

  const stats = {
    total: goals.length,
    active: goals.filter(g => g.status === 'active').length,
    completed: goals.filter(g => g.status === 'completed').length,
    failed: goals.filter(g => g.status === 'failed').length,
    overdue: goals.filter(g => g.deadline < new Date() && g.status === 'active').length
  };

  const categoryIcons = {
    income: CurrencyDollarIcon,
    expense: TagIcon,
    members: UsersIcon,
    events: CalendarIcon,
    custom: StarIcon
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TagIcon className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sistema de Metas
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Defina e acompanhe seus objetivos financeiros
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nova Meta</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <TagIcon className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <FireIcon className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ativas</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <TrophyIcon className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Concluídas</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Atrasadas</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overdue}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Taxa Sucesso</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
          </p>
        </motion.div>
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {(['all', 'active', 'completed', 'failed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {filterType === 'all' ? 'Todas' : 
                 filterType === 'active' ? 'Ativas' :
                 filterType === 'completed' ? 'Concluídas' : 'Falhadas'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-4 w-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="deadline">Por Prazo</option>
            <option value="priority">Por Prioridade</option>
            <option value="progress">Por Progresso</option>
          </select>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <GoalCard
                goal={goal}
                onUpdate={handleUpdateGoal}
                onDelete={handleDeleteGoal}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredGoals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma meta encontrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'all' 
                ? 'Crie sua primeira meta para começar!'
                : `Nenhuma meta ${filter === 'active' ? 'ativa' : 
                   filter === 'completed' ? 'concluída' : 'falhada'} encontrada.`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Primeira Meta
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Criar Nova Meta
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Meta Mensal de Receitas"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Descreva sua meta..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta
                    </label>
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prazo
                    </label>
                    <input
                      type="date"
                      value={newGoal.deadline?.toISOString().split('T')[0]}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: new Date(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoria
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="income">Receitas</option>
                      <option value="expense">Despesas</option>
                      <option value="members">Membros</option>
                      <option value="events">Eventos</option>
                      <option value="custom">Personalizada</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateGoal}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Meta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoalsSystem;
