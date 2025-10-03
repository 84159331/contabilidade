// Function para buscar categorias
exports.handler = async (event, context) => {
  console.log('📂 Categories function chamada:', event.httpMethod);
  
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

    // Dados simulados de categorias
    const categories = [
      {
        id: 1,
        name: 'Dízimos',
        type: 'income',
        description: 'Dízimos dos membros',
        color: '#10B981',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        name: 'Ofertas',
        type: 'income',
        description: 'Ofertas especiais',
        color: '#3B82F6',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 3,
        name: 'Utilidades',
        type: 'expense',
        description: 'Contas de água, luz, telefone',
        color: '#EF4444',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 4,
        name: 'Manutenção',
        type: 'expense',
        description: 'Manutenção do prédio',
        color: '#F59E0B',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 5,
        name: 'Eventos',
        type: 'expense',
        description: 'Custos com eventos',
        color: '#8B5CF6',
        created_at: '2024-01-01T00:00:00Z'
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        categories,
        total: categories.length
      })
    };

  } catch (error) {
    console.error('❌ Erro na function categories:', error);
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
