import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename))

// Diretório para armazenamento das imagens !
const uploadDirImage = path.join(__dirname, 'assets', 'images')
// Diretório para armazenamento dos documentos !
const uploadDirDocuments = path.join(__dirname, 'assets', 'documents')
// Diretório para armazenamento dos vídeos !
const uploadDirVideos = path.join(__dirname, 'assets', 'videos')


const mixedStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'images') cb(null, uploadDirImage);
        else if(file.fieldname === 'videos') cb(null, uploadDirVideos)
        else if (file.fieldname === 'documents') cb(null, uploadDirDocuments)
        else cb(new Error('Campo de upload enviado é desconhecido.'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
})

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|txt|mp4|mov|bmp|tiff|psd|exif|raw)$/i;

  const allowedMime = [
    // imagens
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",

    // documentos
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",

    // vídeos
    "video/mp4",
    "video/quicktime" // mov
  ];

  const extIsValid = allowedExtensions.test(file.originalname.toLowerCase());
  const mimeIsValid = allowedMime.includes(file.mimetype);

  if (extIsValid && mimeIsValid) cb(null, true);
  else cb(new Error("Tipo de arquivo inválido."));
};

const upload = multer({
  storage: mixedStorage,
  fileFilter,
  limits: { fileSize: 250 * 1024 * 1024 }
});

export default upload;