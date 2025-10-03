const express = require('express');
const cors = require('cors');

console.log('🚀 Iniciando servidor...');

const app = express();
const PORT = 8080;

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  console.log('✅ Health check chamado');
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login chamado:', req.body);
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    console.log('✅ Login admin bem-sucedido');
    res.json({ 
      token: 'test-token-admin-123', 
      user: { id: 1, username: 'admin', role: 'admin' } 
    });
  } else if (username === 'Jadney' && password === 'password123') {
    console.log('✅ Login Jadney bem-sucedido');
    res.json({ 
      token: 'test-token-jadney-123', 
      user: { id: 2, username: 'Jadney', role: 'admin' } 
    });
  } else {
    console.log('❌ Login falhou para:', username);
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

app.post('/api/auth/verify', (req, res) => {
  console.log('🔍 Verificação de token chamada');
  res.json({ 
    user: { id: 1, username: 'admin', role: 'admin' } 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/auth/login`);
  console.log('📝 Credenciais: admin/admin123 ou Jadney/password123');
  console.log('🔧 Teste: curl http://localhost:8080/api/health');
});
