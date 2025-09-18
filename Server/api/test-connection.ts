import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com MongoDB Atlas...');
    
    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Contar usuários
    const userCount = await prisma.user.count();
    console.log(`👤 Total de usuários: ${userCount}`);
    
    // Contar eventos
    const eventCount = await prisma.event.count();
    console.log(`📅 Total de eventos: ${eventCount}`);
    
    // Contar configurações
    const configCount = await prisma.siteConfig.count();
    console.log(`⚙️ Total de configurações: ${configCount}`);
    
    // Listar primeiros 3 usuários
    const users = await prisma.user.findMany({ take: 3 });
    console.log('👥 Primeiros usuários:');
    users.forEach((user: any) => {
      console.log(`  - ${user.email} (${user.role})`);
    });
    
    // Listar primeiros 3 eventos
    const events = await prisma.event.findMany({ take: 3 });
    console.log('📝 Primeiros eventos:');
    events.forEach((event: any) => {
      console.log(`  - ${event.title} (${event.slug})`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();