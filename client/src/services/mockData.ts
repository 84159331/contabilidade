// Dados mock para o dashboard funcionar sem backend
export const mockDashboardData = {
  financialSummary: {
    income: { total: 15750.00, count: 23 },
    expense: { total: 12340.00, count: 18 },
    balance: 3410.00
  },
  memberStats: {
    total: 156,
    active: 142,
    inactive: 14
  },
  recentTransactions: [
    {
      id: 1,
      description: "Dízimo - João Silva",
      amount: 500.00,
      type: "income" as const,
      transaction_date: "2024-01-15",
      category_name: "Dízimos",
      member_name: "João Silva"
    },
    {
      id: 2,
      description: "Oferta Especial",
      amount: 200.00,
      type: "income" as const,
      transaction_date: "2024-01-14",
      category_name: "Ofertas",
      member_name: "Maria Santos"
    },
    {
      id: 3,
      description: "Conta de Luz",
      amount: 180.50,
      type: "expense" as const,
      transaction_date: "2024-01-13",
      category_name: "Utilidades",
      member_name: undefined
    },
    {
      id: 4,
      description: "Dízimo - Pedro Costa",
      amount: 300.00,
      type: "income" as const,
      transaction_date: "2024-01-12",
      category_name: "Dízimos",
      member_name: "Pedro Costa"
    },
    {
      id: 5,
      description: "Material de Limpeza",
      amount: 85.00,
      type: "expense" as const,
      transaction_date: "2024-01-11",
      category_name: "Manutenção",
      member_name: undefined
    }
  ],
  cashFlowData: [
    { month: "1", income: 4500, expense: 3200, balance: 1300 },
    { month: "2", income: 5200, expense: 3800, balance: 1400 },
    { month: "3", income: 4800, expense: 3500, balance: 1300 },
    { month: "4", income: 5500, expense: 4000, balance: 1500 },
    { month: "5", income: 5100, expense: 3600, balance: 1500 },
    { month: "6", income: 5800, expense: 4200, balance: 1600 },
    { month: "7", income: 5300, expense: 3800, balance: 1500 },
    { month: "8", income: 5600, expense: 4100, balance: 1500 },
    { month: "9", income: 5400, expense: 3900, balance: 1500 },
    { month: "10", income: 5700, expense: 4000, balance: 1700 },
    { month: "11", income: 5200, expense: 3700, balance: 1500 },
    { month: "12", income: 5900, expense: 4300, balance: 1600 }
  ]
};

// Função para simular delay de API
export const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Função para simular erro ocasional
export const shouldSimulateError = () => Math.random() < 0.1; // 10% chance de erro
