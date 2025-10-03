// Function para buscar transações
exports.handler = async (event, context) => {
  console.log('💰 Transactions function chamada:', event.httpMethod);
  
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Lidar com preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Método não permitido' })
      };
    }

    // Dados simulados de transações
    const transactions = [
      {
        id: 1,
        description: 'Dízimo - João Silva',
        amount: 500.00,
        type: 'income',
        category_id: 1,
        member_id: 1,
        transaction_date: '2024-01-15',
        payment_method: 'Dinheiro',
        reference: 'DIZ-001',
        notes: 'Dízimo mensal',
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        description: 'Oferta - Maria Santos',
        amount: 200.00,
        type: 'income',
        category_id: 2,
        member_id: 2,
        transaction_date: '2024-01-15',
        payment_method: 'PIX',
        reference: 'OFE-001',
        notes: 'Oferta especial',
        created_at: '2024-01-15T11:00:00Z'
      },
      {
        id: 3,
        description: 'Conta de luz',
        amount: 150.00,
        type: 'expense',
        category_id: 3,
        member_id: null,
        transaction_date: '2024-01-14',
        payment_method: 'Transferência',
        reference: 'DESP-001',
        notes: 'Conta de luz da igreja',
        created_at: '2024-01-14T14:00:00Z'
      },
      {
        id: 4,
        description: 'Material de limpeza',
        amount: 80.00,
        type: 'expense',
        category_id: 4,
        member_id: null,
        transaction_date: '2024-01-13',
        payment_method: 'Dinheiro',
        reference: 'DESP-002',
        notes: 'Produtos de limpeza',
        created_at: '2024-01-13T09:00:00Z'
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        transactions,
        total: transactions.length
      })
    };

  } catch (error) {
    console.error('❌ Erro na function transactions:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      })
    };
  }
};
