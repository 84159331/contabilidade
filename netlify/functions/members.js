// Function para buscar membros
exports.handler = async (event, context) => {
  console.log('👥 Members function chamada:', event.httpMethod);
  
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

    // Dados simulados de membros
    const members = [
      {
        id: 1,
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999',
        address: 'Rua das Flores, 123',
        birth_date: '1985-05-15',
        member_since: '2020-01-15',
        status: 'active',
        notes: 'Membro ativo'
      },
      {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@email.com',
        phone: '(11) 88888-8888',
        address: 'Av. Principal, 456',
        birth_date: '1990-08-22',
        member_since: '2021-03-10',
        status: 'active',
        notes: 'Membro ativo'
      },
      {
        id: 3,
        name: 'Pedro Oliveira',
        email: 'pedro@email.com',
        phone: '(11) 77777-7777',
        address: 'Rua da Paz, 789',
        birth_date: '1988-12-03',
        member_since: '2019-11-20',
        status: 'active',
        notes: 'Membro ativo'
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        members,
        total: members.length
      })
    };

  } catch (error) {
    console.error('❌ Erro na function members:', error);
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
