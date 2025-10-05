import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3472;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const uploadDir = path.join(__dirname, 'assets', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'evento-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.post('/', upload.array('images', 10), async (req, res) => {
  try {
    let { name, description, principal_photo, date_event } = req.body;

    if (!name || !req.files || req.files.length === 0 || principal_photo === undefined || !date_event) {
      return res.status(400).json({
        error: {
          message: 'Houve um erro na requisição dos dados fornecidos. Certifique-se de enviar: name, images (arquivos), principal_photo e date_event'
        }
      });
    }

    const regex = /^[\p{L}\p{N} ]+$/u;
    const validation = !regex.test(name);

    if (validation) {
      return res.status(400).json({
        error: {
          message: 'Nome fornecido possui caracteres especiais, por favor forneça um nome sem caracteres especiais'
        }
      });
    }

    const imagePaths = req.files.map(file => `./assets/uploads/${file.filename}`);
    const imagesJSON = JSON.stringify(imagePaths);

    const principalPhotoIndex = parseInt(principal_photo);
    if (isNaN(principalPhotoIndex) || principalPhotoIndex < 0 || principalPhotoIndex >= imagePaths.length) {
      return res.status(400).json({
        error: {
          message: 'Índice da foto principal inválido'
        }
      });
    }

    const actual_date = new Date();
    const date_creation = `${actual_date.getDate()}-${actual_date.getMonth() + 1}-${actual_date.getFullYear()}`;
    const id_req = `REQ-${Date.now()}`;

    if (!description || description.trim() === '') {
      description = "12null12";
    }

    const dateEventObj = new Date(date_event);
    if (isNaN(dateEventObj)) {
      return res.status(400).json({
        error: {
          message: "Data do evento inválida"
        }
      });
    }

    const SQL = `INSERT INTO eventos(
      id_req, name, images, description, principal_photo, date_creation, date_event
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const params = [id_req, name, imagesJSON, description, principalPhotoIndex, date_creation, date_event];

    db.run(SQL, params, function (err) {
      if (err) {
        console.error('Erro ao inserir evento:', err.message);
        return res.status(500).json({
          error: 'Erro ao inserir evento na base de dados'
        });
      }

      res.status(201).json({
        id: this.lastID,
        id_req,
        name,
        images: imagePaths,
        description,
        principal_photo: principalPhotoIndex,
        date_creation,
        date_event
      });
    });

  } catch (error) {
    console.error('Erro no processamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

app.get('/', (req, res) => {
  const SQL = `SELECT * FROM eventos WHERE date_deletion IS NULL`;

  db.all(SQL, [], (err, rows) => {
    if (err) {
      console.error('Erro no select dos dados:', err.message);
      return res.status(500).json({
        error: 'Erro ao buscar eventos'
      });
    }

    const eventos = rows.map(evento => ({
      ...evento,
      images: JSON.parse(evento.images)
    }));

    res.json(eventos);
  });
});

app.get('/:id', (req, res) => {
  const { id } = req.params;
  const SQL = `SELECT * FROM eventos WHERE id = ? AND date_deletion IS NULL`;

  db.get(SQL, [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar evento:', err.message);
      return res.status(500).json({
        error: 'Erro ao buscar evento'
      });
    }

    if (!row) {
      return res.status(404).json({
        error: 'Evento não encontrado'
      });
    }

    const evento = {
      ...row,
      images: JSON.parse(row.images)
    };

    res.json(evento);
  });
});

app.put('/:id', upload.array('images', 10), (req, res) => {
  const { id } = req.params;
  let { name, description, principal_photo, date_event } = req.body;

  const selectSQL = `SELECT * FROM eventos WHERE id = ? AND date_deletion IS NULL`;

  db.get(selectSQL, [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar evento:', err.message);
      return res.status(500).json({
        error: 'Erro ao buscar evento'
      });
    }

    if (!row) {
      return res.status(404).json({
        error: 'Evento não encontrado'
      });
    }

    let imagePaths = JSON.parse(row.images);

    if (req.files && req.files.length > 0) {
      imagePaths.forEach(imgPath => {
        const fullPath = path.join(__dirname, imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });

      imagePaths = req.files.map(file => `./assets/uploads/${file.filename}`);
    }

    const updatedName = name || row.name;
    const updatedDescription = description || row.description;
    const updatedPrincipalPhoto = principal_photo !== undefined ? parseInt(principal_photo) : row.principal_photo;

    if (updatedPrincipalPhoto < 0 || updatedPrincipalPhoto >= imagePaths.length) {
      return res.status(400).json({
        error: {
          message: 'Índice da foto principal inválido'
        }
      });
    }

    const imagesJSON = JSON.stringify(imagePaths);

    const updateSQL = `UPDATE eventos SET 
      name = ?, 
      images = ?, 
      description = ?, 
      principal_photo = ?,
      date_event = ?
      WHERE id = ?`;

    const params = [updatedName, imagesJSON, updatedDescription, updatedPrincipalPhoto, date_event, id];

    db.run(updateSQL, params, function (err) {
      if (err) {
        console.error('Erro ao atualizar evento:', err.message);
        return res.status(500).json({
          error: 'Erro ao atualizar evento'
        });
      }

      res.json({
        id,
        name: updatedName,
        images: imagePaths,
        description: updatedDescription,
        principal_photo: updatedPrincipalPhoto
      });
    });
  });
});

app.delete('/:id', (req, res) => {
  const { id } = req.params;
  const actual_date = new Date();
  const date_deletion = `${actual_date.getDate()}-${actual_date.getMonth() + 1}-${actual_date.getFullYear()}`;

  const SQL = `UPDATE eventos SET date_deletion = ? WHERE id = ?`;

  db.run(SQL, [date_deletion, id], function (err) {
    if (err) {
      console.error('Erro ao deletar evento:', err.message);
      return res.status(500).json({
        error: 'Erro ao deletar evento'
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: 'Evento não encontrado'
      });
    }

    res.json({
      message: 'Evento deletado com sucesso',
      id,
      date_deletion
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
