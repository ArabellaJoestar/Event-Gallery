import sqlite3 from 'sqlite3';
const { Database } = sqlite3.verbose();

// Criar ou abrir o banco de dados local (arquivo .db)
const db = new Database('./meu_banco.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
  }
});

// Criar tabela de eventos se não existir
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_req TEXT NOT NULL,
    name TEXT NOT NULL,
    images TEXT NOT NULL,
    description TEXT,
    principal_photo INTEGER NOT NULL,
    date_creation TEXT NOT NULL,
    date_event TEXT NOT NULL,
    date_deletion TEXT DEFAULT NULL
  )
`;

db.run(createTableSQL, (err) => {
  if (err) {
    console.error('Erro ao criar tabela:', err.message);
  } else {
    console.log('Tabela "eventos" verificada/criada com sucesso');
  }
});

// Exportar a conexão
export default db;
