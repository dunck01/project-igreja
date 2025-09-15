import { Router } from 'express';
import { param } from 'express-validator';
import {
  uploadFile,
  getUploads,
  deleteUpload,
  markAsUsed
} from '../controllers/uploadController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Validações
const idValidation = [
  param('id')
    .isUUID()
    .withMessage('ID inválido')
];

// Rotas protegidas (admin)
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  uploadSingle, 
  uploadFile
);

router.get('/', authenticateToken, requireAdmin, getUploads);

router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  handleValidationErrors, 
  deleteUpload
);

router.patch('/:id/used', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  handleValidationErrors, 
  markAsUsed
);

export default router;
