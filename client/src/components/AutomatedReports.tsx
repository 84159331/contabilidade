import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  PlusIcon,
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'members' | 'goals' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  template: string;
  isActive: boolean;
  lastSent?: Date;
  nextSend?: Date;
  createdAt: Date;
  data?: any;
}

interface AutomatedReportsProps {
  financialData?: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    memberCount: number;
  };
}

const AutomatedReports: React.FC<AutomatedReportsProps> = ({ financialData }) => {
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);
  const [newReport, setNewReport] = useState<Partial<ScheduledReport>>({
    name: '',
    description: '',
    type: 'financial',
    frequency: 'monthly',
    recipients: [],
    template: 'default',
    isActive: true
  });

  // Templates de relatórios
  const reportTemplates = {
    financial: {
      name: 'Relatório Financeiro',
      description: 'Resumo completo das finanças da igreja',
      template: `
        # Relatório Financeiro - ${new Date().toLocaleDateString('pt-BR')}
        
        ## Resumo Executivo
        - **Receitas Totais**: R$ {{totalIncome}}
        - **Despesas Totais**: R$ {{totalExpenses}}
        - **Saldo Atual**: R$ {{balance}}
        
        ## Análise Detalhada
        - **Margem de Lucro**: {{profitMargin}}%
        - **Crescimento Mensal**: {{monthlyGrowth}}%
        
        ## Próximos Passos
        - Revisar despesas operacionais
        - Planejar investimentos futuros
        - Acompanhar metas financeiras
      `
    },
    members: {
      name: 'Relatório de Membros',
      description: 'Estatísticas e crescimento da comunidade',
      template: `
        # Relatório de Membros - ${new Date().toLocaleDateString('pt-BR')}
        
        ## Estatísticas Gerais
        - **Total de Membros**: {{totalMembers}}
        - **Membros Ativos**: {{activeMembers}}
        - **Novos Membros**: {{newMembers}}
        
        ## Crescimento
        - **Taxa de Crescimento**: {{growthRate}}%
        - **Retenção**: {{retentionRate}}%
        
        ## Ações Recomendadas
        - Fortalecer programas de integração
        - Desenvolver novos grupos de conexão
        - Acompanhar engajamento dos membros
      `
    },
    goals: {
      name: 'Relatório de Metas',
      description: 'Progresso das metas estabelecidas',
      template: `
        # Relatório de Metas - ${new Date().toLocaleDateString('pt-BR')}
        
        ## Status das Metas
        - **Metas Concluídas**: {{completedGoals}}
        - **Metas em Andamento**: {{activeGoals}}
        - **Taxa de Sucesso**: {{successRate}}%
        
        ## Metas Prioritárias
        {{priorityGoals}}
        
        ## Recomendações
        - Focar nas metas com maior impacto
        - Ajustar metas não atingíveis
        - Celebrar conquistas alcançadas
      `
    }
  };

  // Carregar relatórios do localStorage
  useEffect(() => {
    const savedReports = localStorage.getItem('scheduled-reports');
    if (savedReports) {
      const parsedReports = JSON.parse(savedReports).map((report: any) => ({
        ...report,
        createdAt: new Date(report.createdAt),
        lastSent: report.lastSent ? new Date(report.lastSent) : undefined,
        nextSend: report.nextSend ? new Date(report.nextSend) : undefined
      }));
      setReports(parsedReports);
    } else {
      // Relatórios de exemplo
      const exampleReports: ScheduledReport[] = [
        {
          id: '1',
          name: 'Relatório Financeiro Mensal',
          description: 'Resumo mensal das finanças da igreja',
          type: 'financial',
          frequency: 'monthly',
          recipients: ['admin@igreja.com', 'tesoureiro@igreja.com'],
          template: 'financial',
          isActive: true,
          createdAt: new Date(),
          nextSend: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          name: 'Relatório de Membros Semanal',
          description: 'Acompanhamento semanal do crescimento',
          type: 'members',
          frequency: 'weekly',
          recipients: ['pastor@igreja.com'],
          template: 'members',
          isActive: true,
          createdAt: new Date(),
          nextSend: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        }
      ];
      setReports(exampleReports);
    }
  }, []);

  // Salvar relatórios no localStorage
  useEffect(() => {
    localStorage.setItem('scheduled-reports', JSON.stringify(reports));
  }, [reports]);

  const handleCreateReport = () => {
    if (!newReport.name || !newReport.recipients?.length) return;

    const report: ScheduledReport = {
      id: Date.now().toString(),
      name: newReport.name,
      description: newReport.description || '',
      type: newReport.type || 'financial',
      frequency: newReport.frequency || 'monthly',
      recipients: newReport.recipients,
      template: newReport.template || 'default',
      isActive: true,
      createdAt: new Date(),
      nextSend: calculateNextSend(newReport.frequency || 'monthly')
    };

    setReports([...reports, report]);
    setNewReport({
      name: '',
      description: '',
      type: 'financial',
      frequency: 'monthly',
      recipients: [],
      template: 'default',
      isActive: true
    });
    setShowCreateForm(false);
  };

  const calculateNextSend = (frequency: string): Date => {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case 'quarterly':
        return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
  };

  const toggleReportStatus = (reportId: string) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, isActive: !report.isActive }
          : report
      )
    );
  };

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
  };

  const sendReportNow = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    // Simular envio
    setReports(prev => 
      prev.map(r => 
        r.id === reportId 
          ? { 
              ...r, 
              lastSent: new Date(),
              nextSend: calculateNextSend(r.frequency)
            }
          : r
      )
    );

    // Mostrar notificação de sucesso
    console.log(`Relatório "${report.name}" enviado para: ${report.recipients.join(', ')}`);
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily': return ClockIcon;
      case 'weekly': return CalendarIcon;
      case 'monthly': return CalendarIcon;
      case 'quarterly': return CalendarIcon;
      default: return ClockIcon;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'text-red-500 bg-red-100 dark:bg-red-900';
      case 'weekly': return 'text-orange-500 bg-orange-100 dark:bg-orange-900';
      case 'monthly': return 'text-blue-500 bg-blue-100 dark:bg-blue-900';
      case 'quarterly': return 'text-purple-500 bg-purple-100 dark:bg-purple-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <EnvelopeIcon className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Relatórios Automáticos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure relatórios que são enviados automaticamente por email
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <DocumentTextIcon className="h-4 w-4" />
            <span>Templates</span>
          </button>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Novo Relatório</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <PlayIcon className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ativos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {reports.filter(r => r.isActive).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <PauseIcon className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pausados</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {reports.filter(r => !r.isActive).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <EnvelopeIcon className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Próximo Envio</span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {reports.filter(r => r.isActive).length > 0 
              ? reports.filter(r => r.isActive)[0]?.nextSend?.toLocaleDateString('pt-BR')
              : 'Nenhum'
            }
          </p>
        </motion.div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <AnimatePresence>
          {reports.map((report, index) => {
            const FrequencyIcon = getFrequencyIcon(report.frequency);
            const colorClass = getFrequencyColor(report.frequency);
            
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 ${
                  report.isActive ? 'border-green-500' : 'border-gray-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <FrequencyIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {report.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {report.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                            {report.frequency}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {report.recipients.length} destinatário(s)
                          </span>
                          {report.lastSent && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Último envio: {report.lastSent.toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => sendReportNow(report.id)}
                        className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        title="Enviar agora"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => toggleReportStatus(report.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          report.isActive 
                            ? 'text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900' 
                            : 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900'
                        }`}
                        title={report.isActive ? 'Pausar' : 'Ativar'}
                      >
                        {report.isActive ? (
                          <PauseIcon className="h-4 w-4" />
                        ) : (
                          <PlayIcon className="h-4 w-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Recipients */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Destinatários:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {report.recipients.map((email, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {email}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {reports.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum relatório configurado
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Crie seu primeiro relatório automático para começar
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Primeiro Relatório
            </button>
          </motion.div>
        )}
      </div>

      {/* Create Report Modal */}
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
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Criar Novo Relatório
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome do Relatório
                    </label>
                    <input
                      type="text"
                      value={newReport.name}
                      onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: Relatório Financeiro Mensal"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frequência
                    </label>
                    <select
                      value={newReport.frequency}
                      onChange={(e) => setNewReport({ ...newReport, frequency: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                      <option value="quarterly">Trimestral</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={newReport.description}
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Descreva o propósito deste relatório..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo
                    </label>
                    <select
                      value={newReport.type}
                      onChange={(e) => setNewReport({ ...newReport, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="financial">Financeiro</option>
                      <option value="members">Membros</option>
                      <option value="goals">Metas</option>
                      <option value="custom">Personalizado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Template
                    </label>
                    <select
                      value={newReport.template}
                      onChange={(e) => setNewReport({ ...newReport, template: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="default">Padrão</option>
                      <option value="financial">Financeiro</option>
                      <option value="members">Membros</option>
                      <option value="goals">Metas</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Destinatários (emails separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={newReport.recipients?.join(', ') || ''}
                    onChange={(e) => setNewReport({ 
                      ...newReport, 
                      recipients: e.target.value.split(',').map(email => email.trim()).filter(email => email)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="admin@igreja.com, tesoureiro@igreja.com"
                  />
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
                  onClick={handleCreateReport}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Relatório
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Templates de Relatórios
              </h3>
              
              <div className="space-y-4">
                {Object.entries(reportTemplates).map(([key, template]) => (
                  <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {template.description}
                    </p>
                    <pre className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded overflow-x-auto">
                      {template.template}
                    </pre>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-end mt-6">
                <button
                  onClick={() => setShowTemplates(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutomatedReports;
