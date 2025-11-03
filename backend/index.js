import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Importação das rotas
import authRoutes from './routes/authRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Servindo arquivos estáticos de:', path.join(__dirname, 'assets'));

const app = express();
const PORT = process.env.PORT || 3472;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos (imagens, documentos)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Registro das Rotas
app.use('/login', authRoutes);  // Rotas de login
app.use('/group', groupRoutes); // Todas as rotas de /group
app.use('/', eventRoutes);      // Todas as rotas de evento (/, /:id)

// Start
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});