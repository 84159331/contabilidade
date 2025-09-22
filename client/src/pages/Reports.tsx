import React, { useState, useRef } from 'react';
import { ChartBarIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import MonthlyBalanceReport from '../components/reports/MonthlyBalanceReport';
import YearlyBalanceReport from '../components/reports/YearlyBalanceReport';
import MemberContributionsReport from '../components/reports/MemberContributionsReport';
import CategoryReport from '../components/reports/CategoryReport';
import CashFlowReport from '../components/reports/CashFlowReport';
import { generatePdf } from '../utils/pdf';

type ReportType = 'monthly' | 'yearly' | 'contributions' | 'categories' | 'cashflow';

const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportType>('monthly');
  const [loading, setLoading] = useState(false);
  const reportContainerRef = useRef<HTMLDivElement>(null);

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

  const handleGeneratePdf = async () => {
    if (reportContainerRef.current) {
      const reportName = reports.find(r => r.id === activeReport)?.name || 'relatorio';
      await generatePdf(reportContainerRef.current, `${reportName}.pdf`);
    }
  };

  const renderReport = () => {
    switch (activeReport) {
      case 'monthly':
        return <MonthlyBalanceReport />;
      case 'yearly':
        return <YearlyBalanceReport />;
      case 'contributions':
        return <MemberContributionsReport />;
      case 'categories':
        return <CategoryReport />;
      case 'cashflow':
        return <CashFlowReport />;
      default:
        return <MonthlyBalanceReport />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visualize e analise os dados financeiros da igreja
        </p>
      </div>

      {/* Report Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {reports.map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => setActiveReport(report.id)}
                  className={`${
                    activeReport === report.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
              <h3 className="text-lg font-medium text-gray-900">
                {reports.find(r => r.id === activeReport)?.name}
              </h3>
              <p className="text-sm text-gray-500">
                {reports.find(r => r.id === activeReport)?.description}
              </p>
            </div>
            <button
              onClick={handleGeneratePdf}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              Gerar PDF
            </button>
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
