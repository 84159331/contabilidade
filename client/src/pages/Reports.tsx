import React, { useState, useRef } from 'react';
import { ChartBarIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import MonthlyBalanceReport from '../components/reports/MonthlyBalanceReport';
import YearlyBalanceReport from '../components/reports/YearlyBalanceReport';
import MemberContributionsReport from '../components/reports/MemberContributionsReport';
import CategoryReport from '../components/reports/CategoryReport';
import CashFlowReport from '../components/reports/CashFlowReport';
import { toast } from 'react-toastify';
import {
  generateMonthlyBalancePDF,
  generateYearlyBalancePDF,
  generateCategoryReportPDF,
  generateCashFlowPDF,
  generateMemberContributionsPDF
} from '../utils/reportPdfGenerators';
import { exportToCsv } from '../utils/export';
import Button from '../components/Button';

type ReportType = 'monthly' | 'yearly' | 'contributions' | 'categories' | 'cashflow';

const Reports: React.FC = () => {
  const reportComponents = {MonthlyBalanceReport,YearlyBalanceReport,MemberContributionsReport,CategoryReport,CashFlowReport};
  const reportComponentStatus = Object.entries(reportComponents).map(([name,comp])=>({name,isUndefined:comp===undefined,type:typeof comp})).reduce((acc,{name,isUndefined,type})=>({...acc,[name]:{isUndefined,type}}),{});
  const [activeReport, setActiveReport] = useState<ReportType>('monthly');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [reportMetadata, setReportMetadata] = useState<any>(null); // Para armazenar metadados como datas, período, etc.
  const reportContainerRef = useRef<HTMLDivElement>(null);
  
  // InformaÃ§Ãµes da igreja (pode ser obtido de configuraÃ§Ãµes ou deixar vazio)
  const churchInfo = {
    name: 'Minha Igreja', // Pode ser obtido de settings ou contexto
  };

  const reports = [
    {
      id: 'monthly' as ReportType,
      name: 'Balanço Mensal',
      description: 'Receitas e despesas por mês',
      icon: ChartBarIcon
    },
    {
      id: 'yearly' as ReportType,
      name: 'Balanço Anual',
      description: 'Visão geral do ano',
      icon: ChartBarIcon
    },
    {
      id: 'contributions' as ReportType,
      name: 'Contribuições',
      description: 'Contribuições por membro',
      icon: ChartBarIcon
    },
    {
      id: 'categories' as ReportType,
      name: 'Por Categoria',
      description: 'Receitas e despesas por categoria',
      icon: ChartBarIcon
    },
    {
      id: 'cashflow' as ReportType,
      name: 'Fluxo de Caixa',
      description: 'Fluxo de caixa detalhado',
      icon: ChartBarIcon
    }
  ];

  const handleSetReportData = (data: any) => {
    // Para relatÃ³rio anual, nÃ£o salva aqui se for apenas array (o objeto completo virÃ¡ via handleYearlyFullDataLoaded)
    if (activeReport === 'yearly' && Array.isArray(data)) {
      // Ignora arrays no relatÃ³rio anual - o objeto completo serÃ¡ passado via onFullDataLoaded
      return;
    }
    // Para outros relatÃ³rios, salva normalmente
    setReportData(data);
  };

  const handleSetReportMetadata = (metadata: any) => {
    setReportMetadata(metadata);
  };

  // Handler especÃ­fico para o relatÃ³rio anual que precisa do objeto completo
  const handleYearlyFullDataLoaded = (fullData: any) => {
    // Sempre sobrescreve com o objeto completo para o relatÃ³rio anual
    setReportData(fullData);
  };

  const handleGeneratePdf = async () => {
    try {
      if (!reportData) {
        toast.warning('Aguarde o carregamento dos dados do relatório');
        return;
      }

      toast.info('Gerando PDF profissional...');

      switch (activeReport) {
        case 'monthly':
          if (reportData && reportData.income && reportData.expense) {
            generateMonthlyBalancePDF(reportData, churchInfo);
            toast.success('PDF gerado com sucesso!');
          } else {
            toast.error('Dados insuficientes para gerar o PDF');
          }
          break;

        case 'yearly':
          if (reportData && reportData.yearlyTotal && reportData.monthlyData) {
            // Garante que reportData tenha a estrutura completa YearlyBalance
            const yearlyData = {
              year: reportData.year || new Date().getFullYear(),
              monthlyData: reportData.monthlyData || [],
              yearlyTotal: reportData.yearlyTotal || { income: 0, expense: 0, balance: 0 }
            };
            generateYearlyBalancePDF(yearlyData, churchInfo);
            toast.success('PDF gerado com sucesso!');
          } else {
            toast.error('Dados insuficientes para gerar o PDF. Aguarde o carregamento completo.');
            console.error('Dados do relatÃ³rio anual:', reportData);
          }
          break;

        case 'categories':
          if (reportMetadata && reportMetadata.incomeData && reportMetadata.expenseData && reportMetadata.startDate && reportMetadata.endDate) {
            generateCategoryReportPDF(
              reportMetadata.incomeData,
              reportMetadata.expenseData,
              reportMetadata.startDate,
              reportMetadata.endDate,
              churchInfo
            );
            toast.success('PDF gerado com sucesso!');
          } else {
            toast.error('Dados insuficientes para gerar o PDF');
          }
          break;

        case 'cashflow':
          if (reportData && Array.isArray(reportData) && reportMetadata && reportMetadata.startDate && reportMetadata.endDate && reportMetadata.period) {
            generateCashFlowPDF(
              reportData,
              reportMetadata.startDate,
              reportMetadata.endDate,
              reportMetadata.period,
              churchInfo
            );
            toast.success('PDF gerado com sucesso!');
          } else {
            toast.error('Dados insuficientes para gerar o PDF');
          }
          break;

        case 'contributions':
          if (reportData && Array.isArray(reportData) && reportMetadata && reportMetadata.startDate && reportMetadata.endDate) {
            generateMemberContributionsPDF(
              reportData,
              reportMetadata.startDate,
              reportMetadata.endDate,
              churchInfo
            );
            toast.success('PDF gerado com sucesso!');
          } else {
            toast.error('Dados insuficientes para gerar o PDF');
          }
          break;

        default:
          toast.error('Tipo de relatório não suportado');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handleGenerateCsv = () => {
    if (reportData) {
      const reportName = reports.find(r => r.id === activeReport)?.name || 'relatorio';
      let dataToExport: any[] = [];

      if (activeReport === 'monthly' && reportData) {
        dataToExport = [
          {
            'Tipo': 'Receitas',
            'Total': reportData.income.total,
            'TransaÃ§Ãµes': reportData.income.count
          },
          {
            'Tipo': 'Despesas',
            'Total': reportData.expense.total,
            'TransaÃ§Ãµes': reportData.expense.count
          },
          {
            'Tipo': 'Saldo',
            'Total': reportData.balance,
            'TransaÃ§Ãµes': reportData.income.count + reportData.expense.count
          }
        ];
      } else if (Array.isArray(reportData)) {
        dataToExport = reportData;
      }

      if (dataToExport.length > 0) {
        exportToCsv(`${reportName}.csv`, dataToExport);
      }
    }
  };

  const renderReport = () => {
    switch (activeReport) {
      case 'monthly':
        if (!MonthlyBalanceReport) {
          return <div>Erro: MonthlyBalanceReport nÃ£o encontrado</div>;
        }
        return <MonthlyBalanceReport onDataLoaded={handleSetReportData} />;
      case 'yearly':
        if (!YearlyBalanceReport) {
          return <div>Erro: YearlyBalanceReport nÃ£o encontrado</div>;
        }
        return (
          <YearlyBalanceReport
            onDataLoaded={handleSetReportData}
            onFullDataLoaded={handleYearlyFullDataLoaded}
          />
        );
      case 'contributions':
        if (!MemberContributionsReport) {
          return <div>Erro: MemberContributionsReport nÃ£o encontrado</div>;
        }
        return (
          <MemberContributionsReport
            onDataLoaded={handleSetReportData}
            onMetadataLoaded={handleSetReportMetadata}
          />
        );
      case 'categories':
        if (!CategoryReport) {
          return <div>Erro: CategoryReport nÃ£o encontrado</div>;
        }
        return (
          <CategoryReport
            onDataLoaded={handleSetReportData}
            onMetadataLoaded={handleSetReportMetadata}
          />
        );
      case 'cashflow':
        if (!CashFlowReport) {
          return <div>Erro: CashFlowReport nÃ£o encontrado</div>;
        }
        return (
          <CashFlowReport
            onDataLoaded={handleSetReportData}
            onMetadataLoaded={handleSetReportMetadata}
          />
        );
      default:
        if (!MonthlyBalanceReport) {
          return <div>Erro: MonthlyBalanceReport nÃ£o encontrado</div>;
        }
        return <MonthlyBalanceReport onDataLoaded={handleSetReportData} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Visualize e analise os dados financeiros da igreja
        </p>
      </div>

      {/* Report Tabs */}
      <div className="bg-white dark:bg-gray-900/80 shadow rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {reports.map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => {
                    setActiveReport(report.id);
                    setReportData(null);
                    setReportMetadata(null);
                  }}
                  className={`${
                    activeReport === report.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  <Icon className="h-4 w-4" />
                  {report.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {reports.find(r => r.id === activeReport)?.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {reports.find(r => r.id === activeReport)?.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleGeneratePdf}
                variant="secondary"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                Gerar PDF
              </Button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div ref={reportContainerRef}>
              {renderReport()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
