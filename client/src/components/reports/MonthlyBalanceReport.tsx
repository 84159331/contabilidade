import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthlyBalance {
  income: { total: number; count: number };
  expense: { total: number; count: number };
  balance: number;
  period: { year: number; month: number };
}

const MonthlyBalanceReport: React.FC = () => {
  const [data, setData] = useState<MonthlyBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    loadReport();
  }, [year, month]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getMonthlyBalance(year, month);
      setData(response.data);
    } catch (error) {
      toast.error('Erro ao carregar relatório mensal');
      console.error('Erro ao carregar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Implementar exportação para PDF/Excel
    toast.info('Funcionalidade de exportação em desenvolvimento');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum dado disponível para o período selecionado</p>
      </div>
    );
  }

  const monthName = format(new Date(year, month - 1), 'MMMM', { locale: ptBR });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Ano
          </label>
          <select
            id="year"
            className="input"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => {
              const yearOption = new Date().getFullYear() - i;
              return (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
            Mês
          </label>
          <select
            id="month"
            className="input"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {format(new Date(year, i), 'MMMM', { locale: ptBR })}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleExport}
          className="btn btn-secondary flex items-center gap-2"
        >
          <DocumentArrowDownIcon className="h-4 w-4" />
          Exportar
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                  <span className="text-success-600 font-bold">+</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Receitas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {data.income.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-1">
              <div className="text-sm text-gray-500">
                {data.income.count} transações
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-danger-100 rounded-full flex items-center justify-center">
                  <span className="text-danger-600 font-bold">-</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Despesas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {data.expense.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-1">
              <div className="text-sm text-gray-500">
                {data.expense.count} transações
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  data.balance >= 0 ? 'bg-success-100' : 'bg-danger-100'
                }`}>
                  <span className={`font-bold ${
                    data.balance >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    =
                  </span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Saldo
                  </dt>
                  <dd className={`text-lg font-medium ${
                    data.balance >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    R$ {data.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-1">
              <div className="text-sm text-gray-500">
                {capitalizedMonth} {year}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Resumo Visual
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Gráfico em desenvolvimento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBalanceReport;
