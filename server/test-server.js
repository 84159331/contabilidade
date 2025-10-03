console.log('🚀 Testando servidor simples...');

const express = require('express');
const app = express();
const PORT = 5001;

app.use(express.json());

app.get('/api/health', (req, res) => {
  console.log('✅ Health check chamado');
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login chamado:', req.body);
  res.json({ 
    token: 'test-token', 
    user: { id: 1, username: 'admin', role: 'admin' } 
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Teste: http://localhost:${PORT}/api/health`);
});
