import React, { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define a estrutura dos dados da API
interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

// Gera uma lista de anos recentes para o filtro
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 5; i++) {
    years.push(currentYear - i);
  }
  return years;
};

const FinancialSummary: React.FC = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const availableYears = generateYears();

  useEffect(() => {
    loadCashFlowData(selectedYear);
  }, [selectedYear]);

  const loadCashFlowData = async (year: number) => {
    setLoading(true);
    try {
      const response = await transactionsAPI.getCashFlow({ year });
      // Mapeia os números dos meses para nomes abreviados para o gráfico
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const formattedData = response.data.map((d: any) => ({
        ...d,
        month: monthNames[parseInt(d.month) - 1],
      }));
      setData(formattedData);
    } catch (error) {
      toast.error('Erro ao carregar dados financeiros');
      console.error('Erro ao carregar fluxo de caixa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhum dado disponível para o ano selecionado.</p>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(value) => `R$${(value as number / 1000)}k`} />
              <Tooltip
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                cursor={{ fill: 'rgba(206, 206, 206, 0.2)' }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar dataKey="income" name="Receitas" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Despesas" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;