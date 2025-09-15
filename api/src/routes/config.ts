import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getConfigs,
  updateConfig,
  updateMultipleConfigs,
  getConfigsByCategory,
  createConfig,
  deleteConfig
} from '../controllers/configController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Validações
const configValidation = [
  body('key')
    .notEmpty()
    .withMessage('Chave é obrigatória')
    .matches(/^[a-z_]+$/)
    .withMessage('Chave deve conter apenas letras minúsculas e underscores'),
  body('value')
    .notEmpty()
    .withMessage('Valor é obrigatório'),
  body('type')
    .optional()
    .isIn(['TEXT', 'NUMBER', 'BOOLEAN', 'JSON', 'COLOR', 'IMAGE', 'URL'])
    .withMessage('Tipo inválido')
];

const keyValidation = [
  param('key')
    .notEmpty()
    .withMessage('Chave é obrigatória')
];

const categoryValidation = [
  param('category')
    .notEmpty()
    .withMessage('Categoria é obrigatória')
];

// Rotas públicas (configs públicas)
router.get('/public', getConfigs);

// Rotas protegidas (admin)
router.get('/', authenticateToken, requireAdmin, getConfigs);
router.get('/category/:category', 
  authenticateToken, 
  requireAdmin, 
  categoryValidation,
  handleValidationErrors, 
  getConfigsByCategory
);
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  configValidation,
  handleValidationErrors, 
  createConfig
);
router.put('/bulk', 
  authenticateToken, 
  requireAdmin, 
  body('configs').isObject().withMessage('Configurações devem ser um objeto'),
  handleValidationErrors, 
  updateMultipleConfigs
);
router.put('/:key', 
  authenticateToken, 
  requireAdmin, 
  keyValidation,
  body('value').notEmpty().withMessage('Valor é obrigatório'),
  handleValidationErrors, 
  updateConfig
);
router.delete('/:key', 
  authenticateToken, 
  requireAdmin, 
  keyValidation,
  handleValidationErrors, 
  deleteConfig
);

export default router;
