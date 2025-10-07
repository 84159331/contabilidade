// Dados mock para o dashboard funcionar sem backend
export const mockDashboardData = {
  financialSummary: {
    income: { total: 0, count: 0 },
    expense: { total: 0, count: 0 },
    balance: 0
  },
  memberStats: {
    total: 0,
    active: 0,
    inactive: 0
  },
  recentTransactions: [],
  cashFlowData: [
    { month: "1", income: 0, expense: 0, balance: 0 },
    { month: "2", income: 0, expense: 0, balance: 0 },
    { month: "3", income: 0, expense: 0, balance: 0 },
    { month: "4", income: 0, expense: 0, balance: 0 },
    { month: "5", income: 0, expense: 0, balance: 0 },
    { month: "6", income: 0, expense: 0, balance: 0 },
    { month: "7", income: 0, expense: 0, balance: 0 },
    { month: "8", income: 0, expense: 0, balance: 0 },
    { month: "9", income: 0, expense: 0, balance: 0 },
    { month: "10", income: 0, expense: 0, balance: 0 },
    { month: "11", income: 0, expense: 0, balance: 0 },
    { month: "12", income: 0, expense: 0, balance: 0 }
  ],
  users: [
    {
      id: 1,
      username: "admin",
      email: "admin@igreja.com",
      role: "admin",
      created_at: "2024-01-01T00:00:00Z"
    }
  ],
  members: [],
  transactions: [],
  categories: [
    {
      id: 1,
      name: "Dízimos",
      type: "income" as const,
      description: "Contribuições regulares dos membros",
      color: "#10B981",
      transaction_count: 0,
      total_amount: 0,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Ofertas",
      type: "income" as const, 
      description: "Ofertas especiais e voluntárias",
      color: "#3B82F6",
      transaction_count: 0,
      total_amount: 0,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      name: "Utilidades",
      type: "expense" as const,
      description: "Contas de água, luz, telefone",
      color: "#EF4444",
      transaction_count: 0,
      total_amount: 0,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 4,
      name: "Manutenção",
      type: "expense" as const,
      description: "Reparos e manutenção do templo",
      color: "#F59E0B",
      transaction_count: 0,
      total_amount: 0,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    }
  ]
};

// Função para simular delay de API
export const simulateApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Função para simular erro ocasional
export const shouldSimulateError = () => Math.random() < 0.1; // 10% chance de erro
