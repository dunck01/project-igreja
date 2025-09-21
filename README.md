# Sistema de Inscrição para Eventos - Igreja

Este projeto implementa um sistema completo de inscrição para eventos da igreja, desenvolvido com **TypeScript** e seguindo as melhores práticas de desenvolvimento full-stack.

## 🏗️ Arquitetura e Estrutura

### Estrutura de Pastas Organizada

```
Client/                   # Frontend React + TypeScript
├── src/
│   ├── components/
│   │   ├── layout/           # Componentes de layout (Header, Footer, Hero)
│   │   ├── pages/            # Componentes de página (About, Services, Events, etc.)
│   │   ├── registration/     # Sistema de inscrição
│   │   │   ├── RegistrationForm.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── RegistrationConfirmation.tsx
│   │   └── admin/            # Componentes administrativos
│   ├── hooks/                # Custom hooks
│   │   └── useEventRegistration.ts
│   ├── types/                # Definições TypeScript
│   │   └── index.ts
│   ├── utils/                # Utilitários e helpers
│   │   └── index.ts
│   ├── constants/            # Constantes e configurações
│   │   └── index.ts
│   ├── services/             # Serviços para API
│   │   ├── authService.ts
│   │   ├── eventService.ts
│   │   └── uploadService.ts
│   ├── styles/               # Estilos organizados
│   │   └── variables.css     # Variáveis CSS customizadas
│   └── contexts/             # React Contexts
│       └── AuthContext.tsx
├── Dockerfile
└── nginx.conf

Server/                   # Backend Node.js + Express
├── api/
│   ├── src/
│   │   ├── controllers/      # Controladores da API
│   │   ├── routes/           # Rotas da API
│   │   ├── services/         # Lógica de negócio
│   │   ├── middleware/       # Middlewares
│   │   └── config/           # Configurações
│   ├── prisma/               # Schema e migrations do banco
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── package.json
│   └── Dockerfile
```

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** com **TypeScript**
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones
- **React Router** - Roteamento

### Backend
- **Node.js** com **Express**
- **TypeScript**
- **Prisma** - ORM para banco de dados
- **MongoDB** - Banco de dados
- **JWT** - Autenticação
- **Cloudinary** - Upload de imagens

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **Nginx** - Servidor web para produção

## 📂 Como Executar

### Desenvolvimento Local

1. **Instalar dependências:**
```bash
# Frontend
cd Client
npm install

# Backend
cd ../Server/api
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
# Server/api/.env
DATABASE_URL="sua-url-do-mongodb"
JWT_SECRET="seu-jwt-secret"
CLOUDINARY_CLOUD_NAME="seu-cloudinary-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"
```

3. **Executar em desenvolvimento:**
```bash
# Backend (porta 3001)
cd Server/api
npm run dev

# Frontend (porta 3000)
cd Client
npm run dev
```

### Usando Docker

```bash
# Executar toda a aplicação
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar aplicação
docker-compose down
```

## 🔧 Scripts Disponíveis

### Frontend (Client/)
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Linting do código

### Backend (Server/api/)
- `npm run dev` - Servidor de desenvolvimento com nodemon
- `npm run build` - Compilar TypeScript
- `npm run start` - Executar versão compilada
- `npm run db:generate` - Gerar Prisma Client
- `npm run db:push` - Sincronizar schema com DB
- `npm run db:studio` - Abrir Prisma Studio
- `npm run db:seed` - Popular banco com dados iniciais

## 📋 Funcionalidades

### Usuários
- ✅ Visualização de eventos
- ✅ Inscrição em eventos
- ✅ Confirmação de inscrição
- ✅ Páginas institucionais (Sobre, Serviços, Contato)

### Administradores
- ✅ Dashboard administrativo
- ✅ Gestão de eventos
- ✅ Gestão de inscrições
- ✅ Upload de imagens
- ✅ Configurações do site
- ✅ Sistema de autenticação

## 🌐 Endpoints da API

### Autenticação
- `POST /api/v1/auth/login` - Login de administrador
- `POST /api/v1/auth/refresh` - Renovar token

### Eventos
- `GET /api/v1/events` - Listar eventos
- `POST /api/v1/events` - Criar evento
- `PUT /api/v1/events/:id` - Atualizar evento
- `DELETE /api/v1/events/:id` - Deletar evento

### Inscrições
- `POST /api/v1/registrations` - Criar inscrição
- `GET /api/v1/registrations` - Listar inscrições
- `PUT /api/v1/registrations/:id` - Atualizar inscrição

### Uploads
- `POST /api/v1/uploads` - Upload de arquivos
- `GET /api/v1/uploads` - Listar uploads
- `DELETE /api/v1/uploads/:id` - Deletar upload

## 📄 Licença

Este projeto está sob a licença MIT.