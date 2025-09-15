import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createRegistration,
  getRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  getRegistrationById,
  exportRegistrations
} from '../controllers/registrationController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Validações
const registrationValidation = [
  body('eventId')
    .isUUID()
    .withMessage('ID do evento inválido'),
  body('name')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ max: 100 })
    .withMessage('Nome deve ter no máximo 100 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('phone')
    .notEmpty()
    .withMessage('Telefone é obrigatório')
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Formato de telefone inválido')
];

const statusValidation = [
  body('status')
    .isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'WAITLIST'])
    .withMessage('Status inválido')
];

const idValidation = [
  param('id')
    .isUUID()
    .withMessage('ID inválido')
];

// Rotas públicas
router.post('/', registrationValidation, handleValidationErrors, createRegistration);

// Rotas protegidas (admin)
router.get('/', authenticateToken, requireAdmin, getRegistrations);
router.get('/export', authenticateToken, requireAdmin, exportRegistrations);
router.get('/:id', authenticateToken, requireAdmin, idValidation, handleValidationErrors, getRegistrationById);
router.put('/:id/status', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  statusValidation,
  handleValidationErrors, 
  updateRegistrationStatus
);
router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  handleValidationErrors, 
  deleteRegistration
);

export default router;
