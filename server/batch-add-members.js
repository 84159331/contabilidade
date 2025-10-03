const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database/igreja.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  }
  console.log('✅ Conectado ao banco de dados.');
});

const members = [
  'Beatriz', 'Igor', 'Daniel', 'Carol', 'Paulo', 'Paulo Vinicius', 
  'Ester', 'Emanuel', 'Daniele', 'Jussiara', 'Edy', 'Juliana', 
  'Matheus', 'Matheus Crescêncio', 'Washington', 'Andressa', 
  'Samuel Campos', 'Samuel Barbosa'
];

db.serialize(() => {
  const stmt = db.prepare("INSERT INTO members (name, member_since, status) VALUES (?, ?, ?)");
  
  const today = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD

  console.log(`➕ Adicionando ${members.length} membros...`);

  members.forEach(name => {
    stmt.run(name, today, 'active');
  });

  stmt.finalize((err) => {
    if (err) {
      console.error('❌ Erro ao finalizar a inserção:', err.message);
    } else {
      console.log(`✅ ${members.length} membros adicionados com sucesso!`);
    }
  });
});

db.close((err) => {
  if (err) {
    return console.error('❌ Erro ao fechar o banco de dados:', err.message);
  }
  console.log('🔒 Conexão com o banco de dados fechada.');
});
