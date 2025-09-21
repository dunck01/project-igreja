import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/services - Listar todos os cultos/serviços
router.get('/', async (req, res) => {
  try {
    const { 
      dayOfWeek, 
      isActive, 
      isFeatured, 
      search, 
      page = 1, 
      limit = 50,
      sortBy = 'dayOfWeek',
      sortOrder = 'asc'
    } = req.query;

    const where: any = {};

    if (dayOfWeek !== undefined && dayOfWeek !== 'all') {
      where.dayOfWeek = parseInt(dayOfWeek as string);
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { pastor: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { [sortBy as string]: sortOrder },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.service.count({ where });

    res.json(services);
  } catch (error) {
    console.error('Erro ao buscar cultos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/v1/services/:id - Buscar culto específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      return res.status(404).json({ error: 'Culto não encontrado' });
    }

    res.json(service);
  } catch (error) {
    console.error('Erro ao buscar culto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/v1/services - Criar novo culto
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      dayOfWeek,
      time,
      duration,
      location,
      address,
      pastor,
      ministryLeader,
      capacity,
      isRecurring,
      isActive,
      isFeatured,
      contactPhone,
      contactEmail,
      notes,
      specialInstructions
    } = req.body;

    if (!name || !time || !pastor || !location) {
      return res.status(400).json({ 
        error: 'Nome, horário, pastor e local são obrigatórios' 
      });
    }

    // Validar dia da semana (0-6)
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return res.status(400).json({ 
        error: 'Dia da semana deve ser entre 0 (domingo) e 6 (sábado)' 
      });
    }

    // Validar formato de horário
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({ 
        error: 'Formato de horário inválido. Use HH:MM' 
      });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        dayOfWeek: parseInt(dayOfWeek),
        time,
        duration: parseInt(duration) || 120,
        location,
        address,
        pastor,
        ministryLeader,
        capacity: capacity ? parseInt(capacity) : null,
        isRecurring: Boolean(isRecurring),
        isActive: Boolean(isActive),
        isFeatured: Boolean(isFeatured),
        contactPhone,
        contactEmail,
        notes,
        specialInstructions,
        attendanceCount: 0
      }
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Erro ao criar culto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/v1/services/:id - Atualizar culto
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      dayOfWeek,
      time,
      duration,
      location,
      address,
      pastor,
      ministryLeader,
      capacity,
      isRecurring,
      isActive,
      isFeatured,
      contactPhone,
      contactEmail,
      notes,
      specialInstructions
    } = req.body;

    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return res.status(404).json({ error: 'Culto não encontrado' });
    }

    // Validações
    if (dayOfWeek !== undefined && (dayOfWeek < 0 || dayOfWeek > 6)) {
      return res.status(400).json({ 
        error: 'Dia da semana deve ser entre 0 (domingo) e 6 (sábado)' 
      });
    }

    if (time) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(time)) {
        return res.status(400).json({ 
          error: 'Formato de horário inválido. Use HH:MM' 
        });
      }
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(dayOfWeek !== undefined && { dayOfWeek: parseInt(dayOfWeek) }),
        ...(time && { time }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
        ...(location && { location }),
        ...(address !== undefined && { address }),
        ...(pastor && { pastor }),
        ...(ministryLeader !== undefined && { ministryLeader }),
        ...(capacity !== undefined && { capacity: capacity ? parseInt(capacity) : null }),
        ...(isRecurring !== undefined && { isRecurring: Boolean(isRecurring) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(notes !== undefined && { notes }),
        ...(specialInstructions !== undefined && { specialInstructions }),
        updatedAt: new Date()
      }
    });

    res.json(updatedService);
  } catch (error) {
    console.error('Erro ao atualizar culto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/v1/services/:id - Deletar culto
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return res.status(404).json({ error: 'Culto não encontrado' });
    }

    await prisma.service.delete({
      where: { id }
    });

    res.json({ message: 'Culto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar culto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/v1/services/batch - Deletar múltiplos cultos
router.delete('/batch', authenticateToken, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Lista de IDs é obrigatória' });
    }

    const result = await prisma.service.deleteMany({
      where: { id: { in: ids } }
    });

    res.json({ 
      message: `${result.count} culto(s) deletado(s) com sucesso`,
      deleted: result.count
    });
  } catch (error) {
    console.error('Erro ao deletar cultos em lote:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/v1/services/schedule/week - Horários da semana
router.get('/schedule/week', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { 
        isActive: true,
        isRecurring: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { time: 'asc' }
      ]
    });

    // Agrupar por dia da semana
    const weekSchedule = Array.from({ length: 7 }, (_, dayIndex) => ({
      dayOfWeek: dayIndex,
      services: services.filter((service: any) => service.dayOfWeek === dayIndex)
    }));

    res.json(weekSchedule);
  } catch (error) {
    console.error('Erro ao buscar horários da semana:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/v1/services/featured - Cultos em destaque
router.get('/featured', async (req, res) => {
  try {
    const featuredServices = await prisma.service.findMany({
      where: { 
        isActive: true,
        isFeatured: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { time: 'asc' }
      ]
    });

    res.json(featuredServices);
  } catch (error) {
    console.error('Erro ao buscar cultos em destaque:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/v1/services/:id/attendance - Atualizar frequência
router.put('/:id/attendance', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { attendanceCount } = req.body;

    if (attendanceCount === undefined || attendanceCount < 0) {
      return res.status(400).json({ 
        error: 'Número de frequência é obrigatório e deve ser positivo' 
      });
    }

    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return res.status(404).json({ error: 'Culto não encontrado' });
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: { 
        attendanceCount: parseInt(attendanceCount),
        updatedAt: new Date()
      }
    });

    res.json(updatedService);
  } catch (error) {
    console.error('Erro ao atualizar frequência:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/v1/services/stats - Estatísticas dos cultos
router.get('/stats', async (req, res) => {
  try {
    const total = await prisma.service.count();
    const active = await prisma.service.count({ where: { isActive: true } });
    const featured = await prisma.service.count({ where: { isFeatured: true } });
    
    const byDay = await prisma.service.groupBy({
      by: ['dayOfWeek'],
      where: { isActive: true },
      _count: {
        dayOfWeek: true
      }
    });

    const totalAttendance = await prisma.service.aggregate({
      where: { isActive: true },
      _sum: {
        attendanceCount: true
      }
    });

    res.json({
      total,
      active,
      featured,
      totalAttendance: totalAttendance._sum.attendanceCount || 0,
      byDay: byDay.map((item: any) => ({
        dayOfWeek: item.dayOfWeek,
        count: item._count.dayOfWeek
      }))
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;