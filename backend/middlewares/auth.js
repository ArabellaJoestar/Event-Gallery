import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;


// Verifica se o token existe e decodifica
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Não autorizado: token ausente' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// Verifica se o usuário é admin
export function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autorizado' });
  }
  if (req.user.role === 'admin' || req.user.isAdmin === true) {
    return next();
  }
  return res.status(403).json({ message: 'Acesso negado: apenas administradores' });
}
