const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database/igreja.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('✅ Conectado ao banco de dados com sucesso.');
});

console.log('🗑️  Limpando a tabela de categorias...');

db.serialize(() => {
  // Deleta todos os registros da tabela
  db.run(`DELETE FROM categories;`, function(err) {
    if (err) {
      return console.error('❌ Erro ao deletar categorias:', err.message);
    }
    console.log(`✅ ${this.changes} categorias foram removidas.`);
  });

  // Reseta o contador de auto-incremento para a tabela
  db.run(`DELETE FROM sqlite_sequence WHERE name='categories';`, function(err) {
    if (err) {
      console.warn(`⚠️  Não foi possível resetar o contador da tabela de categorias. Isso geralmente não é um problema. Erro: ${err.message}`);
    } else {
      console.log('🔄 Contador da tabela de categorias resetado.');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('❌ Erro ao fechar o banco de dados:', err.message);
  } else {
    console.log('🔒 Conexão com banco de dados fechada. Limpeza concluída!');
  }
});
