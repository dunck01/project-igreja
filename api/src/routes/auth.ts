import { Router } from 'express';
import { body } from 'express-validator';
import { login, validateToken } from '../controllers/authController';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Validações
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

// Rotas
router.post('/login', loginValidation, handleValidationErrors, login);
router.get('/validate', validateToken);

export default router;
