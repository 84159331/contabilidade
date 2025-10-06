import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

// Inicializar Firebase Admin
admin.initializeApp();

// Configurar CORS
const corsHandler = cors({ origin: true });

// Função de health check
export const health = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, () => {
    console.log('🏥 Health check Firebase Functions');
    
    res.status(200).json({
      status: 'OK',
      message: 'Firebase Functions funcionando',
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path
    });
  });
});

// Função de login (compatível com sistema atual)
export const login = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
      }

      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username e password são obrigatórios' });
      }

      // Simulação de usuário (substituir por Firestore depois)
      const users = [
        {
          id: 1,
          username: 'admin',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
          name: 'Administrador',
          role: 'admin'
        }
      ];

      const user = users.find(u => u.username === username);
      
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha (simplificado para demo)
      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token JWT
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        'firebase-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role
        }
      });

    } catch (error) {
      console.error('❌ Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
});

// Função para verificar token
export const verifyToken = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
      }

      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: 'Token é obrigatório' });
      }

      // Verificar token JWT
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, 'firebase-secret-key');

      res.json({
        valid: true,
        user: decoded
      });

    } catch (error) {
      console.error('❌ Erro na verificação do token:', error);
      res.status(401).json({ error: 'Token inválido' });
    }
  });
});
