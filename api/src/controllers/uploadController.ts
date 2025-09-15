import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Nenhum arquivo enviado' });
      return;
    }

    const { category = 'general' } = req.body;
    const file = req.file;

    // Se for imagem, otimizar com sharp
    let processedPath = file.path;
    if (file.mimetype.startsWith('image/')) {
      const outputPath = path.join(
        path.dirname(file.path),
        `optimized-${file.filename}`
      );

      await sharp(file.path)
        .resize(1920, 1080, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .png({ quality: 85 })
        .webp({ quality: 85 })
        .toFile(outputPath);

      // Remover arquivo original e usar o otimizado
      fs.unlinkSync(file.path);
      processedPath = outputPath;
    }

    // Salvar no banco
    const upload = await prisma.upload.create({
      data: {
        filename: path.basename(processedPath),
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: processedPath,
        url: `/uploads/${category}/${path.basename(processedPath)}`,
        category,
        isUsed: false
      }
    });

    res.status(201).json({
      message: 'Arquivo enviado com sucesso',
      upload
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
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

    // Remover arquivo físico
    if (fs.existsSync(upload.path)) {
      fs.unlinkSync(upload.path);
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
