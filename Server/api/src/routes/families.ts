import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/families - Listar todas as famílias (pública)
router.get('/', async (req, res) => {
  try {
    const families = await prisma.family.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    res.json(families);
  } catch (error) {
    console.error('Erro ao buscar famílias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/families/:id - Buscar família por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const family = await prisma.family.findUnique({
      where: { id }
    });

    if (!family) {
      return res.status(404).json({ error: 'Família não encontrada' });
    }

    res.json(family);
  } catch (error) {
    console.error('Erro ao buscar família:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/families - Criar nova família (protegida)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, image, members, order } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome da família é obrigatório' });
    }

    const family = await prisma.family.create({
      data: {
        name,
        description,
        image,
        members: JSON.stringify(members || []),
        order: order || 0
      }
    });

    res.status(201).json(family);
  } catch (error) {
    console.error('Erro ao criar família:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/families/:id - Atualizar família (protegida)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, members, order, isActive } = req.body;

    const family = await prisma.family.update({
      where: { id },
      data: {
        name,
        description,
        image,
        members: JSON.stringify(members || []),
        order,
        isActive,
        updatedAt: new Date()
      }
    });

    res.json(family);
  } catch (error: any) {
    console.error('Erro ao atualizar família:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Família não encontrada' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/families/:id - Deletar família (protegida)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.family.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Erro ao deletar família:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Família não encontrada' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;