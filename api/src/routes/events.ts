import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations
} from '../controllers/eventController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Validações
const eventValidation = [
  body('title')
    .notEmpty()
    .withMessage('Título é obrigatório')
    .isLength({ max: 200 })
    .withMessage('Título deve ter no máximo 200 caracteres'),
  body('description')
    .notEmpty()
    .withMessage('Descrição é obrigatória'),
  body('date')
    .isISO8601()
    .withMessage('Data inválida'),
  body('time')
    .notEmpty()
    .withMessage('Horário é obrigatório'),
  body('location')
    .notEmpty()
    .withMessage('Local é obrigatório'),
  body('category')
    .notEmpty()
    .withMessage('Categoria é obrigatória'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacidade deve ser um número positivo')
];

const slugValidation = [
  param('slug')
    .notEmpty()
    .withMessage('Slug é obrigatório')
];

const idValidation = [
  param('id')
    .isUUID()
    .withMessage('ID inválido')
];

// Rotas públicas
router.get('/', getEvents);
router.get('/slug/:slug', slugValidation, handleValidationErrors, getEventBySlug);

// Rotas protegidas (admin)
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  eventValidation, 
  handleValidationErrors, 
  createEvent
);

router.put('/:id', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  handleValidationErrors, 
  updateEvent
);

router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  handleValidationErrors, 
  deleteEvent
);

router.get('/:id/registrations', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  handleValidationErrors, 
  getEventRegistrations
);

export default router;
