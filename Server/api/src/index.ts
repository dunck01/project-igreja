import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

// Importar configuração do Swagger
import { swaggerSpec, swaggerUiOptions } from './config/swagger';

// Importar rotas
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import registrationRoutes from './routes/registrations';
import configRoutes from './routes/config';
import uploadRoutes from './routes/uploads';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Middleware de segurança
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas solicitações deste IP, tente novamente em 15 minutos.'
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compressão
app.use(compression());

// Logging
app.use(morgan('combined'));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Endpoint para o JSON da especificação OpenAPI
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Rotas da API
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/events`, eventRoutes);
app.use(`${API_PREFIX}/registrations`, registrationRoutes);
app.use(`${API_PREFIX}/config`, configRoutes);
app.use(`${API_PREFIX}/uploads`, uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API da Igreja - Sistema de Eventos e Inscrições',
    version: '1.0.0',
    docs: `${req.protocol}://${req.get('host')}/docs`,
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      events: `${API_PREFIX}/events`,
      registrations: `${API_PREFIX}/registrations`,
      config: `${API_PREFIX}/config`,
      uploads: `${API_PREFIX}/uploads`
    }
  });
});

// Middleware de tratamento de erros
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', error);
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: 'Arquivo muito grande' });
    return;
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    res.status(400).json({ error: 'Tipo de arquivo não permitido' });
    return;
  }
  
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 API disponível em: http://localhost:${PORT}${API_PREFIX}`);
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/docs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
});

export default app;
