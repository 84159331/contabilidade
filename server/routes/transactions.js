const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const { validateTransaction } = require('../middleware/validation');

const router = express.Router();
const dbPath = path.join(__dirname, '../../database/igreja.db');

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// Listar transações
router.get('/', (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    type = 'all', 
    category_id, 
    member_id, 
    start_date, 
    end_date,
    search = ''
  } = req.query;
  
  const offset = (page - 1) * limit;
  
  let whereClause = 'WHERE 1=1';
  let params = [];
  
  if (type !== 'all') {
    whereClause += ' AND t.type = ?';
    params.push(type);
  }
  
  if (category_id) {
    whereClause += ' AND t.category_id = ?';
    params.push(category_id);
  }
  
  if (member_id) {
    whereClause += ' AND t.member_id = ?';
    params.push(member_id);
  }
  
  if (start_date) {
    whereClause += ' AND t.transaction_date >= ?';
    params.push(start_date);
  }
  
  if (end_date) {
    whereClause += ' AND t.transaction_date <= ?';
    params.push(end_date);
  }
  
  if (search) {
    whereClause += ' AND (t.description LIKE ? OR t.reference LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }
  
  const db = new sqlite3.Database(dbPath);
  
  // Contar total de transações
  db.get(
    `SELECT COUNT(*) as total FROM transactions t ${whereClause}`,
    params,
    (err, countResult) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Erro ao contar transações' });
      }
      
      // Buscar transações com paginação
      db.all(
        `SELECT 
           t.*,
           c.name as category_name,
           c.color as category_color,
           m.name as member_name
         FROM transactions t
         LEFT JOIN categories c ON t.category_id = c.id
         LEFT JOIN members m ON t.member_id = m.id
         ${whereClause}
         ORDER BY t.transaction_date DESC, t.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset],
        (err, transactions) => {
          db.close();
          
          if (err) {
            return res.status(500).json({ error: 'Erro ao buscar transações' });
          }
          
          res.json({
            transactions,
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: countResult.total,
              pages: Math.ceil(countResult.total / limit)
            }
          });
        }
      );
    }
  );
});

// Obter transação por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const db = new sqlite3.Database(dbPath);
  
  db.get(
    `SELECT 
       t.*,
       c.name as category_name,
       c.color as category_color,
       m.name as member_name
     FROM transactions t
     LEFT JOIN categories c ON t.category_id = c.id
     LEFT JOIN members m ON t.member_id = m.id
     WHERE t.id = ?`,
    [id],
    (err, transaction) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar transação' });
      }
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }
      
      res.json(transaction);
    }
  );
});

// Criar nova transação
router.post('/', validateTransaction, (req, res) => {
  const {
    description,
    amount,
    type,
    category_id,
    member_id,
    transaction_date,
    payment_method,
    reference,
    notes
  } = req.body;
  
  const db = new sqlite3.Database(dbPath);
  
  db.run(
    `INSERT INTO transactions 
     (description, amount, type, category_id, member_id, transaction_date, 
      payment_method, reference, notes, created_by) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      description, 
      amount, 
      type, 
      category_id || null, 
      member_id || null, 
      transaction_date,
      payment_method || null, 
      reference || null, 
      notes || null,
      req.user.id
    ],
    function(err) {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar transação' });
      }
      
      res.status(201).json({ 
        message: 'Transação criada com sucesso',
        id: this.lastID
      });
    }
  );
});

