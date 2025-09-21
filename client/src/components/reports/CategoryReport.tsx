import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import { toast } from 'react-toastify';

interface CategoryData {
  id: number;
  name: string;
  color: string;
  transaction_count: number;
  total_amount: number;
  average_amount: number;
}

const CategoryReport: React.FC = () => {
  const [incomeData, setIncomeData] = useState<CategoryData[]>([]);
  const [expenseData, setExpenseData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Set default date range to current year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    
    setStartDate(startOfYear.toISOString().split('T')[0]);
    setEndDate(endOfYear.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      loadReport();
    }
  }, [startDate, endDate]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const [incomeResponse, expenseResponse] = await Promise.all([
        reportsAPI.getIncomeByCategory({
          start_date: startDate,
          end_date: endDate
        }),
        reportsAPI.getExpenseByCategory({
          start_date: startDate,
          end_date: endDate
        })
      ]);
      
      setIncomeData(incomeResponse.data);
      setExpenseData(expenseResponse.data);
    } catch (error) {
      toast.error('Erro ao carregar relatório por categoria');
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

  const totalIncome = incomeData.reduce((sum, cat) => sum + cat.total_amount, 0);
  const totalExpense = expenseData.reduce((sum, cat) => sum + cat.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
            Data Início
          </label>
          <input
            type="date"
            id="start_date"
            className="input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
            Data Fim
          </label>
          <input
            type="date"
            id="end_date"
            className="input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          onClick={handleExport}
          className="btn btn-secondary flex items-center gap-2"
        >
          <DocumentArrowDownIcon className="h-4 w-4" />
          Exportar
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                    Total de Receitas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </dd>
                </dl>
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
                    Total de Despesas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Income Categories */}
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Receitas por Categoria
          </h3>
        </div>
        
        {incomeData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma receita encontrada no período selecionado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transações
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Média
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incomeData.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {category.transaction_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-success-600">
                      R$ {category.total_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      R$ {category.average_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {totalIncome > 0 ? ((category.total_amount / totalIncome) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expense Categories */}
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Despesas por Categoria
          </h3>
        </div>
        
        {expenseData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma despesa encontrada no período selecionado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transações
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Média
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenseData.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {category.transaction_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-danger-600">
                      R$ {category.total_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      R$ {category.average_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {totalExpense > 0 ? ((category.total_amount / totalExpense) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryReport;
