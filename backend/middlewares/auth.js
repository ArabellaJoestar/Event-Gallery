// middlewares/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'maxmin093711059827';


// Verifica se o token existe e decodifica
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Não autorizado: token ausente' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // anexar dados do usuário no request
    req.user = payload; // ex: { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// Verifica se o usuário é admin
function isAdmin(req, res, next) {
  // authenticate deve ter sido executado antes (ou chamamos internamente)
  if (!req.user) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  // assumindo payload.role === 'admin' ou isAdmin: true
  if (req.user.role === 'admin' || req.user.isAdmin === true) {
    return next();
  }

  return res.status(403).json({ message: 'Acesso negado: apenas administradores' });
}

export default authenticate