// Atualizar transação
router.put('/:id', validateTransaction, (req, res) => {
  const { id } = req.params;
  const {
    description,
    amount,
    type,
    category_id,
    member_id,
    transaction_date,
    payment_method,
    reference,
    notes
  } = req.body;
  
  const db = new sqlite3.Database(dbPath);
  
  db.run(
    `UPDATE transactions SET 
     description = ?, amount = ?, type = ?, category_id = ?, member_id = ?, 
     transaction_date = ?, payment_method = ?, reference = ?, notes = ?,
     updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      description, 
      amount, 
      type, 
      category_id || null, 
      member_id || null, 
      transaction_date,
      payment_method || null, 
      reference || null, 
      notes || null,
      id
    ],
    function(err) {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar transação' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }
      
      res.json({ message: 'Transação atualizada com sucesso' });
    }
  );
});

// Deletar transação
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const db = new sqlite3.Database(dbPath);
  
  db.run(
    'DELETE FROM transactions WHERE id = ?',
    [id],
    function(err) {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao deletar transação' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }
      
      res.json({ message: 'Transação deletada com sucesso' });
    }
  );
});

// Obter resumo financeiro
router.get('/summary/overview', (req, res) => {
  const { start_date, end_date } = req.query;
  
  let whereClause = 'WHERE 1=1';
  let params = [];
  
  if (start_date) {
    whereClause += ' AND transaction_date >= ?';
    params.push(start_date);
  }
  
  if (end_date) {
    whereClause += ' AND transaction_date <= ?';
    params.push(end_date);
  }
  
  const db = new sqlite3.Database(dbPath);
  
  db.all(
    `SELECT 
       type,
       SUM(amount) as total,
       COUNT(*) as count
     FROM transactions 
     ${whereClause}
     GROUP BY type`,
    params,
    (err, results) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar resumo' });
      }
      
      const summary = {
        income: { total: 0, count: 0 },
        expense: { total: 0, count: 0 },
        balance: 0
      };
      
      results.forEach(result => {
        summary[result.type] = {
          total: parseFloat(result.total),
          count: result.count
        };
      });
      
      summary.balance = summary.income.total - summary.expense.total;
      
      res.json(summary);
    }
  );
});

// Obter transações por categoria
router.get('/summary/by-category', (req, res) => {
  const { type, start_date, end_date } = req.query;
  
  let whereClause = 'WHERE 1=1';
  let params = [];
  
  if (type) {
    whereClause += ' AND t.type = ?';
    params.push(type);
  }
  
  if (start_date) {
    whereClause += ' AND t.transaction_date >= ?';
    params.push(start_date);
  }
  
  if (end_date) {
    whereClause += ' AND t.transaction_date <= ?';
    params.push(end_date);
  }
  
  const db = new sqlite3.Database(dbPath);
  
  db.all(
    `SELECT 
       c.id,
       c.name,
       c.color,
       COALESCE(SUM(t.amount), 0) as total,
       COUNT(t.id) as count
     FROM categories c
     LEFT JOIN transactions t ON c.id = t.category_id ${whereClause}
     GROUP BY c.id, c.name, c.color
     ORDER BY total DESC`,
    params,
    (err, results) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar resumo por categoria' });
      }
      
      res.json(results);
    }
  );
});

// Obter fluxo de caixa mensal
router.get('/summary/cash-flow', (req, res) => {
  const { year = new Date().getFullYear() } = req.query;
  
  const db = new sqlite3.Database(dbPath);
  
  db.all(
    `SELECT 
       strftime('%m', transaction_date) as month,
       type,
       SUM(amount) as total
     FROM transactions 
     WHERE strftime('%Y', transaction_date) = ?
     GROUP BY strftime('%m', transaction_date), type
     ORDER BY month`,
    [year],
    (err, results) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar fluxo de caixa' });
      }
      
      // Organizar dados por mês
      const monthlyData = {};
      
      for (let i = 1; i <= 12; i++) {
        const month = i.toString().padStart(2, '0');
        monthlyData[month] = {
          month: month,
          income: 0,
          expense: 0,
          balance: 0
        };
      }
      
      results.forEach(result => {
        const month = result.month;
        monthlyData[month][result.type] = parseFloat(result.total);
        monthlyData[month].balance = monthlyData[month].income - monthlyData[month].expense;
      });
      
      res.json(Object.values(monthlyData));
    }
  );
});

module.exports = router;
