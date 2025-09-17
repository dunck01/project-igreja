import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

// Configuração básica do Swagger
const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API da Igreja - Sistema de Eventos e Inscrições',
    version: '1.0.0',
    description: `
      API RESTful para sistema de gestão de eventos e inscrições da igreja.
      
      ## Funcionalidades
      - Autenticação JWT
      - Gestão de eventos
      - Sistema de inscrições
      - Upload de arquivos
      - Configurações administrativas
      
      ## Autenticação
      A API utiliza autenticação JWT Bearer Token. Para acessar endpoints protegidos:
      1. Faça login através do endpoint /auth/login
      2. Use o token retornado no header Authorization: Bearer {token}
      3. Alguns endpoints requerem privilégios administrativos
    `,
    contact: {
      name: 'Suporte API',
      email: 'suporte@igreja.com.br'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: process.env.API_BASE_URL || 'http://localhost:3001',
      description: 'Servidor de desenvolvimento'
    },
    {
      url: 'https://api.igreja.com.br',
      description: 'Servidor de produção'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Digite JWT com Bearer no campo. Exemplo: Bearer {seu_token}'
      }
    },
    schemas: {
      // Schemas de resposta padrão
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indica se a operação foi bem-sucedida'
          },
          message: {
            type: 'string',
            description: 'Mensagem de resposta'
          },
          data: {
            type: 'object',
            description: 'Dados da resposta'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Mensagem de erro'
          },
          message: {
            type: 'string',
            description: 'Detalhes do erro'
          },
          details: {
            type: 'array',
            items: {
              type: 'object'
            },
            description: 'Detalhes específicos do erro (validação, etc.)'
          }
        }
      },
      ValidationError: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Dados inválidos'
          },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  description: 'Campo que contém o erro'
                },
                message: {
                  type: 'string',
                  description: 'Mensagem de erro do campo'
                }
              }
            }
          }
        }
      },
      // Schemas de autenticação
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do usuário',
            example: 'admin@igreja.com.br'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'Senha do usuário (mínimo 6 caracteres)',
            example: 'senha123'
          }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'JWT token para autenticação'
          },
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: 'ID do usuário'
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'Email do usuário'
              },
              role: {
                type: 'string',
                enum: ['USER', 'ADMIN'],
                description: 'Papel do usuário no sistema'
              }
            }
          }
        }
      },
      // Schemas de eventos
      Event: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ObjectId único do evento (MongoDB)',
            example: '507f1f77bcf86cd799439011'
          },
          title: {
            type: 'string',
            description: 'Título do evento'
          },
          description: {
            type: 'string',
            description: 'Descrição detalhada do evento'
          },
          slug: {
            type: 'string',
            description: 'Slug único para URL amigável'
          },
          date: {
            type: 'string',
            format: 'date',
            description: 'Data do evento'
          },
          time: {
            type: 'string',
            description: 'Horário do evento'
          },
          location: {
            type: 'string',
            description: 'Local do evento'
          },
          capacity: {
            type: 'integer',
            minimum: 1,
            description: 'Capacidade máxima de participantes'
          },
          currentRegistrations: {
            type: 'integer',
            minimum: 0,
            description: 'Número atual de inscrições'
          },
          price: {
            type: 'number',
            minimum: 0,
            description: 'Preço do evento'
          },
          isActive: {
            type: 'boolean',
            description: 'Se o evento está ativo'
          },
          isFeatured: {
            type: 'boolean',
            description: 'Se o evento está em destaque'
          },
          category: {
            type: 'string',
            description: 'Categoria do evento'
          },
          image: {
            type: 'string',
            description: 'URL da imagem do evento'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data da última atualização'
          }
        }
      },
      CreateEventRequest: {
        type: 'object',
        required: ['title', 'description', 'date', 'time', 'location', 'category', 'capacity'],
        properties: {
          title: {
            type: 'string',
            maxLength: 200,
            description: 'Título do evento',
            example: 'Culto de Domingo'
          },
          description: {
            type: 'string',
            description: 'Descrição detalhada do evento',
            example: 'Culto dominical com pregação e louvor'
          },
          date: {
            type: 'string',
            format: 'date',
            description: 'Data do evento',
            example: '2024-12-25'
          },
          time: {
            type: 'string',
            description: 'Horário do evento',
            example: '10:00'
          },
          location: {
            type: 'string',
            description: 'Local do evento',
            example: 'Templo Principal'
          },
          category: {
            type: 'string',
            description: 'Categoria do evento',
            example: 'Culto'
          },
          capacity: {
            type: 'integer',
            minimum: 1,
            description: 'Capacidade máxima de participantes',
            example: 100
          },
          price: {
            type: 'number',
            minimum: 0,
            description: 'Preço do evento (opcional)',
            example: 0
          }
        }
      }
    }
  },
  // Configuração de segurança global
  security: [
    {
      bearerAuth: []
    }
  ]
};

// Opções do swagger-jsdoc
const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.ts',        // Todos os arquivos de rotas
    './src/controllers/*.ts',   // Todos os controllers (para schemas adicionais)
    './src/index.ts'           // Arquivo principal
  ]
};

// Gerar especificação do Swagger
export const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Opções da UI do Swagger
export const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #2c5aa0; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .description { margin: 20px 0; }
    .swagger-ui .scheme-container { background: #fafafa; padding: 20px; margin: 20px 0; }
  `,
  customSiteTitle: 'API da Igreja - Documentação',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true
  }
};