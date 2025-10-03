// Teste simples para verificar se as Netlify Functions estão funcionando
const testNetlifyFunctions = async () => {
  console.log('🧪 Testando Netlify Functions...');
  
  try {
    // Teste 1: Health check
    console.log('1. Testando health check...');
    const healthResponse = await fetch('/.netlify/functions/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Teste 2: Login
    console.log('2. Testando login...');
    const loginResponse = await fetch('/.netlify/functions/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'password123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login funcionando:', loginData);
    } else {
      const errorData = await loginResponse.text();
      console.log('❌ Erro no login:', loginResponse.status, errorData);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar functions:', error);
  }
};

// Executar teste quando a página carregar
if (typeof window !== 'undefined') {
  window.testNetlifyFunctions = testNetlifyFunctions;
  console.log('💡 Execute testNetlifyFunctions() no console para testar');
}
