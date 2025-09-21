const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { validateUser } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const dbPath = path.join(__dirname, '../../database/igreja.db');

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e senha são obrigatórios' });
    }

    const db = new sqlite3.Database(dbPath);
    
    db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username],
      async (err, user) => {
        db.close();
        
        if (err) {
          return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        
        if (!user) {
          return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
        
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registrar novo usuário
router.post('/register', validateUser, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const db = new sqlite3.Database(dbPath);
    
    // Verificar se username ou email já existem
    db.get(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email],
      async (err, existingUser) => {
        if (err) {
          db.close();
          return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        
        if (existingUser) {
          db.close();
          return res.status(400).json({ error: 'Username ou email já existem' });
        }
        
        // Criptografar senha
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Inserir novo usuário
        db.run(
          'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
          [username, email, hashedPassword, 'admin'],
          function(err) {
            db.close();
            
            if (err) {
              return res.status(500).json({ error: 'Erro ao criar usuário' });
            }
            
            res.status(201).json({ 
              message: 'Usuário criado com sucesso',
              userId: this.lastID
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter perfil do usuário
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Alterar senha
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });
    }
    
    const db = new sqlite3.Database(dbPath);
    
    // Verificar senha atual
    db.get(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id],
      async (err, user) => {
        if (err) {
          db.close();
          return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        
        if (!user) {
          db.close();
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        
        if (!isValidPassword) {
          db.close();
          return res.status(401).json({ error: 'Senha atual incorreta' });
        }
        
        // Criptografar nova senha
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        // Atualizar senha
        db.run(
          'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [hashedNewPassword, req.user.id],
          function(err) {
            db.close();
            
            if (err) {
              return res.status(500).json({ error: 'Erro ao alterar senha' });
            }
            
            res.json({ message: 'Senha alterada com sucesso' });
          }
        );
      }
    );
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
