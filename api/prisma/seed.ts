import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Import the ConfigType enum from Prisma client
import { ConfigType } from '@prisma/client';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin padrão
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@igreja.com' },
    update: {},
    create: {
      email: 'admin@igreja.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  console.log('👤 Usuário admin criado:', admin.email);

  // Configurações padrão do site
  const defaultConfigs = [
    // Cores principais
    { key: 'primary_color', value: '#1e40af', type: ConfigType.COLOR, category: 'theme', description: 'Cor principal do site' },
    { key: 'secondary_color', value: '#64748b', type: ConfigType.COLOR, category: 'theme', description: 'Cor secundária do site' },
    { key: 'accent_color', value: '#f59e0b', type: ConfigType.COLOR, category: 'theme', description: 'Cor de destaque' },
    
    // Informações da igreja
    { key: 'church_name', value: 'Igreja Evangélica', type: ConfigType.TEXT, category: 'general', description: 'Nome da igreja' },
    { key: 'church_description', value: 'Uma igreja comprometida com o evangelho', type: ConfigType.TEXT, category: 'general', description: 'Descrição da igreja' },
    { key: 'church_address', value: 'Rua das Flores, 123 - Centro', type: ConfigType.TEXT, category: 'contact', description: 'Endereço da igreja' },
    { key: 'church_phone', value: '(11) 99999-9999', type: ConfigType.TEXT, category: 'contact', description: 'Telefone da igreja' },
    { key: 'church_email', value: 'contato@igreja.com', type: ConfigType.TEXT, category: 'contact', description: 'E-mail da igreja' },
    
    // Redes sociais
    { key: 'facebook_url', value: 'https://facebook.com/igreja', type: ConfigType.URL, category: 'social', description: 'URL do Facebook' },
    { key: 'instagram_url', value: 'https://instagram.com/igreja', type: ConfigType.URL, category: 'social', description: 'URL do Instagram' },
    { key: 'youtube_url', value: 'https://youtube.com/igreja', type: ConfigType.URL, category: 'social', description: 'URL do YouTube' },
    
    // Hero section
    { key: 'hero_title', value: 'Bem-vindos à nossa Igreja', type: ConfigType.TEXT, category: 'hero', description: 'Título principal do hero' },
    { key: 'hero_subtitle', value: 'Uma comunidade de fé, esperança e amor', type: ConfigType.TEXT, category: 'hero', description: 'Subtítulo do hero' },
    { key: 'hero_image', value: '/images/hero-default.jpg', type: ConfigType.IMAGE, category: 'hero', description: 'Imagem de fundo do hero' },
    
    // Configurações gerais
    { key: 'site_logo', value: '/images/logo.png', type: ConfigType.IMAGE, category: 'general', description: 'Logo do site' },
    { key: 'enable_registrations', value: 'true', type: ConfigType.BOOLEAN, category: 'features', description: 'Habilitar inscrições em eventos' },
    { key: 'max_registrations_per_user', value: '5', type: ConfigType.NUMBER, category: 'features', description: 'Máximo de inscrições por usuário' },
  ];

  for (const config of defaultConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }

  console.log('⚙️ Configurações padrão criadas');

  // Eventos de exemplo
  const events = [
    {
      title: 'Conferência de Avivamento 2024',
      slug: 'conferencia-avivamento-2024',
      description: 'Três noites especiais com pregadores convidados e ministração especial. Uma oportunidade única de crescimento espiritual e renovação da fé.',
      shortDescription: 'Três noites especiais de avivamento',
      date: new Date('2024-12-15T19:30:00'),
      time: '19:30',
      location: 'Templo Principal',
      category: 'Conferência',
      capacity: 200,
      price: 0,
      isActive: true,
      isFeatured: true,
      tags: JSON.stringify(['avivamento', 'conferência', 'pregação']),
    },
    {
      title: 'Retiro de Jovens',
      slug: 'retiro-jovens-2024',
      description: 'Um final de semana especial para os jovens da igreja, com atividades, ministração e muito companheirismo.',
      shortDescription: 'Final de semana especial para jovens',
      date: new Date('2024-11-20T08:00:00'),
      time: '08:00',
      location: 'Chácara Betânia',
      category: 'Retiro',
      capacity: 50,
      price: 150,
      isActive: true,
      isFeatured: false,
      tags: JSON.stringify(['jovens', 'retiro', 'companheirismo']),
    },
    {
      title: 'Jantar Missionário',
      slug: 'jantar-missionario-2024',
      description: 'Noite especial de apoio às missões, com jantar e apresentação dos trabalhos missionários.',
      shortDescription: 'Apoio às missões com jantar especial',
      date: new Date('2024-10-25T19:00:00'),
      time: '19:00',
      location: 'Salão Social',
      category: 'Missões',
      capacity: 100,
      price: 30,
      isActive: true,
      isFeatured: false,
      tags: JSON.stringify(['missões', 'jantar', 'apoio']),
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }

  console.log('📅 Eventos de exemplo criados');

  // Famílias de exemplo
  const families = [
    {
      name: 'Família Silva',
      description: 'Uma família dedicada ao serviço cristão há mais de 20 anos',
      members: JSON.stringify([
        { name: 'João Silva', age: 45, role: 'Pai' },
        { name: 'Maria Silva', age: 42, role: 'Mãe' },
        { name: 'Pedro Silva', age: 18, role: 'Filho' },
        { name: 'Ana Silva', age: 15, role: 'Filha' },
      ]),
      isActive: true,
      order: 1,
    },
    {
      name: 'Família Santos',
      description: 'Missionários que dedicaram suas vidas ao evangelho',
      members: JSON.stringify([
        { name: 'Carlos Santos', age: 50, role: 'Pai' },
        { name: 'Lucia Santos', age: 48, role: 'Mãe' },
        { name: 'Daniel Santos', age: 22, role: 'Filho' },
      ]),
      isActive: true,
      order: 2,
    },
  ];

  for (const family of families) {
    await prisma.family.create({
      data: family,
    });
  }

  console.log('👨‍👩‍👧‍👦 Famílias de exemplo criadas');

  // Testemunhos de exemplo
  const testimonials = [
    {
      name: 'Maria da Silva',
      message: 'Esta igreja transformou minha vida. Encontrei uma família e um propósito maior.',
      position: 'Membro há 10 anos',
      isActive: true,
      order: 1,
    },
    {
      name: 'João Santos',
      message: 'O amor e cuidado que recebo aqui são incomparáveis. Gratidão a Deus por esta comunidade.',
      position: 'Líder de célula',
      isActive: true,
      order: 2,
    },
    {
      name: 'Ana Paula',
      message: 'Aqui aprendi o verdadeiro significado de comunhão e serviço ao próximo.',
      position: 'Voluntária',
      isActive: true,
      order: 3,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }

  console.log('💬 Testemunhos de exemplo criados');

  console.log('✅ Seed completado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
