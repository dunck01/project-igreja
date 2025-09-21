import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/testimonials - Listar todos os depoimentos (pública)
router.get('/', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    res.json(testimonials);
  } catch (error) {
    console.error('Erro ao buscar depoimentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/testimonials/:id - Buscar depoimento por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      return res.status(404).json({ error: 'Depoimento não encontrado' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Erro ao buscar depoimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/testimonials - Criar novo depoimento (protegida)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, message, image, position, order } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Nome e mensagem são obrigatórios' });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        message,
        image,
        position,
        order: order || 0
      }
    });

    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Erro ao criar depoimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/testimonials/:id - Atualizar depoimento (protegida)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, message, image, position, order, isActive } = req.body;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        message,
        image,
        position,
        order,
        isActive,
        updatedAt: new Date()
      }
    });

    res.json(testimonial);
  } catch (error: any) {
    console.error('Erro ao atualizar depoimento:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Depoimento não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/testimonials/:id - Deletar depoimento (protegida)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Erro ao deletar depoimento:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Depoimento não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;