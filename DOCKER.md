# Docker Scripts

## Comandos básicos

### Iniciar todos os serviços
```bash
docker-compose up -d
```

### Parar todos os serviços
```bash
docker-compose down
```

### Reconstruir e iniciar
```bash
docker-compose up --build -d
```

### Ver logs
```bash
# Todos os serviços
docker-compose logs -f

# Apenas o backend
docker-compose logs -f backend

# Apenas o frontend
docker-compose logs -f frontend
```

### Executar comandos no container

#### Seed do banco (MongoDB)
```bash
docker-compose exec backend npm run db:seed
```

#### Verificar conexão MongoDB
```bash
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

#### Acessar bash do container
```bash
docker-compose exec backend sh
```

## URLs dos serviços

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Mongo Express (DB Admin)**: http://localhost:8081
- **MongoDB**: localhost:27017

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
# Database - Opção 1: MongoDB Atlas (cloud) - recomendado para produção
DATABASE_URL=mongodb+srv://dunckf_db_user:YfBdMb1hnQHODvrJ@obpc-igreja.q5oifuj.mongodb.net/obpc-gyn?retryWrites=true&w=majority

# Database - Opção 2: MongoDB local (para desenvolvimento)
# DATABASE_URL=mongodb://admin:senha123@localhost:27017/igreja_db?authSource=admin

# JWT
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui

# API
PORT=3001
NODE_ENV=development
```

## Troubleshooting

### Limpar volumes e reconstruir
```bash
docker-compose down -v
docker-compose up --build -d
```

### Verificar status dos containers
```bash
docker-compose ps
```