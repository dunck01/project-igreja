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

/**
 * @swagger
 * tags:
 *   name: Configurações
 *   description: Gerenciamento de configurações do sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Config:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           description: Chave única da configuração
 *         value:
 *           type: string
 *           description: Valor da configuração
 *         type:
 *           type: string
 *           enum: [TEXT, NUMBER, BOOLEAN, JSON, COLOR, IMAGE, URL]
 *           description: Tipo da configuração
 *         category:
 *           type: string
 *           description: Categoria da configuração
 *         description:
 *           type: string
 *           description: Descrição da configuração
 *         isPublic:
 *           type: boolean
 *           description: Se a configuração é pública
 *     CreateConfigRequest:
 *       type: object
 *       required: [key, value]
 *       properties:
 *         key:
 *           type: string
 *           pattern: "^[a-z_]+$"
 *           description: Chave única (apenas letras minúsculas e underscores)
 *           example: "site_title"
 *         value:
 *           type: string
 *           description: Valor da configuração
 *           example: "Igreja Esperança"
 *         type:
 *           type: string
 *           enum: [TEXT, NUMBER, BOOLEAN, JSON, COLOR, IMAGE, URL]
 *           default: TEXT
 *           description: Tipo da configuração
 *         category:
 *           type: string
 *           description: Categoria da configuração
 *           example: "general"
 *         description:
 *           type: string
 *           description: Descrição da configuração
 *         isPublic:
 *           type: boolean
 *           default: false
 *           description: Se a configuração é pública
 */

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

/**
 * @swagger
 * /api/v1/config/public:
 *   get:
 *     summary: Buscar configurações públicas
 *     description: Retorna todas as configurações marcadas como públicas
 *     tags: [Configurações]
 *     security: []
 *     responses:
 *       200:
 *         description: Configurações públicas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 configs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Config'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/public', getConfigs);

/**
 * @swagger
 * /api/v1/config:
 *   get:
 *     summary: Listar todas as configurações
 *     description: Retorna todas as configurações do sistema (requer privilégios administrativos)
 *     tags: [Configurações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: public
 *         schema:
 *           type: boolean
 *         description: Filtrar por configurações públicas/privadas
 *     responses:
 *       200:
 *         description: Lista de configurações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 configs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Config'
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Privilégios administrativos necessários
 */
router.get('/', authenticateToken, requireAdmin, getConfigs);

/**
 * @swagger
 * /api/v1/config/category/{category}:
 *   get:
 *     summary: Buscar configurações por categoria
 *     description: Retorna configurações de uma categoria específica (requer privilégios administrativos)
 *     tags: [Configurações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da categoria
 *         example: "general"
 *     responses:
 *       200:
 *         description: Configurações da categoria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 configs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Config'
 *       400:
 *         description: Categoria inválida
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Privilégios administrativos necessários
 */
router.get('/category/:category', 
  authenticateToken, 
  requireAdmin, 
  categoryValidation,
  handleValidationErrors, 
  getConfigsByCategory
);

/**
 * @swagger
 * /api/v1/config:
 *   post:
 *     summary: Criar nova configuração
 *     description: Cria uma nova configuração do sistema (requer privilégios administrativos)
 *     tags: [Configurações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateConfigRequest'
 *     responses:
 *       201:
 *         description: Configuração criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Config'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Privilégios administrativos necessários
 *       409:
 *         description: Chave já existe
 */
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  configValidation,
  handleValidationErrors, 
  createConfig
);

/**
 * @swagger
 * /api/v1/config/bulk:
 *   put:
 *     summary: Atualizar múltiplas configurações
 *     description: Atualiza várias configurações de uma vez (requer privilégios administrativos)
 *     tags: [Configurações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [configs]
 *             properties:
 *               configs:
 *                 type: object
 *                 description: Objeto com chaves e valores das configurações
 *                 example:
 *                   site_title: "Nova Igreja"
 *                   site_description: "Uma igreja renovada"
 *                   contact_email: "contato@novaigreja.com"
 *     responses:
 *       200:
 *         description: Configurações atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Configurações atualizadas com sucesso"
 *                 updated:
 *                   type: integer
 *                   description: Número de configurações atualizadas
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Privilégios administrativos necessários
 */
router.put('/bulk', 
  authenticateToken, 
  requireAdmin, 
  body('configs').isObject().withMessage('Configurações devem ser um objeto'),
  handleValidationErrors, 
  updateMultipleConfigs
);

/**
 * @swagger
 * /api/v1/config/{key}:
 *   put:
 *     summary: Atualizar configuração
 *     description: Atualiza uma configuração específica (requer privilégios administrativos)
 *     tags: [Configurações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Chave da configuração
 *         example: "site_title"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [value]
 *             properties:
 *               value:
 *                 type: string
 *                 description: Novo valor da configuração
 *                 example: "Igreja Renovada"
 *     responses:
 *       200:
 *         description: Configuração atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Config'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Privilégios administrativos necessários
 *       404:
 *         description: Configuração não encontrada
 */
router.put('/:key', 
  authenticateToken, 
  requireAdmin, 
  keyValidation,
  body('value').notEmpty().withMessage('Valor é obrigatório'),
  handleValidationErrors, 
  updateConfig
);

/**
 * @swagger
 * /api/v1/config/{key}:
 *   delete:
 *     summary: Excluir configuração
 *     description: Remove uma configuração do sistema (requer privilégios administrativos)
 *     tags: [Configurações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Chave da configuração
 *     responses:
 *       200:
 *         description: Configuração excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Configuração excluída com sucesso"
 *       400:
 *         description: Chave inválida
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Privilégios administrativos necessários
 *       404:
 *         description: Configuração não encontrada
 */
router.delete('/:key', 
  authenticateToken, 
  requireAdmin, 
  keyValidation,
  handleValidationErrors, 
  deleteConfig
);

export default router;
