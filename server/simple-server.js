console.log('🚀 Iniciando servidor na porta 3001...');

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  console.log('✅ Health check chamado');
  res.json({ status: 'OK', message: 'Servidor funcionando', port: PORT });
});

app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login chamado:', req.body);
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({ 
      token: 'test-token-123', 
      user: { id: 1, username: 'admin', role: 'admin' } 
    });
  } else if (username === 'Jadney' && password === 'password123') {
    res.json({ 
      token: 'test-token-jadney', 
      user: { id: 2, username: 'Jadney', role: 'admin' } 
    });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

app.post('/api/auth/verify', (req, res) => {
  console.log('🔍 Verificação de token chamada');
  res.json({ 
    user: { id: 1, username: 'admin', role: 'admin' } 
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/auth/login`);
  console.log('📝 Credenciais: admin/admin123 ou Jadney/password123');
});
