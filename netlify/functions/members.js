// Function para gerenciar membros (CRUD completo)
exports.handler = async (event, context) => {
  console.log('👥 Members function chamada:', event.httpMethod, event.path);
  
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
    const { httpMethod, path, body } = event;
    const pathParts = path.split('/');
    const memberId = pathParts[pathParts.length - 1];
    
    // Verificar se é uma operação específica de um membro
    const isSpecificMember = !isNaN(memberId) && memberId !== 'members';
    
    console.log('🔍 Operação:', httpMethod, 'ID:', memberId, 'É específico:', isSpecificMember);

    // Dados simulados de membros (em produção, isso viria do banco de dados)
    let members = [
      {
        id: 1,
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999',
        address: 'Rua das Flores, 123',
        birth_date: '1985-05-15',
        member_since: '2020-01-15',
        status: 'active',
        notes: 'Membro ativo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        notes: 'Membro ativo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        notes: 'Membro ativo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Operações CRUD
    switch (httpMethod) {
      case 'GET':
        if (isSpecificMember) {
          // GET /members/{id} - Buscar membro específico
          const member = members.find(m => m.id === parseInt(memberId));
          if (!member) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Membro não encontrado' })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(member)
          };
        } else {
          // GET /members - Listar todos os membros
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              members,
              total: members.length
            })
          };
        }

      case 'POST':
        // POST /members - Criar novo membro
        if (isSpecificMember) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Use POST /members para criar um novo membro' })
          };
        }
        
        const newMemberData = JSON.parse(body || '{}');
        const newId = Math.max(...members.map(m => m.id)) + 1;
        const newMember = {
          id: newId,
          ...newMemberData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        members.push(newMember);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            message: 'Membro criado com sucesso',
            member: newMember
          })
        };

      case 'PUT':
        // PUT /members/{id} - Atualizar membro
        if (!isSpecificMember) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'ID do membro é obrigatório para atualização' })
          };
        }
        
        const memberIndex = members.findIndex(m => m.id === parseInt(memberId));
        if (memberIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Membro não encontrado' })
          };
        }
        
        const updateData = JSON.parse(body || '{}');
        members[memberIndex] = {
          ...members[memberIndex],
          ...updateData,
          updated_at: new Date().toISOString()
        };
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: 'Membro atualizado com sucesso',
            member: members[memberIndex]
          })
        };

      case 'DELETE':
        // DELETE /members/{id} - Deletar membro
        if (!isSpecificMember) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'ID do membro é obrigatório para exclusão' })
          };
        }
        
        const deleteIndex = members.findIndex(m => m.id === parseInt(memberId));
        if (deleteIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Membro não encontrado' })
          };
        }
        
        const deletedMember = members.splice(deleteIndex, 1)[0];
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: 'Membro deletado com sucesso',
            member: deletedMember
          })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Método não permitido' })
        };
    }

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
