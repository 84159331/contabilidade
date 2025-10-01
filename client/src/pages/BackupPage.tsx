import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  ServerIcon,
  CalendarIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import AnimatedCard from '../components/AnimatedCard';
import PageTransition from '../components/PageTransition';
import AnimatedButton from '../components/AnimatedButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { backupAPI } from '../services/backupAPI';

interface BackupConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  retention: number; // days
  cloudStorage: boolean;
  localStorage: boolean;
}

interface BackupHistory {
  id: string;
  timestamp: string;
  type: 'manual' | 'automatic';
  status: 'success' | 'error' | 'in_progress';
  size: string;
  location: string;
}

const BackupPage: React.FC = () => {
  const [config, setConfig] = useState<BackupConfig>({
    enabled: true,
    frequency: 'daily',
    time: '02:00',
    retention: 30,
    cloudStorage: true,
    localStorage: true
  });

  const [history, setHistory] = useState<BackupHistory[]>([
    {
      id: '1',
      timestamp: '2024-01-15T02:00:00Z',
      type: 'automatic',
      status: 'success',
      size: '2.3 MB',
      location: 'Cloud + Local'
    },
    {
      id: '2',
      timestamp: '2024-01-14T02:00:00Z',
      type: 'automatic',
      status: 'success',
      size: '2.1 MB',
      location: 'Cloud + Local'
    },
    {
      id: '3',
      timestamp: '2024-01-13T15:30:00Z',
      type: 'manual',
      status: 'success',
      size: '2.0 MB',
      location: 'Local'
    }
  ]);

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backupStatus, setBackupStatus] = useState<any>(null);

  useEffect(() => {
    loadBackupData();
  }, []);

  const loadBackupData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const useTestRoutes = !token;

      const [statusResponse, configResponse, historyResponse] = await Promise.all([
        backupAPI.getStatus(useTestRoutes),
        backupAPI.getConfig(),
        backupAPI.getHistory(useTestRoutes)
      ]);

      setBackupStatus(statusResponse.data?.data);
      setConfig(configResponse.data?.data || config);
      setHistory(historyResponse.data?.data || history);
    } catch (error) {
      console.error('Erro ao carregar dados de backup:', error);
      toast.error('Erro ao carregar dados de backup');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key: keyof BackupConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveConfig = async () => {
    try {
      await backupAPI.updateConfig(config);
      toast.success('Configurações de backup salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    }
  };

  const handleManualBackup = async () => {
    setIsBackingUp(true);
    try {
      const result = await backupAPI.performManualBackup();
      
      if (result.data.success) {
        toast.success('Backup realizado com sucesso!');
        loadBackupData(); // Recarregar dados
      } else {
        toast.error('Erro ao realizar backup');
      }
    } catch (error) {
      toast.error('Erro ao realizar backup');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    setIsRestoring(true);
    try {
      const result = await backupAPI.restoreBackup(backupId);
      
      if (result.data.success) {
        toast.success('Sistema restaurado com sucesso!');
      } else {
        toast.error('Erro ao restaurar backup');
      }
    } catch (error) {
      toast.error('Erro ao restaurar backup');
    } finally {
      setIsRestoring(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <LoadingSpinner size="sm" color="primary" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'in_progress':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sistema de Backup
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Carregando dados...
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sistema de Backup
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gerencie backups automáticos e manuais do sistema
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatedCard delay={0}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Status do Sistema
                    </dt>
                    <dd className="text-lg font-medium text-green-600 dark:text-green-400">
                      Ativo
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={1}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Próximo Backup
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {backupStatus?.nextBackup ? 
                        new Date(backupStatus.nextBackup).toLocaleString('pt-BR') : 
                        'Não agendado'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={2}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <CircleStackIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Espaço Usado
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {backupStatus?.totalSize || '0 Bytes'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={3}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <ServerIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Backups Salvos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {backupStatus?.totalBackups || history.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Configuration */}
        <AnimatedCard delay={4}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Configurações de Backup
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Backup Automático
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => handleConfigChange('enabled', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Habilitar backups automáticos
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequência
                </label>
                <select
                  value={config.frequency}
                  onChange={(e) => handleConfigChange('frequency', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Horário
                </label>
                <input
                  type="time"
                  value={config.time}
                  onChange={(e) => handleConfigChange('time', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Retenção (dias)
                </label>
                <input
                  type="number"
                  value={config.retention}
                  onChange={(e) => handleConfigChange('retention', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  min="1"
                  max="365"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Local de Armazenamento
              </label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.localStorage}
                    onChange={(e) => handleConfigChange('localStorage', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Armazenamento Local
                  </span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.cloudStorage}
                    onChange={(e) => handleConfigChange('cloudStorage', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Armazenamento em Nuvem
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <AnimatedButton
                onClick={handleSaveConfig}
                className="btn-primary"
              >
                Salvar Configurações
              </AnimatedButton>
            </div>
          </div>
        </AnimatedCard>

        {/* Manual Actions */}
        <AnimatedCard delay={5}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Ações Manuais
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <AnimatedButton
                onClick={handleManualBackup}
                loading={isBackingUp}
                className="btn-primary flex items-center justify-center"
              >
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                {isBackingUp ? 'Fazendo Backup...' : 'Fazer Backup Agora'}
              </AnimatedButton>
              
              <AnimatedButton
                onClick={() => toast.info('Funcionalidade em desenvolvimento')}
                className="btn-secondary flex items-center justify-center"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Baixar Backup
              </AnimatedButton>
            </div>
          </div>
        </AnimatedCard>

        {/* Backup History */}
        <AnimatedCard delay={6}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Histórico de Backups
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tamanho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Local
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {history.map((backup) => (
                  <motion.tr
                    key={backup.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(backup.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        backup.type === 'automatic' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {backup.type === 'automatic' ? 'Automático' : 'Manual'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center">
                        {getStatusIcon(backup.status)}
                        <span className={`ml-2 ${getStatusColor(backup.status)}`}>
                          {backup.status === 'success' ? 'Sucesso' : 
                           backup.status === 'error' ? 'Erro' : 'Em Progresso'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {backup.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {backup.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <AnimatedButton
                          onClick={() => handleRestore(backup.id)}
                          loading={isRestoring}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          <CloudArrowDownIcon className="h-4 w-4" />
                        </AnimatedButton>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedCard>
      </div>
    </PageTransition>
  );
};

export default BackupPage;
