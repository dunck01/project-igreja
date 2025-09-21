import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'media');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/avi', 'video/quicktime',
      'audio/mp3', 'audio/wav', 'audio/mpeg',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
});

// Função para determinar o tipo de mídia
const getMediaType = (mimetype: string): 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' => {
  if (mimetype.startsWith('image/')) return 'IMAGE';
  if (mimetype.startsWith('video/')) return 'VIDEO';
  if (mimetype.startsWith('audio/')) return 'AUDIO';
  return 'DOCUMENT';
};

// Função para criar thumbnail
const createThumbnail = async (filePath: string, type: string): Promise<string | null> => {
  // Implementação simplificada - pode ser expandida com sharp ou ffmpeg
  if (type === 'IMAGE') {
    return filePath; // Para imagens, usar a própria imagem
  }
  return null;
};

// GET /api/v1/media - Listar todos os itens de mídia
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      category, 
      search, 
      page = 1, 
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const where: any = { isActive: true };

    if (type && type !== 'all') {
      where.type = type;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const mediaItems = await prisma.mediaItem.findMany({
      where,
      orderBy: { [sortBy as string]: sortOrder },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.mediaItem.count({ where });

    res.json(mediaItems);
  } catch (error) {
    console.error('Erro ao buscar itens de mídia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/v1/media/:id - Buscar item específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id }
    });

    if (!mediaItem) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    // Incrementar contador de visualizações
    await prisma.mediaItem.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    res.json(mediaItem);
  } catch (error) {
    console.error('Erro ao buscar item de mídia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/v1/uploads/multiple - Upload múltiplo de arquivos
router.post('/uploads/multiple', authenticateToken, upload.array('files', 20), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { category } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const mediaItems = [];

    for (const file of files) {
      const mediaType = getMediaType(file.mimetype);
      const relativePath = `/uploads/media/${file.filename}`;
      const thumbnail = await createThumbnail(file.path, mediaType);

      const mediaItem = await prisma.mediaItem.create({
        data: {
          title: file.originalname.split('.')[0],
          url: relativePath,
          thumbnail: thumbnail ? `/uploads/media/${path.basename(thumbnail)}` : null,
          type: mediaType,
          category,
          isFeatured: false,
          isActive: true,
          viewCount: 0
        }
      });

      mediaItems.push(mediaItem);
    }

    res.status(201).json({ 
      message: `${mediaItems.length} arquivo(s) enviado(s) com sucesso`,
      items: mediaItems 
    });
  } catch (error) {
    console.error('Erro no upload múltiplo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/v1/media - Criar novo item de mídia
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { title, description, category, isFeatured = false } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Arquivo é obrigatório' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    const mediaType = getMediaType(file.mimetype);
    const relativePath = `/uploads/media/${file.filename}`;
    const thumbnail = await createThumbnail(file.path, mediaType);

    const mediaItem = await prisma.mediaItem.create({
      data: {
        title,
        description,
        url: relativePath,
        thumbnail: thumbnail ? `/uploads/media/${path.basename(thumbnail)}` : null,
        type: mediaType,
        category,
        isFeatured: Boolean(isFeatured),
        isActive: true,
        viewCount: 0
      }
    });

    res.status(201).json(mediaItem);
  } catch (error) {
    console.error('Erro ao criar item de mídia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/v1/media/:id - Atualizar item de mídia
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, isFeatured, isActive } = req.body;

    const existingItem = await prisma.mediaItem.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    const updatedItem = await prisma.mediaItem.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        updatedAt: new Date()
      }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Erro ao atualizar item de mídia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/v1/media/:id - Deletar item de mídia
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await prisma.mediaItem.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    // Deletar arquivo físico
    if (existingItem.url) {
      const filePath = path.join(process.cwd(), 'uploads', 'media', path.basename(existingItem.url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Deletar thumbnail se existir
    if (existingItem.thumbnail) {
      const thumbnailPath = path.join(process.cwd(), 'uploads', 'media', path.basename(existingItem.thumbnail));
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    await prisma.mediaItem.delete({
      where: { id }
    });

    res.json({ message: 'Item deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar item de mídia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/v1/media/batch - Deletar múltiplos itens
router.delete('/batch', authenticateToken, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Lista de IDs é obrigatória' });
    }

    const existingItems = await prisma.mediaItem.findMany({
      where: { id: { in: ids } }
    });

    // Deletar arquivos físicos
    for (const item of existingItems) {
      if (item.url) {
        const filePath = path.join(process.cwd(), 'uploads', 'media', path.basename(item.url));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      if (item.thumbnail) {
        const thumbnailPath = path.join(process.cwd(), 'uploads', 'media', path.basename(item.thumbnail));
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      }
    }

    const result = await prisma.mediaItem.deleteMany({
      where: { id: { in: ids } }
    });

    res.json({ 
      message: `${result.count} item(s) deletado(s) com sucesso`,
      deleted: result.count
    });
  } catch (error) {
    console.error('Erro ao deletar itens em lote:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/v1/media/categories - Listar categorias disponíveis
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.mediaItem.groupBy({
      by: ['category'],
      where: {
        isActive: true,
        category: { not: null }
      },
      _count: {
        category: true
      }
    });

    const formattedCategories = categories.map((cat: any) => ({
      name: cat.category,
      count: cat._count.category
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/v1/media/stats - Estatísticas da galeria
router.get('/stats', async (req, res) => {
  try {
    const stats = await prisma.mediaItem.groupBy({
      by: ['type'],
      where: { isActive: true },
      _count: {
        type: true
      },
      _sum: {
        viewCount: true
      }
    });

    const total = await prisma.mediaItem.count({
      where: { isActive: true }
    });

    const totalViews = await prisma.mediaItem.aggregate({
      where: { isActive: true },
      _sum: {
        viewCount: true
      }
    });

    res.json({
      total,
      totalViews: totalViews._sum.viewCount || 0,
      byType: stats.map((stat: any) => ({
        type: stat.type,
        count: stat._count.type,
        views: stat._sum.viewCount || 0
      }))
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;