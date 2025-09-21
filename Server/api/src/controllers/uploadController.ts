import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { cloudinaryService } from '../services/cloudinaryService';

const prisma = new PrismaClient();

export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Nenhum arquivo enviado' });
      return;
    }

    const { category = 'general', configType } = req.body;
    const file = req.file;

    let cloudinaryResult;

    // Escolher método de upload baseado na categoria
    if (category === 'config' && configType) {
      cloudinaryResult = await cloudinaryService.uploadConfigImage(file.buffer, configType);
    } else if (category === 'gallery') {
      cloudinaryResult = await cloudinaryService.uploadGalleryImage(file.buffer, 'general');
    } else if (file.mimetype.startsWith('image/')) {
      cloudinaryResult = await cloudinaryService.uploadImage(file.buffer, {
        folder: `igreja-uploads/${category}`,
        tags: [category],
      });
    } else {
      cloudinaryResult = await cloudinaryService.uploadFromBuffer(file.buffer, {
        folder: `igreja-uploads/${category}`,
        tags: [category],
      });
    }

    // Salvar no banco
    const upload = await prisma.upload.create({
      data: {
        filename: cloudinaryResult.public_id,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: cloudinaryResult.bytes,
        path: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
        category,
        isUsed: false,
        cloudinaryPublicId: cloudinaryResult.public_id,
        cloudinaryUrl: cloudinaryResult.secure_url,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        format: cloudinaryResult.format
      }
    });

    // Gerar URLs responsivas se for imagem
    const responsiveUrls = file.mimetype.startsWith('image/') 
      ? cloudinaryService.generateResponsiveUrls(cloudinaryResult.public_id)
      : null;

    res.status(201).json({
      message: 'Arquivo enviado com sucesso',
      upload: {
        ...upload,
        responsiveUrls
      }
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};

export const getUploads = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      page = '1', 
      limit = '20', 
      category,
      search
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const where: any = {};
    
    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { filename: { contains: search as string, mode: 'insensitive' } },
        { originalName: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [uploads, total] = await Promise.all([
      prisma.upload.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string)
      }),
      prisma.upload.count({ where })
    ]);

    res.json({
      uploads,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar uploads:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteUpload = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const upload = await prisma.upload.findUnique({
      where: { id }
    });

    if (!upload) {
      res.status(404).json({ error: 'Arquivo não encontrado' });
      return;
    }

    // Remover arquivo do Cloudinary
    if (upload.cloudinaryPublicId) {
      try {
        await cloudinaryService.deleteFile(upload.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error('Erro ao deletar do Cloudinary:', cloudinaryError);
        // Continua com a exclusão do banco mesmo se falhar no Cloudinary
      }
    }

    // Remover do banco
    await prisma.upload.delete({
      where: { id }
    });

    res.json({ message: 'Arquivo excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir upload:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const markAsUsed = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isUsed } = req.body;

    const upload = await prisma.upload.update({
      where: { id },
      data: { isUsed }
    });

    res.json(upload);
  } catch (error) {
    console.error('Erro ao marcar arquivo como usado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
