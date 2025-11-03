import mysql from 'mysql2/promise';
import 'dotenv/config'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Ativa suporte a chaves estrangeiras
pool.getConnection().then(
  connection =>{
    console.log('Conexão com a base de dados estabelecida');
    connection.release();
  })
  .catch(err =>{
    console.error(`Erro ao conectar-se a base de dados: ${err}`)
  })


export default pool;
