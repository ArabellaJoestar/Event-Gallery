import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsername(username)  
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    console.log(password)
    const isPasswordValid = await password === user.password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { 
        id: user.id,
        role: user.role || 'admin'
      }, 
      JWT_SECRET
    );

    return res.json({ token });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};