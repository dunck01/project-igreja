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

/**
 * @swagger
 * tags:
 *   name: Eventos
 *   description: Gerenciamento de eventos da igreja
 */

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
    .isMongoId()
    .withMessage('ObjectId inválido')
];

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Listar todos os eventos
 *     description: Retorna uma lista de todos os eventos ativos disponíveis para inscrição
 *     tags: [Eventos]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de itens por página
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *     responses:
 *       200:
 *         description: Lista de eventos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getEvents);

/**
 * @swagger
 * /api/v1/events/slug/{slug}:
 *   get:
 *     summary: Buscar evento por slug
 *     description: Retorna um evento específico baseado em seu slug único
 *     tags: [Eventos]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug único do evento
 *         example: "culto-domingo-25-dezembro"
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Evento não encontrado"
 *               message: "Não foi possível encontrar um evento com este slug"
 *       400:
 *         description: Slug inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/slug/:slug', slugValidation, handleValidationErrors, getEventBySlug);

/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     summary: Criar novo evento
 *     description: Cria um novo evento (requer privilégios administrativos)
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventRequest'
 *           example:
 *             title: "Culto de Domingo"
 *             description: "Culto dominical com pregação e louvor"
 *             date: "2024-12-25"
 *             time: "10:00"
 *             location: "Templo Principal"
 *             category: "Culto"
 *             capacity: 100
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Dados de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token de autenticação necessário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Privilégios administrativos necessários
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  eventValidation, 
  handleValidationErrors, 
  createEvent
);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   put:
 *     summary: Atualizar evento
 *     description: Atualiza um evento existente (requer privilégios administrativos)
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ObjectId único do evento (MongoDB)
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventRequest'
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Dados inválidos ou ID malformado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token de autenticação necessário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Privilégios administrativos necessários
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  handleValidationErrors, 
  updateEvent
);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   delete:
 *     summary: Excluir evento
 *     description: Remove um evento do sistema (requer privilégios administrativos)
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do evento
 *     responses:
 *       200:
 *         description: Evento excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Evento excluído com sucesso"
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token de autenticação necessário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Privilégios administrativos necessários
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  handleValidationErrors, 
  deleteEvent
);

/**
 * @swagger
 * /api/v1/events/{id}/registrations:
 *   get:
 *     summary: Listar inscrições do evento
 *     description: Retorna todas as inscrições de um evento específico (requer privilégios administrativos)
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único do evento
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 *         description: Filtrar por status da inscrição
 *     responses:
 *       200:
 *         description: Lista de inscrições retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 registrations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       participantName:
 *                         type: string
 *                       participantEmail:
 *                         type: string
 *                         format: email
 *                       participantPhone:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [PENDING, CONFIRMED, CANCELLED]
 *                       registeredAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token de autenticação necessário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Privilégios administrativos necessários
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/registrations', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  handleValidationErrors, 
  getEventRegistrations
);

export default router;
