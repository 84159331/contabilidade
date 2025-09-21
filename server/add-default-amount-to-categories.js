const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/igreja.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('✅ Conectado ao banco de dados.');
});

db.serialize(() => {
  console.log('🔧 Adicionando coluna default_amount à tabela categories...');
  db.run(`
    ALTER TABLE categories
    ADD COLUMN default_amount REAL DEFAULT 0;
  `, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name: default_amount')) {
        console.warn('⚠️ Coluna default_amount já existe. Migração ignorada.');
      } else {
        console.error('❌ Erro ao adicionar coluna default_amount:', err.message);
      }
    } else {
      console.log('✅ Coluna default_amount adicionada com sucesso à tabela categories.');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('❌ Erro ao fechar o banco de dados:', err.message);
  } else {
    console.log('🔒 Conexão com banco de dados fechada. Migração concluída!');
  }
});
