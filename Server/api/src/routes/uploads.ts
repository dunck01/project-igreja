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

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Gerenciamento de arquivos enviados
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Upload:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do upload
 *         filename:
 *           type: string
 *           description: Nome original do arquivo
 *         savedName:
 *           type: string
 *           description: Nome salvo no sistema
 *         mimetype:
 *           type: string
 *           description: Tipo MIME do arquivo
 *         size:
 *           type: integer
 *           description: Tamanho do arquivo em bytes
 *         url:
 *           type: string
 *           description: URL de acesso ao arquivo
 *         isUsed:
 *           type: boolean
 *           description: Se o arquivo está sendo usado
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *           description: Data/hora do upload
 */

// Validações
const idValidation = [
  param('id')
    .isUUID()
    .withMessage('ID inválido')
];

/**
 * @swagger
 * /api/v1/uploads:
 *   post:
 *     summary: Fazer upload de arquivo
 *     description: Envia um arquivo para o servidor (requer privilégios administrativos)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo a ser enviado
 *           encoding:
 *             file:
 *               contentType: image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
 *     responses:
 *       201:
 *         description: Arquivo enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Upload'
 *       400:
 *         description: Arquivo inválido ou muito grande
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               file_too_large:
 *                 value:
 *                   error: "Arquivo muito grande"
 *                   message: "O arquivo deve ter no máximo 10MB"
 *               invalid_type:
 *                 value:
 *                   error: "Tipo de arquivo não permitido"
 *                   message: "Apenas imagens, PDFs e documentos são permitidos"
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
  uploadSingle, 
  uploadFile
);

/**
 * @swagger
 * /api/v1/uploads:
 *   get:
 *     summary: Listar uploads
 *     description: Retorna lista paginada de todos os uploads (requer privilégios administrativos)
 *     tags: [Uploads]
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
 *         name: mimetype
 *         schema:
 *           type: string
 *         description: Filtrar por tipo MIME
 *         example: "image/jpeg"
 *       - in: query
 *         name: used
 *         schema:
 *           type: boolean
 *         description: Filtrar por arquivos usados/não usados
 *     responses:
 *       200:
 *         description: Lista de uploads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploads:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Upload'
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
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authenticateToken, requireAdmin, getUploads);

/**
 * @swagger
 * /api/v1/uploads/{id}:
 *   delete:
 *     summary: Excluir upload
 *     description: Remove um arquivo do sistema (requer privilégios administrativos)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do upload
 *     responses:
 *       200:
 *         description: Upload excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload excluído com sucesso"
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
 *         description: Upload não encontrado
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
  deleteUpload
);

/**
 * @swagger
 * /api/v1/uploads/{id}/used:
 *   patch:
 *     summary: Marcar upload como usado
 *     description: Marca um arquivo como sendo usado no sistema (requer privilégios administrativos)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do upload
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               used:
 *                 type: boolean
 *                 default: true
 *                 description: Se o arquivo está sendo usado
 *               usedIn:
 *                 type: string
 *                 description: Onde o arquivo está sendo usado
 *                 example: "evento_id_123"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Upload'
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
 *         description: Upload não encontrado
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
router.patch('/:id/used', 
  authenticateToken, 
  requireAdmin, 
  idValidation,
  handleValidationErrors, 
  markAsUsed
);

export default router;
