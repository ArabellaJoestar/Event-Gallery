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
      JWT_SECRET,
      {expiresIn: '7d'}
    );
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Credenciais inválidas' });
};

export const verifyToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ valid: false, message: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ valid: false, message: 'Token inválido ou expirado' });
    }
    return res.json({ valid: true, user: decoded });
  });
};