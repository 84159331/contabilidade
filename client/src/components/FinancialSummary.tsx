import React, { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';
import { toast } from 'react-toastify';

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

const FinancialSummary: React.FC = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCashFlowData();
  }, []);

  const loadCashFlowData = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const response = await transactionsAPI.getCashFlow({ year: currentYear });
      setData(response.data);
    } catch (error) {
      toast.error('Erro ao carregar dados financeiros');
      console.error('Erro ao carregar fluxo de caixa:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const monthNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const maxAmount = Math.max(
    ...data.map(d => Math.max(d.income, d.expense))
  );

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
      ) : (
        <div className="space-y-3">
          {data.map((month, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  {monthNames[parseInt(month.month) - 1]}
                </span>
                <span className={`font-medium ${
                  month.balance >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  R$ {month.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="space-y-1">
                {/* Receitas */}
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-500 rounded"></div>
                  <span className="text-xs text-gray-600">Receitas</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-success-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${maxAmount > 0 ? (month.income / maxAmount) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    R$ {month.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                {/* Despesas */}
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-danger-500 rounded"></div>
                  <span className="text-xs text-gray-600">Despesas</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-danger-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${maxAmount > 0 ? (month.expense / maxAmount) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    R$ {month.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;
