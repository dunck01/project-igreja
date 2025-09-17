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

/**
 * @swagger
 * tags:
 *   name: Inscrições
 *   description: Gerenciamento de inscrições em eventos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Registration:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da inscrição
 *         eventId:
 *           type: string
 *           format: uuid
 *           description: ID do evento
 *         name:
 *           type: string
 *           description: Nome do participante
 *         email:
 *           type: string
 *           format: email
 *           description: Email do participante
 *         phone:
 *           type: string
 *           description: Telefone do participante
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, WAITLIST]
 *           description: Status da inscrição
 *         registeredAt:
 *           type: string
 *           format: date-time
 *           description: Data/hora da inscrição
 *     CreateRegistrationRequest:
 *       type: object
 *       required: [eventId, name, email, phone]
 *       properties:
 *         eventId:
 *           type: string
 *           format: uuid
 *           description: ID do evento
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Nome completo do participante
 *           example: "João Silva"
 *         email:
 *           type: string
 *           format: email
 *           description: Email do participante
 *           example: "joao.silva@email.com"
 *         phone:
 *           type: string
 *           pattern: "^\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}$"
 *           description: Telefone no formato (XX) XXXXX-XXXX
 *           example: "(11) 99999-9999"
 */

// Validações
const registrationValidation = [
  body('eventId')
    .isMongoId()
    .withMessage('ObjectId do evento inválido'),
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
    .isMongoId()
    .withMessage('ObjectId inválido')
];

/**
 * @swagger
 * /api/v1/registrations:
 *   post:
 *     summary: Criar nova inscrição
 *     description: Registra um participante em um evento específico
 *     tags: [Inscrições]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRegistrationRequest'
 *     responses:
 *       201:
 *         description: Inscrição criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflito (evento lotado, já inscrito, etc.)
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
router.post('/', registrationValidation, handleValidationErrors, createRegistration);

/**
 * @swagger
 * /api/v1/registrations:
 *   get:
 *     summary: Listar todas as inscrições
 *     description: Retorna lista paginada de todas as inscrições (requer privilégios administrativos)
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
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
 *         description: Itens por página
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por evento específico
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, WAITLIST]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de inscrições
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 registrations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Registration'
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
 */
router.get('/', authenticateToken, requireAdmin, getRegistrations);

/**
 * @swagger
 * /api/v1/registrations/export:
 *   get:
 *     summary: Exportar inscrições
 *     description: Exporta inscrições em formato CSV ou Excel (requer privilégios administrativos)
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, excel]
 *           default: csv
 *         description: Formato do arquivo de exportação
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por evento específico
 *     responses:
 *       200:
 *         description: Arquivo de exportação
 *         content:
 *           application/csv:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Privilégios administrativos necessários
 */
router.get('/export', authenticateToken, requireAdmin, exportRegistrations);

/**
 * @swagger
 * /api/v1/registrations/{id}:
 *   get:
 *     summary: Buscar inscrição por ID
 *     description: Retorna detalhes de uma inscrição específica (requer privilégios administrativos)
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da inscrição
 *     responses:
 *       200:
 *         description: Inscrição encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Privilégios administrativos necessários
 *       404:
 *         description: Inscrição não encontrada
 */
router.get('/:id', authenticateToken, requireAdmin, idValidation, handleValidationErrors, getRegistrationById);

/**
 * @swagger
 * /api/v1/registrations/{id}/status:
 *   put:
 *     summary: Atualizar status da inscrição
 *     description: Atualiza o status de uma inscrição (requer privilégios administrativos)
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da inscrição
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED, WAITLIST]
 *                 description: Novo status da inscrição
 *                 example: "CONFIRMED"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
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
 *       404:
 *         description: Inscrição não encontrada
 */
router.put('/:id/status', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  statusValidation,
  handleValidationErrors, 
  updateRegistrationStatus
);

/**
 * @swagger
 * /api/v1/registrations/{id}:
 *   delete:
 *     summary: Excluir inscrição
 *     description: Remove uma inscrição do sistema (requer privilégios administrativos)
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da inscrição
 *     responses:
 *       200:
 *         description: Inscrição excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Inscrição excluída com sucesso"
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Privilégios administrativos necessários
 *       404:
 *         description: Inscrição não encontrada
 */
router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  handleValidationErrors, 
  deleteRegistration
);

export default router;
