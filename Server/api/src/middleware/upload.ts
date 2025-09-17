import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Garantir que o diretório de uploads existe
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category || 'general';
    const categoryPath = path.join(uploadDir, category);
    
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }
    
    cb(null, categoryPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Filtro de tipos de arquivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = process.env.ALLOWED_IMAGE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}`));
  }
};

// Configuração do multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE!) || 5 * 1024 * 1024, // 5MB padrão
  }
});

export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files', 10);
export const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);
