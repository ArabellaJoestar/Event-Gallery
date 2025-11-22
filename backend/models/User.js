import pool from '../config/database.js';

export class User {

  //Método para buscar do usuário por username
  static async findByUsername(username) {
    const sql = `SELECT * FROM users WHERE username = ?`;
    const [rows] = await pool.query(sql, [username]);
    
    return rows[0];
  }

  //Método para busca de usuário por ID
  static async findById(id) {
    const sql = `SELECT id, username, role, created_at FROM users WHERE id = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows[0];
  }

  //Método para criação de um novo usuário
  static async create({ username, password, role }) {
    const sql = `
      INSERT INTO users (username, password, role)
      VALUES (?, ?, ?)
    `;
    const params = [username, password, role || 'admin'];

    const [result] = await pool.query(sql, params);

    return { id: result.insertId, username, role };
  }
}

export default User;