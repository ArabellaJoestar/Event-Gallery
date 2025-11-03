import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Dados de admin
const ADMIN_USER = 'qualidade';
const ADMIN_PASS = 'Qualidade@0040@';
const JWT_SECRET = process.env.JWT_SECRET;

export const login = (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    // Adicionamos 'role: admin' ao payload
    const token = jwt.sign(
      { role: 'admin' }, 
      JWT_SECRET
    );
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Credenciais inválidas' });
};