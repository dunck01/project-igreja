import { Router } from 'express';
import { body } from 'express-validator';
import { login, validateToken } from '../controllers/authController';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints para autenticação e validação de tokens
 */

// Validações
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Realizar login
 *     description: Autentica um usuário e retorna um token JWT
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "admin@igreja.com.br"
 *             password: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 id: 1
 *                 email: "admin@igreja.com.br"
 *                 role: "ADMIN"
 *       400:
 *         description: Dados de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               error: "Dados inválidos"
 *               details:
 *                 - field: "email"
 *                   message: "Email inválido"
 *                 - field: "password"
 *                   message: "Senha deve ter pelo menos 6 caracteres"
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Credenciais inválidas"
 *               message: "Email ou senha incorretos"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', loginValidation, handleValidationErrors, login);

/**
 * @swagger
 * /api/v1/auth/validate:
 *   get:
 *     summary: Validar token JWT
 *     description: Verifica se o token JWT fornecido é válido e retorna informações do usuário
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Indica se o token é válido
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID do usuário
 *                       example: 1
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: Email do usuário
 *                       example: "admin@igreja.com.br"
 *                     role:
 *                       type: string
 *                       enum: [USER, ADMIN]
 *                       description: Papel do usuário
 *                       example: "ADMIN"
 *       401:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Token inválido"
 *               message: "Token expirado ou malformado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/validate', validateToken);

export default router;
