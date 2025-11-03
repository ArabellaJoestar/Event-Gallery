import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename))

//Diretório para armazenamento das imagens !
const uploadDirImage = path.join(__dirname, 'assets', 'images')
//Diretório para armazenamento dos documentos !
const uploadDirDocuments = path.join(__dirname, 'assets', 'documents')


const mixedStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'images') cb(null, uploadDirImage);
        else if (file.fieldname === 'documents') cb(null, uploadDirDocuments)
        else cb(new Error('Campo de upload enviado é desconhecido.'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) cb(null, true);
    else cb(new Error('Tipo de arquivo inválido.'));
}

const upload = multer({
  storage: mixedStorage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }
});

export default upload;